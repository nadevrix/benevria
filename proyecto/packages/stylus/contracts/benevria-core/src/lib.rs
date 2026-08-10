//! # BenevrIA — núcleo on-chain de una IA colectiva
//!
//! *BenevrIA* = benevolencia + IA: una inteligencia artificial concebida como **bien
//! común**, no como producto que se alquila.
//!
//! Este contrato es el árbitro de una IA de acceso libre que la comunidad enseña.
//! No guarda conocimiento ni ejecuta modelos: decide, sin que haya que confiar en
//! ningún operador, **qué aporte es genuinamente nuevo**, **cuánto vale**, **qué
//! nivel de modelo se ha ganado la comunidad** y **cómo se reparte el ingreso**.
//!
//! ## Qué hace este contrato que un backend no podría hacer
//!
//! Un servidor puede calcular exactamente lo mismo. Lo que no puede es **probarlo**.
//! Las tres decisiones que aquí viven son justo aquellas donde el operador tiene
//! incentivo a mentir:
//!
//! | Decisión | Si la tomara un backend |
//! |---|---|
//! | ¿Este aporte es novedoso? | "Es duplicado, no cobras" — incomprobable |
//! | ¿Qué nivel de modelo corre? | "Bajó de nivel" mientras se embolsa la diferencia |
//! | ¿Cuánto le toca a cada quien? | Reparto opaco |
//!
//! ## Las dos separaciones que sostienen el diseño
//!
//! 1. **El nivel del modelo es colectivo; el dinero es individual.** Todos usan la
//!    IA que la comunidad ganó, aporten o no —ese es el bien común—. Pero solo cobra
//!    quien aportó, en proporción exacta a su novedad verificada.
//!
//! 2. **Los créditos se venden; los puntos se ganan.** Vender créditos es vender un
//!    servicio. Los puntos son un derecho de cobro sobre la tesorería y **no se pueden
//!    comprar**: emitirlos contra dinero en vez de contra trabajo diluiría a quien
//!    enseñó y convertiría el sistema en otra cosa.
//!
//! ## Qué sube y qué baja el nivel
//!
//! El nivel sube por **conocimiento** acumulado y baja por **falta de fondos**. Esa
//! asimetría es deliberada: castigar colectivamente a los usuarios por el spam de un
//! troll haría que se fueran, mientras que "no hay con qué pagar la inferencia" es
//! honesto, automático y auditable.

#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]

#[macro_use]
extern crate alloc;

use alloc::string::String;
use alloc::vec::Vec;

use stylus_sdk::{
    alloy_primitives::{Address, FixedBytes, I32, U256, U32, U64, U8},
    alloy_sol_types::sol,
    prelude::*,
    stylus_core::log,
};

pub mod vector;
use vector::{BP, DIMS};

// ---------------------------------------------------------------------------
// Parámetros del protocolo
// ---------------------------------------------------------------------------

/// Similitud a partir de la cual un aporte se considera reenvío de algo existente.
/// 9000 bp = coseno 0,90. Por encima de eso, dos textos dicen lo mismo con otras
/// palabras.
const UMBRAL_DUPLICADO: i32 = 9_000;

/// Novedad mínima para que un aporte sea aceptado y emita puntos.
const NOVEDAD_MINIMA: i32 = 1_000; // 10 %

/// Tope del corpus comparado por transacción.
///
/// Cada aporte compara contra los últimos `VENTANA_CORPUS` vectores. Sin tope, el
/// costo de aportar crecería sin límite con el tamaño del corpus hasta que ninguna
/// transacción entrara en un bloque. Es la decisión de ingeniería que mantiene el
/// costo acotado; el barrido completo del histórico se hace fuera de la cadena.
const VENTANA_CORPUS: usize = 256;

/// Bloques de L2 por época. Arbitrum produce bloques cada ~250 ms, así que 4·60·60
/// ≈ 1 hora. Corto a propósito para que el ciclo completo se vea en un demo.
const BLOQUES_POR_EPOCA: u64 = 14_400;

/// Porción del ingreso que va al pozo de los aportantes; el resto financia la
/// inferencia de todos (incluida la de quien nunca aportó nada).
const REPARTO_APORTANTES_BP: u64 = 3_000; // 30 %

/// Puntaje colectivo necesario para cada nivel de modelo.
const UMBRAL_NIVEL: [u64; 3] = [50_000, 250_000, 1_000_000];

/// Costo estimado de una época de inferencia en cada nivel, en wei.
/// Si la tesorería no cubre el nivel, el modelo baja hasta el que sí pueda pagar.
const COSTO_NIVEL: [u128; 4] = [
    0,
    10_000_000_000_000_000,  // 0,01 ETH
    50_000_000_000_000_000,  // 0,05 ETH
    200_000_000_000_000_000, // 0,20 ETH
];

/// Precompilado ArbSys de Arbitrum.
const ARBSYS: Address = Address::new([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x64,
]);

// ---------------------------------------------------------------------------
// Interfaces externas
// ---------------------------------------------------------------------------

/// Selector de `arbBlockNumber()` del precompilado ArbSys — los primeros 4 bytes de
/// su keccak256.
///
/// Se llama a ArbSys con un `static_call` explícito en vez de con `sol_interface!`
/// por una razón concreta: la macro emite una llamada que baja directo al hostio del
/// nodo, sin pasar por la capa de host del SDK. Eso la vuelve imposible de simular en
/// pruebas —revienta con "HostIO functions are not available in stylus-test"—. Con la
/// llamada explícita, **el mismo código corre en cadena y bajo test**.
///
/// Se usa ArbSys porque en Arbitrum `block.number` devuelve el bloque de **L1**, no el
/// de L2. Calcular épocas con él daría un reloj ~12× más lento y desalineado con la
/// cadena donde realmente vive el contrato.
const SEL_ARB_BLOCK_NUMBER: [u8; 4] = [0xa3, 0xb1, 0xb3, 0x1d];

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------

sol! {
    /// Un aporte superó la verificación de novedad y generó puntos.
    event AporteAceptado(
        address indexed autor,
        uint256 indexed indice,
        uint32 indexed tema,
        bytes32 hashContenido,
        int32 novedadBp,
        uint256 puntos
    );

    /// El nivel del modelo colectivo cambió.
    event NivelCambiado(uint8 anterior, uint8 nuevo, uint256 puntajeColectivo, uint256 tesoreria);

    /// Entró dinero al protocolo (venta de créditos o patrocinio).
    event IngresoRecibido(address indexed de, uint256 monto, uint256 aAportantes, uint256 aInferencia);

    /// Alguien reclamó su parte de una época cerrada.
    event Reclamado(address indexed quien, uint256 indexed epoca, uint256 puntos, uint256 monto);

    /// Alguien pidió que la IA aprenda sobre un tema.
    event TemaPedido(uint32 indexed id, address indexed quien, string titulo);

    /// Se sumó un voto de demanda a un tema existente.
    event TemaVotado(uint32 indexed id, address indexed quien, uint32 votos);

    /// El keeper retiró presupuesto autorizado para pagar inferencia.
    event PresupuestoRetirado(address indexed keeper, uint256 epoca, uint256 monto);
}

// ---------------------------------------------------------------------------
// Errores
// ---------------------------------------------------------------------------

sol! {
    /// El vector no tiene la forma esperada.
    #[derive(Debug)]
    error DimensionInvalida();
    /// El aporte es demasiado parecido a algo que ya está en el corpus.
    #[derive(Debug)]
    error AporteDuplicado(int32 similitudBp, uint256 indice);
    /// El aporte es nuevo pero aporta muy poca señal.
    #[derive(Debug)]
    error NovedadInsuficiente(int32 novedadBp, int32 minimo);
    /// Ese contenido exacto ya fue registrado antes.
    #[derive(Debug)]
    error HashRepetido(bytes32 hashContenido);
    /// Solo se puede reclamar de épocas ya cerradas.
    #[derive(Debug)]
    error EpocaAbierta(uint256 epoca, uint256 epocaActual);
    /// No hay nada que reclamar.
    #[derive(Debug)]
    error SinPuntos(address quien, uint256 epoca);
    /// Ya se reclamó esta época.
    #[derive(Debug)]
    error YaReclamado(address quien, uint256 epoca);
    /// La operación requiere ser el dueño del contrato.
    #[derive(Debug)]
    error NoAutorizado(address quien);
    /// El monto solicitado excede lo autorizado.
    #[derive(Debug)]
    error PresupuestoExcedido(uint256 pedido, uint256 disponible);
    /// La transferencia de valor falló.
    #[derive(Debug)]
    error TransferenciaFallida();
    /// El tema referenciado no existe.
    #[derive(Debug)]
    error TemaInexistente(uint32 id);
}

#[derive(SolidityError, Debug)]
pub enum Error {
    DimensionInvalida(DimensionInvalida),
    AporteDuplicado(AporteDuplicado),
    NovedadInsuficiente(NovedadInsuficiente),
    HashRepetido(HashRepetido),
    EpocaAbierta(EpocaAbierta),
    SinPuntos(SinPuntos),
    YaReclamado(YaReclamado),
    NoAutorizado(NoAutorizado),
    PresupuestoExcedido(PresupuestoExcedido),
    TransferenciaFallida(TransferenciaFallida),
    TemaInexistente(TemaInexistente),
}

// ---------------------------------------------------------------------------
// Almacenamiento
// ---------------------------------------------------------------------------

sol_storage! {
    /// Un embedding cuantizado, empaquetado en exactamente dos palabras.
    pub struct Vector64 {
        bytes32 lo;
        bytes32 hi;
    }

    /// Metadatos de un aporte aceptado.
    pub struct Aporte {
        address autor;
        bytes32 hash_contenido;
        uint32 tema;
        int32 novedad_bp;
        uint64 bloque_l2;
    }

    /// Un tema que la comunidad reclama que la IA aprenda.
    pub struct Tema {
        string titulo;
        address solicitante;
        uint32 votos;
        uint32 aportes_recibidos;
    }

    #[entrypoint]
    pub struct BenevriaCore {
        address owner;
        address keeper;

        /// Corpus de embeddings verificados. Paralelo a `aportes`.
        Vector64[] corpus;
        Aporte[] aportes;

        /// Evita registrar dos veces el mismo contenido exacto (barato, antes del
        /// cálculo vectorial, que es lo caro).
        mapping(bytes32 => bool) hash_visto;

        /// Panel de demanda: qué quiere aprender la comunidad.
        Tema[] temas;
        mapping(uint32 => mapping(address => bool)) ya_voto;

        /// Suma de toda la novedad verificada. Es lo que hace subir el nivel.
        uint256 puntaje_colectivo;
        uint8 nivel_actual;

        /// Economía por época.
        mapping(uint256 => mapping(address => uint256)) puntos;
        mapping(uint256 => uint256) puntos_totales;
        mapping(uint256 => uint256) pozo_aportantes;
        mapping(uint256 => mapping(address => bool)) reclamado;

        /// Fondos reservados para pagar inferencia, no repartibles.
        uint256 presupuesto_inferencia;
        uint256 gastado_inferencia;
    }
}

#[public]
impl BenevriaCore {
    #[constructor]
    pub fn constructor(&mut self, owner: Address, keeper: Address) {
        self.owner.set(owner);
        self.keeper.set(keeper);
        self.nivel_actual.set(U8::ZERO);
    }

    // -----------------------------------------------------------------------
    // Núcleo: verificación de novedad on-chain
    // -----------------------------------------------------------------------

    /// Registra un aporte de conocimiento si es genuinamente nuevo.
    ///
    /// El embedding llega ya normalizado, truncado a 64 dimensiones y cuantizado a
    /// `int8` fuera de la cadena —calcularlo aquí requeriría el modelo de embeddings
    /// dentro del contrato, que no cabe—. Lo que **sí** ocurre aquí, y es el punto
    /// entero del diseño, es la **verificación**: el contrato compara contra el corpus
    /// y decide. La IA produce el dato; el contrato lo juzga.
    ///
    /// Revierte si el contenido ya fue visto, si es demasiado similar a algo del
    /// corpus, o si su novedad no llega al mínimo.
    pub fn aportar(
        &mut self,
        lo: FixedBytes<32>,
        hi: FixedBytes<32>,
        hash_contenido: FixedBytes<32>,
        tema: u32,
    ) -> Result<U256, Error> {
        // Filtro barato primero: contenido idéntico no merece gastar el cálculo caro.
        if self.hash_visto.get(hash_contenido) {
            return Err(Error::HashRepetido(HashRepetido { hashContenido: hash_contenido }));
        }

        // El tema 0 es "sin tema"; cualquier otro debe existir.
        let total_temas = self.temas.len() as u32;
        if tema != 0 && tema > total_temas {
            return Err(Error::TemaInexistente(TemaInexistente { id: tema }));
        }

        let nuevo = vector::desempaquetar(&lo.0, &hi.0);

        // --- La parte cara: comparación contra el corpus ---
        let (sim_bp, idx_similar) = self.similitud_contra_corpus(&nuevo);

        if sim_bp >= UMBRAL_DUPLICADO {
            return Err(Error::AporteDuplicado(AporteDuplicado {
                similitudBp: sim_bp,
                indice: U256::from(idx_similar),
            }));
        }

        let novedad = vector::novedad_bp(sim_bp);
        if novedad < NOVEDAD_MINIMA {
            return Err(Error::NovedadInsuficiente(NovedadInsuficiente {
                novedadBp: novedad,
                minimo: NOVEDAD_MINIMA,
            }));
        }

        // --- Aceptado: se persiste ---
        let autor = self.vm().msg_sender();
        let bloque = self.bloque_l2_interno();

        let mut slot = self.corpus.grow();
        slot.lo.set(lo);
        slot.hi.set(hi);

        let mut a = self.aportes.grow();
        a.autor.set(autor);
        a.hash_contenido.set(hash_contenido);
        a.tema.set(U32::from(tema));
        a.novedad_bp.set(I32::try_from(novedad).unwrap_or(I32::ZERO));
        a.bloque_l2.set(U64::from(bloque));

        self.hash_visto.setter(hash_contenido).set(true);

        if tema != 0 {
            if let Some(mut t) = self.temas.setter(tema as usize - 1) {
                let n = t.aportes_recibidos.get();
                t.aportes_recibidos.set(n + U32::from(1u32));
            }
        }

        // Los puntos son la novedad verificada: quien enseña algo más distinto,
        // cobra más. No hay parámetro discrecional del operador en esta fórmula.
        let puntos = U256::from(novedad as u64);
        let epoca = self.epoca_interna(bloque);

        let previos = self.puntos.getter(epoca).get(autor);
        self.puntos.setter(epoca).setter(autor).set(previos + puntos);
        let total = self.puntos_totales.get(epoca);
        self.puntos_totales.setter(epoca).set(total + puntos);

        let colectivo = self.puntaje_colectivo.get() + puntos;
        self.puntaje_colectivo.set(colectivo);

        let indice = U256::from(self.aportes.len() - 1);
        log(
            self.vm(),
            AporteAceptado {
                autor,
                indice,
                tema,
                hashContenido: hash_contenido,
                novedadBp: novedad,
                puntos,
            },
        );

        self.recalcular_nivel();
        Ok(puntos)
    }

    // -----------------------------------------------------------------------
    // Panel de demanda
    // -----------------------------------------------------------------------

    /// Publica un tema que la comunidad necesita que la IA aprenda.
    ///
    /// Resuelve el problema de "¿qué aporto?": el contribuyente no adivina, responde
    /// una demanda concreta. Y le pone precio implícito al conocimiento — los temas
    /// más votados son los más escasos.
    pub fn pedir_tema(&mut self, titulo: String) -> u32 {
        let quien = self.vm().msg_sender();
        let mut t = self.temas.grow();
        t.titulo.set_str(&titulo);
        t.solicitante.set(quien);
        t.votos.set(U32::from(1u32));
        t.aportes_recibidos.set(U32::ZERO);
        let id = self.temas.len() as u32; // 1-indexado: 0 significa "sin tema"
        self.ya_voto.setter(U32::from(id)).setter(quien).set(true);
        log(self.vm(), TemaPedido { id, quien, titulo });
        id
    }

    /// Suma demanda a un tema existente. Un voto por dirección.
    pub fn votar_tema(&mut self, id: u32) -> Result<u32, Error> {
        if id == 0 || id > self.temas.len() as u32 {
            return Err(Error::TemaInexistente(TemaInexistente { id }));
        }
        let quien = self.vm().msg_sender();
        if self.ya_voto.getter(U32::from(id)).get(quien) {
            let actuales = self
                .temas
                .getter(id as usize - 1)
                .map(|t| t.votos.get().to::<u32>())
                .unwrap_or(0);
            return Ok(actuales);
        }
        self.ya_voto.setter(U32::from(id)).setter(quien).set(true);
        let mut t = self.temas.setter(id as usize - 1).unwrap();
        let v = t.votos.get() + U32::from(1u32);
        t.votos.set(v);
        let votos = v.to::<u32>();
        log(self.vm(), TemaVotado { id, quien, votos });
        Ok(votos)
    }

    // -----------------------------------------------------------------------
    // Economía
    // -----------------------------------------------------------------------

    /// Entra dinero al protocolo: venta de créditos, datos o patrocinio.
    ///
    /// Se parte en el acto: una porción al pozo de la época en curso —de donde
    /// cobran los aportantes— y el resto a financiar la inferencia de todos. Ninguna
    /// de las dos partes puede ser desviada por nadie, incluido el dueño.
    #[payable]
    pub fn depositar_ingreso(&mut self) {
        let monto = self.vm().msg_value();
        if monto.is_zero() {
            return;
        }
        let a_aportantes = monto * U256::from(REPARTO_APORTANTES_BP) / U256::from(BP as u64);
        let a_inferencia = monto - a_aportantes;

        let epoca = self.epoca_actual_interna();
        let pozo = self.pozo_aportantes.get(epoca);
        self.pozo_aportantes.setter(epoca).set(pozo + a_aportantes);

        let presupuesto = self.presupuesto_inferencia.get();
        self.presupuesto_inferencia.set(presupuesto + a_inferencia);

        log(
            self.vm(),
            IngresoRecibido {
                de: self.vm().msg_sender(),
                monto,
                aAportantes: a_aportantes,
                aInferencia: a_inferencia,
            },
        );
        self.recalcular_nivel();
    }

    /// Reclama la parte proporcional de una época ya cerrada.
    ///
    /// El reparto es `pozo × puntos_propios / puntos_totales`. No hay lista de
    /// beneficiarios ni criterio discrecional: la fórmula es la misma para todos y
    /// cualquiera puede recalcularla desde los datos públicos del contrato.
    pub fn reclamar(&mut self, epoca: U256) -> Result<U256, Error> {
        let actual = self.epoca_actual_interna();
        if epoca >= actual {
            return Err(Error::EpocaAbierta(EpocaAbierta { epoca, epocaActual: actual }));
        }
        let quien = self.vm().msg_sender();
        if self.reclamado.getter(epoca).get(quien) {
            return Err(Error::YaReclamado(YaReclamado { quien, epoca }));
        }
        let mis_puntos = self.puntos.getter(epoca).get(quien);
        if mis_puntos.is_zero() {
            return Err(Error::SinPuntos(SinPuntos { quien, epoca }));
        }
        let totales = self.puntos_totales.get(epoca);
        let pozo = self.pozo_aportantes.get(epoca);
        let monto = pozo * mis_puntos / totales;

        self.reclamado.setter(epoca).setter(quien).set(true);

        if !monto.is_zero() {
            self.vm()
                .transfer_eth(quien, monto)
                .map_err(|_| Error::TransferenciaFallida(TransferenciaFallida {}))?;
        }
        log(self.vm(), Reclamado { quien, epoca, puntos: mis_puntos, monto });
        Ok(monto)
    }

    /// El keeper retira presupuesto para pagar inferencia vía x402.
    ///
    /// El keeper **no tiene fondos propios ni poder de retiro discrecional**: solo
    /// puede sacar lo que ya fue asignado a inferencia, nunca el pozo de los
    /// aportantes. Es un ejecutor sin privilegios, no un tesorero.
    pub fn retirar_presupuesto(&mut self, monto: U256) -> Result<(), Error> {
        let quien = self.vm().msg_sender();
        if quien != self.keeper.get() {
            return Err(Error::NoAutorizado(NoAutorizado { quien }));
        }
        let disponible = self.presupuesto_inferencia.get();
        if monto > disponible {
            return Err(Error::PresupuestoExcedido(PresupuestoExcedido {
                pedido: monto,
                disponible,
            }));
        }
        self.presupuesto_inferencia.set(disponible - monto);
        let gastado = self.gastado_inferencia.get();
        self.gastado_inferencia.set(gastado + monto);

        self.vm()
            .transfer_eth(quien, monto)
            .map_err(|_| Error::TransferenciaFallida(TransferenciaFallida {}))?;

        let epoca = self.epoca_actual_interna();
        log(self.vm(), PresupuestoRetirado { keeper: quien, epoca, monto });
        self.recalcular_nivel();
        Ok(())
    }

    // -----------------------------------------------------------------------
    // Lectura
    // -----------------------------------------------------------------------

    /// Nivel de modelo vigente (0–3). Es el mínimo entre lo que la comunidad se
    /// ganó por conocimiento y lo que la tesorería puede pagar.
    pub fn nivel(&self) -> u8 {
        self.nivel_actual.get().to::<u8>()
    }

    /// Nivel que el conocimiento acumulado justifica, ignorando el dinero.
    pub fn nivel_por_conocimiento(&self) -> u8 {
        let p = self.puntaje_colectivo.get();
        let mut n = 0u8;
        for (i, u) in UMBRAL_NIVEL.iter().enumerate() {
            if p >= U256::from(*u) {
                n = (i + 1) as u8;
            }
        }
        n
    }

    /// Nivel que la tesorería puede sostener, ignorando el conocimiento.
    pub fn nivel_por_tesoreria(&self) -> u8 {
        let saldo = self.presupuesto_inferencia.get();
        let mut n = 0u8;
        for i in (1..COSTO_NIVEL.len()).rev() {
            if saldo >= U256::from(COSTO_NIVEL[i]) {
                n = i as u8;
                break;
            }
        }
        n
    }

    /// Cuánto falta —en puntos— para alcanzar el siguiente nivel. Cero si ya está
    /// en el máximo. Alimenta la barra de progreso del panel.
    pub fn falta_para_siguiente_nivel(&self) -> U256 {
        let n = self.nivel_por_conocimiento() as usize;
        if n >= UMBRAL_NIVEL.len() {
            return U256::ZERO;
        }
        let objetivo = U256::from(UMBRAL_NIVEL[n]);
        let actual = self.puntaje_colectivo.get();
        if actual >= objetivo {
            U256::ZERO
        } else {
            objetivo - actual
        }
    }

    pub fn puntaje_colectivo(&self) -> U256 {
        self.puntaje_colectivo.get()
    }

    pub fn tamano_corpus(&self) -> U256 {
        U256::from(self.corpus.len())
    }

    pub fn total_temas(&self) -> U256 {
        U256::from(self.temas.len())
    }

    /// Devuelve un tema del panel de demanda: título, votos y aportes recibidos.
    pub fn tema(&self, id: u32) -> Result<(String, Address, u32, u32), Error> {
        if id == 0 || id > self.temas.len() as u32 {
            return Err(Error::TemaInexistente(TemaInexistente { id }));
        }
        let t = self.temas.getter(id as usize - 1).unwrap();
        Ok((
            t.titulo.get_string(),
            t.solicitante.get(),
            t.votos.get().to::<u32>(),
            t.aportes_recibidos.get().to::<u32>(),
        ))
    }

    pub fn puntos_de(&self, quien: Address, epoca: U256) -> U256 {
        self.puntos.getter(epoca).get(quien)
    }

    pub fn puntos_totales_de(&self, epoca: U256) -> U256 {
        self.puntos_totales.get(epoca)
    }

    pub fn pozo_de(&self, epoca: U256) -> U256 {
        self.pozo_aportantes.get(epoca)
    }

    /// Cuánto podría reclamar una dirección por una época dada.
    pub fn reclamable(&self, quien: Address, epoca: U256) -> U256 {
        if self.reclamado.getter(epoca).get(quien) {
            return U256::ZERO;
        }
        let totales = self.puntos_totales.get(epoca);
        if totales.is_zero() {
            return U256::ZERO;
        }
        self.pozo_aportantes.get(epoca) * self.puntos.getter(epoca).get(quien) / totales
    }

    pub fn presupuesto_inferencia(&self) -> U256 {
        self.presupuesto_inferencia.get()
    }

    pub fn gastado_inferencia(&self) -> U256 {
        self.gastado_inferencia.get()
    }

    /// Bloque real de L2, leído del precompilado ArbSys.
    ///
    /// En Arbitrum `block.number` devuelve el bloque de **L1**. Usarlo para las
    /// épocas daría un reloj equivocado.
    pub fn bloque_l2(&self) -> U256 {
        U256::from(self.bloque_l2_interno())
    }

    pub fn epoca_actual(&self) -> U256 {
        self.epoca_actual_interna()
    }

    pub fn owner(&self) -> Address {
        self.owner.get()
    }

    pub fn keeper(&self) -> Address {
        self.keeper.get()
    }

    /// Permite al dueño rotar el keeper si se compromete su clave.
    pub fn set_keeper(&mut self, nuevo: Address) -> Result<(), Error> {
        let quien = self.vm().msg_sender();
        if quien != self.owner.get() {
            return Err(Error::NoAutorizado(NoAutorizado { quien }));
        }
        self.keeper.set(nuevo);
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// Lógica interna (no expuesta en el ABI)
// ---------------------------------------------------------------------------

impl BenevriaCore {
    /// Compara el vector nuevo contra la ventana reciente del corpus.
    fn similitud_contra_corpus(&self, nuevo: &[i8; DIMS]) -> (i32, usize) {
        let total = self.corpus.len();
        if total == 0 {
            return (-BP, 0);
        }
        let desde = total.saturating_sub(VENTANA_CORPUS);
        let mut mejor = i32::MIN;
        let mut idx = 0usize;

        for i in desde..total {
            let v = match self.corpus.getter(i) {
                Some(v) => v,
                None => continue,
            };
            let lo = v.lo.get().0;
            let hi = v.hi.get().0;
            let existente = vector::desempaquetar(&lo, &hi);
            let s = vector::similitud_bp(vector::producto_punto(nuevo, &existente));
            if s > mejor {
                mejor = s;
                idx = i;
            }
            // Salida temprana: ya es duplicado, seguir es gas quemado.
            if s >= UMBRAL_DUPLICADO {
                return (s, i);
            }
        }
        (mejor, idx)
    }

    /// Lee el bloque de L2 del precompilado ArbSys, con respaldo al bloque del VM
    /// para que los tests y el devnode local funcionen sin el precompilado.
    fn bloque_l2_interno(&self) -> u64 {
        // El contexto de la llamada es el propio contrato: `&T` implementa
        // `StaticCallContext` para todo `T: TopLevelStorage`.
        match self.vm().static_call(&self, ARBSYS, &SEL_ARB_BLOCK_NUMBER) {
            Ok(datos) if datos.len() >= 32 => {
                let mut b = [0u8; 8];
                b.copy_from_slice(&datos[24..32]);
                u64::from_be_bytes(b)
            }
            // Respaldo: en un devnode sin precompilados el contrato sigue funcionando,
            // solo con un reloj menos preciso.
            _ => self.vm().block_number(),
        }
    }

    fn epoca_interna(&self, bloque_l2: u64) -> U256 {
        U256::from(bloque_l2 / BLOQUES_POR_EPOCA)
    }

    fn epoca_actual_interna(&self) -> U256 {
        self.epoca_interna(self.bloque_l2_interno())
    }

    /// Recalcula el nivel y emite evento solo si cambió.
    fn recalcular_nivel(&mut self) {
        let anterior = self.nivel_actual.get().to::<u8>();
        let por_conocimiento = self.nivel_por_conocimiento();
        let por_tesoreria = self.nivel_por_tesoreria();
        let nuevo = core::cmp::min(por_conocimiento, por_tesoreria);
        if nuevo != anterior {
            self.nivel_actual.set(U8::from(nuevo));
            log(
                self.vm(),
                NivelCambiado {
                    anterior,
                    nuevo,
                    puntajeColectivo: self.puntaje_colectivo.get(),
                    tesoreria: self.presupuesto_inferencia.get(),
                },
            );
        }
    }
}

// ---------------------------------------------------------------------------
// Tests del contrato
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests_contrato {
    use super::*;
    // Import selectivo: `testing::*` trae su propio `Error` y colisiona con el nuestro.
    use stylus_sdk::testing::TestVM;

    /// Simula el precompilado ArbSys devolviendo un número de bloque de L2.
    ///
    /// El SDK de pruebas no trae precompilados, así que la llamada externa se simula.
    /// Es la forma correcta de hacerlo: antes esto estaba parcheado con stubs
    /// `#[no_mangle]`, que dejaron de funcionar al subir de versión el SDK.
    fn simular_arbsys(vm: &TestVM, bloque_l2: u64) {
        let mut retorno = [0u8; 32];
        retorno[24..32].copy_from_slice(&bloque_l2.to_be_bytes());
        vm.mock_static_call(ARBSYS, SEL_ARB_BLOCK_NUMBER.to_vec(), Ok(retorno.to_vec()));
    }

    const DUENO: Address = Address::new([0x11; 20]);
    const KEEPER: Address = Address::new([0x22; 20]);
    const PROFESORA: Address = Address::new([0xAA; 20]);
    const INGENIERO: Address = Address::new([0xBB; 20]);

    /// Construye un vector unitario cuantizado sobre un eje dado.
    fn vec_eje(eje: usize) -> (FixedBytes<32>, FixedBytes<32>) {
        let mut v = [0i8; DIMS];
        v[eje % DIMS] = 127;
        let (lo, hi) = vector::empaquetar(&v);
        (FixedBytes::from(lo), FixedBytes::from(hi))
    }

    fn hash(n: u8) -> FixedBytes<32> {
        FixedBytes::from([n; 32])
    }

    fn nuevo() -> (TestVM, BenevriaCore) {
        let vm = TestVM::default();
        simular_arbsys(&vm, 1_000);
        let mut c = BenevriaCore::from(&vm);
        c.constructor(DUENO, KEEPER);
        (vm, c)
    }

    #[test]
    fn el_primer_aporte_es_novedad_total() {
        let (_vm, mut c) = nuevo();
        let (lo, hi) = vec_eje(0);
        let puntos = c.aportar(lo, hi, hash(1), 0).expect("debe aceptarse");
        // Corpus vacío => novedad máxima => 10000 bp de puntos.
        assert_eq!(puntos, U256::from(10_000u64));
        assert_eq!(c.tamano_corpus(), U256::from(1));
        assert_eq!(c.puntaje_colectivo(), U256::from(10_000u64));
    }

    #[test]
    fn rechaza_el_mismo_contenido_dos_veces() {
        let (_vm, mut c) = nuevo();
        let (lo, hi) = vec_eje(0);
        c.aportar(lo, hi, hash(1), 0).unwrap();
        let (lo2, hi2) = vec_eje(7);
        let err = c.aportar(lo2, hi2, hash(1), 0).unwrap_err();
        assert!(matches!(err, Error::HashRepetido(_)), "esperaba HashRepetido");
    }

    #[test]
    fn rechaza_el_reenvio_parafraseado() {
        // El ataque real: mismo conocimiento, otro hash de contenido.
        let (_vm, mut c) = nuevo();
        let (lo, hi) = vec_eje(0);
        c.aportar(lo, hi, hash(1), 0).unwrap();
        let err = c.aportar(lo, hi, hash(2), 0).unwrap_err();
        match err {
            Error::AporteDuplicado(d) => assert_eq!(d.similitudBp, 10_000),
            otro => panic!("esperaba AporteDuplicado, obtuve {:?}", otro),
        }
        assert_eq!(c.tamano_corpus(), U256::from(1), "no debe crecer el corpus");
    }

    #[test]
    fn acepta_conocimiento_genuinamente_distinto() {
        let (_vm, mut c) = nuevo();
        let (lo, hi) = vec_eje(0);
        c.aportar(lo, hi, hash(1), 0).unwrap();
        let (lo2, hi2) = vec_eje(1); // ortogonal
        let puntos = c.aportar(lo2, hi2, hash(2), 0).expect("ortogonal debe pasar");
        assert_eq!(puntos, U256::from(10_000u64));
        assert_eq!(c.tamano_corpus(), U256::from(2));
    }

    #[test]
    fn el_nivel_sube_con_el_conocimiento_colectivo() {
        let (_vm, mut c) = nuevo();
        assert_eq!(c.nivel_por_conocimiento(), 0);
        // Cada aporte ortogonal da 10.000 puntos; el nivel 1 pide 50.000.
        for i in 0..5 {
            let (lo, hi) = vec_eje(i);
            c.aportar(lo, hi, hash(i as u8 + 1), 0).unwrap();
        }
        assert_eq!(c.puntaje_colectivo(), U256::from(50_000u64));
        assert_eq!(c.nivel_por_conocimiento(), 1);
    }

    #[test]
    fn sin_tesoreria_el_nivel_efectivo_es_cero() {
        let (_vm, mut c) = nuevo();
        for i in 0..5 {
            let (lo, hi) = vec_eje(i);
            c.aportar(lo, hi, hash(i as u8 + 1), 0).unwrap();
        }
        // La comunidad se ganó el nivel 1, pero no hay con qué pagar la inferencia.
        assert_eq!(c.nivel_por_conocimiento(), 1);
        assert_eq!(c.nivel_por_tesoreria(), 0);
        assert_eq!(c.nivel(), 0, "el nivel efectivo es el mínimo de los dos");
    }

    #[test]
    fn con_conocimiento_y_fondos_el_nivel_sube_de_verdad() {
        let (vm, mut c) = nuevo();
        for i in 0..5 {
            let (lo, hi) = vec_eje(i);
            c.aportar(lo, hi, hash(i as u8 + 1), 0).unwrap();
        }
        // 0,05 ETH de ingreso: el 70 % va a inferencia = 0,035 ETH => cubre nivel 1.
        vm.set_value(U256::from(50_000_000_000_000_000u64));
        c.depositar_ingreso();
        assert_eq!(c.nivel_por_tesoreria(), 1);
        assert_eq!(c.nivel(), 1);
    }

    #[test]
    fn el_ingreso_se_parte_entre_aportantes_e_inferencia() {
        let (vm, mut c) = nuevo();
        vm.set_value(U256::from(1_000_000u64));
        c.depositar_ingreso();
        let epoca = c.epoca_actual();
        // 30 % a aportantes, 70 % a inferencia.
        assert_eq!(c.pozo_de(epoca), U256::from(300_000u64));
        assert_eq!(c.presupuesto_inferencia(), U256::from(700_000u64));
    }

    #[test]
    fn el_reparto_es_proporcional_a_la_novedad_aportada() {
        let (vm, mut c) = nuevo();

        // La profesora aporta algo totalmente nuevo (10.000 bp).
        vm.set_sender(PROFESORA);
        let (lo, hi) = vec_eje(0);
        let p1 = c.aportar(lo, hi, hash(1), 0).unwrap();

        // El ingeniero aporta algo también nuevo (10.000 bp).
        vm.set_sender(INGENIERO);
        let (lo2, hi2) = vec_eje(1);
        let p2 = c.aportar(lo2, hi2, hash(2), 0).unwrap();
        assert_eq!(p1, p2);

        vm.set_value(U256::from(1_000_000u64));
        c.depositar_ingreso();

        let epoca = c.epoca_actual();
        // Aportaron lo mismo: les toca la mitad del pozo a cada uno.
        assert_eq!(c.reclamable(PROFESORA, epoca), U256::from(150_000u64));
        assert_eq!(c.reclamable(INGENIERO, epoca), U256::from(150_000u64));
    }

    #[test]
    fn no_se_puede_reclamar_una_epoca_abierta() {
        let (vm, mut c) = nuevo();
        vm.set_sender(PROFESORA);
        let (lo, hi) = vec_eje(0);
        c.aportar(lo, hi, hash(1), 0).unwrap();
        let epoca = c.epoca_actual();
        let err = c.reclamar(epoca).unwrap_err();
        assert!(matches!(err, Error::EpocaAbierta(_)));
    }

    #[test]
    fn quien_no_aporto_no_puede_reclamar() {
        let (vm, mut c) = nuevo();
        // El reloj que manda es el de L2, via ArbSys — no `block.number`.
        simular_arbsys(&vm, BLOQUES_POR_EPOCA * 2);
        vm.set_sender(PROFESORA);
        let err = c.reclamar(U256::from(0)).unwrap_err();
        assert!(matches!(err, Error::SinPuntos(_)), "esperaba SinPuntos");
    }

    #[test]
    fn solo_el_keeper_retira_presupuesto() {
        let (vm, mut c) = nuevo();
        vm.set_value(U256::from(1_000_000u64));
        c.depositar_ingreso();

        vm.set_sender(PROFESORA);
        let err = c.retirar_presupuesto(U256::from(1)).unwrap_err();
        assert!(matches!(err, Error::NoAutorizado(_)));
    }

    #[test]
    fn el_keeper_no_puede_tocar_el_pozo_de_los_aportantes() {
        let (vm, mut c) = nuevo();
        vm.set_value(U256::from(1_000_000u64));
        c.depositar_ingreso();
        // Presupuesto de inferencia = 700.000. El pozo (300.000) es intocable.
        vm.set_sender(KEEPER);
        let err = c.retirar_presupuesto(U256::from(700_001u64)).unwrap_err();
        match err {
            Error::PresupuestoExcedido(e) => {
                assert_eq!(e.disponible, U256::from(700_000u64));
            }
            otro => panic!("esperaba PresupuestoExcedido, obtuve {:?}", otro),
        }
    }

    #[test]
    fn el_panel_de_temas_registra_demanda() {
        let (vm, mut c) = nuevo();
        vm.set_sender(PROFESORA);
        let id = c.pedir_tema("Trámites notariales en Bolivia".into());
        assert_eq!(id, 1);
        assert_eq!(c.total_temas(), U256::from(1));

        let (titulo, quien, votos, aportes) = c.tema(1).unwrap();
        assert_eq!(titulo, "Trámites notariales en Bolivia");
        assert_eq!(quien, PROFESORA);
        assert_eq!(votos, 1);
        assert_eq!(aportes, 0);

        // Otro usuario suma demanda.
        vm.set_sender(INGENIERO);
        assert_eq!(c.votar_tema(1).unwrap(), 2);
        // Pero no puede votar dos veces.
        assert_eq!(c.votar_tema(1).unwrap(), 2);
    }

    #[test]
    fn aportar_a_un_tema_incrementa_su_contador() {
        let (vm, mut c) = nuevo();
        vm.set_sender(PROFESORA);
        let id = c.pedir_tema("Jerga de obra en Santa Cruz".into());
        let (lo, hi) = vec_eje(3);
        c.aportar(lo, hi, hash(9), id).unwrap();
        let (_, _, _, aportes) = c.tema(id).unwrap();
        assert_eq!(aportes, 1);
    }

    #[test]
    fn rechaza_aportes_a_temas_inexistentes() {
        let (_vm, mut c) = nuevo();
        let (lo, hi) = vec_eje(0);
        let err = c.aportar(lo, hi, hash(1), 99).unwrap_err();
        assert!(matches!(err, Error::TemaInexistente(_)));
    }

    #[test]
    fn el_dueno_puede_rotar_el_keeper() {
        let (vm, mut c) = nuevo();
        vm.set_sender(DUENO);
        c.set_keeper(INGENIERO).unwrap();
        assert_eq!(c.keeper(), INGENIERO);

        vm.set_sender(PROFESORA);
        assert!(matches!(c.set_keeper(PROFESORA).unwrap_err(), Error::NoAutorizado(_)));
    }

    #[test]
    fn la_barra_de_progreso_refleja_lo_que_falta() {
        let (_vm, mut c) = nuevo();
        assert_eq!(c.falta_para_siguiente_nivel(), U256::from(50_000u64));
        let (lo, hi) = vec_eje(0);
        c.aportar(lo, hi, hash(1), 0).unwrap();
        assert_eq!(c.falta_para_siguiente_nivel(), U256::from(40_000u64));
    }
}
