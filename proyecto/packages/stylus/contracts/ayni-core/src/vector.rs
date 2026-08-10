//! Matemática vectorial en punto fijo para la verificación de novedad on-chain.
//!
//! # Por qué esto vive dentro del contrato
//!
//! El ataque económicamente racional contra un sistema de "aporta y gana" no es
//! escribir basura —eso lo filtran heurísticas triviales fuera de la cadena— sino
//! **reenviar conocimiento que ya está en el corpus, ligeramente reformulado**.
//! Detectarlo exige comparar el aporte nuevo contra todo lo ya almacenado.
//!
//! Esa comparación es justo la pieza que **no puede vivir off-chain**: es la que
//! decide si a alguien se le paga o no. Si el servidor del operador dictamina
//! "esto es duplicado, no cobras", nadie puede auditarlo y el reparto deja de ser
//! confiable. Por eso corre dentro del contrato.
//!
//! # Por qué Stylus y no Solidity
//!
//! Cada aporte cuesta `N × DIMS` multiplicaciones-sumas, donde `N` es el tamaño del
//! corpus. Con 200 vectores almacenados son 12.800 operaciones enteras **por
//! transacción**. En la EVM cada una consume gas de opcode y el corpus se lee palabra
//! a palabra: el costo crece hasta volver la operación impagable. En WASM compilado
//! a código nativo es aritmética de registro.
//!
//! # Representación
//!
//! Los embeddings llegan normalizados a norma L2 = 1 y cuantizados a `int8`:
//!
//! ```text
//!   â[i] = round(127 · a[i])        con a[i] ∈ [-1, 1]
//! ```
//!
//! Para vectores unitarios la similitud coseno **es** el producto punto, así que:
//!
//! ```text
//!   dot(â, b̂) ≈ 127² · cos(a, b) = 16129 · cos(a, b)
//! ```
//!
//! Se trabaja en *basis points* (1 bp = 0,01 %) para no usar coma flotante, que
//! además no es determinista entre nodos.

/// Dimensiones del embedding tras truncar.
///
/// Los modelos de embeddings sirven vectores de 768 o 1536 dimensiones. Guardar y
/// comparar eso on-chain sería absurdo. Los modelos tipo Matryoshka permiten
/// **truncar** el vector conservando la mayor parte de la señal semántica en las
/// primeras dimensiones, así que se recorta a 64 y se re-normaliza fuera de la cadena.
///
/// 64 dimensiones × 1 byte = 64 bytes = exactamente **2 palabras de storage**.
pub const DIMS: usize = 64;

/// Factor de cuantización: `int8` útil va de -127 a 127.
pub const ESCALA: i32 = 127;

/// Producto punto máximo teórico entre dos vectores unitarios cuantizados.
pub const DOT_MAX: i32 = ESCALA * ESCALA; // 16129

/// Un basis point es 1/10.000.
pub const BP: i32 = 10_000;

/// Desempaqueta dos palabras de 32 bytes en un vector de 64 componentes `int8`.
///
/// El storage guarda los vectores como dos `bytes32` en vez de un `bytes` dinámico:
/// evita el overhead de longitud y deja la lectura en exactamente 2 `SLOAD`.
pub fn desempaquetar(lo: &[u8; 32], hi: &[u8; 32]) -> [i8; DIMS] {
    let mut v = [0i8; DIMS];
    for i in 0..32 {
        v[i] = lo[i] as i8;
        v[i + 32] = hi[i] as i8;
    }
    v
}

/// Empaqueta un vector de 64 `int8` en dos palabras de 32 bytes.
pub fn empaquetar(v: &[i8; DIMS]) -> ([u8; 32], [u8; 32]) {
    let mut lo = [0u8; 32];
    let mut hi = [0u8; 32];
    for i in 0..32 {
        lo[i] = v[i] as u8;
        hi[i] = v[i + 32] as u8;
    }
    (lo, hi)
}

/// Producto punto entre dos vectores cuantizados.
///
/// El acumulador es `i32`: el máximo posible es `64 · 127 · 127 = 1.032.256`, muy
/// por debajo del límite de `i32`, así que no puede desbordar.
#[inline]
pub fn producto_punto(a: &[i8; DIMS], b: &[i8; DIMS]) -> i32 {
    let mut acc: i32 = 0;
    for i in 0..DIMS {
        acc += (a[i] as i32) * (b[i] as i32);
    }
    acc
}

/// Convierte un producto punto a similitud coseno en basis points.
///
/// Devuelve un valor en `[-10000, 10000]`, donde 10000 = vectores idénticos.
#[inline]
pub fn similitud_bp(dot: i32) -> i32 {
    let s = (dot as i64 * BP as i64) / DOT_MAX as i64;
    // La cuantización puede empujar el resultado un pelo fuera del rango.
    if s > BP as i64 {
        BP
    } else if s < -(BP as i64) {
        -BP
    } else {
        s as i32
    }
}

/// Similitud máxima de `nuevo` contra un conjunto de vectores ya almacenados.
///
/// Corta en cuanto encuentra algo por encima de `umbral_corte`: si ya sabemos que es
/// duplicado, seguir comparando contra el resto del corpus es gas quemado sin
/// aportar información. Con corpus grande esta salida temprana es la diferencia
/// entre una transacción viable y una que no cabe en el bloque.
pub fn similitud_maxima(
    nuevo: &[i8; DIMS],
    corpus: &[[i8; DIMS]],
    umbral_corte: i32,
) -> (i32, usize) {
    let mut mejor = i32::MIN;
    let mut idx = 0usize;
    for (i, v) in corpus.iter().enumerate() {
        let s = similitud_bp(producto_punto(nuevo, v));
        if s > mejor {
            mejor = s;
            idx = i;
        }
        if s >= umbral_corte {
            return (s, i);
        }
    }
    if mejor == i32::MIN {
        // Corpus vacío: el primer aporte es novedad total por definición.
        (-BP, 0)
    } else {
        (mejor, idx)
    }
}

/// Novedad = complemento de la similitud, acotada a `[0, 10000]`.
///
/// Un aporte ortogonal al corpus (similitud 0) da 10000 bp de novedad; uno idéntico
/// da 0. Las similitudes negativas se tratan como novedad máxima.
#[inline]
pub fn novedad_bp(sim_bp: i32) -> i32 {
    let n = BP - sim_bp;
    if n < 0 {
        0
    } else if n > BP {
        BP
    } else {
        n
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn unitario_en(eje: usize) -> [i8; DIMS] {
        let mut v = [0i8; DIMS];
        v[eje] = ESCALA as i8;
        v
    }

    #[test]
    fn vector_identico_da_similitud_maxima() {
        let a = unitario_en(0);
        assert_eq!(similitud_bp(producto_punto(&a, &a)), BP);
        assert_eq!(novedad_bp(BP), 0);
    }

    #[test]
    fn vectores_ortogonales_dan_similitud_cero() {
        let a = unitario_en(0);
        let b = unitario_en(1);
        assert_eq!(similitud_bp(producto_punto(&a, &b)), 0);
        assert_eq!(novedad_bp(0), BP);
    }

    #[test]
    fn vector_opuesto_da_similitud_negativa() {
        let a = unitario_en(0);
        let mut b = [0i8; DIMS];
        b[0] = -(ESCALA as i8);
        assert_eq!(similitud_bp(producto_punto(&a, &b)), -BP);
        // Se trata como novedad máxima, no como 20000.
        assert_eq!(novedad_bp(-BP), BP);
    }

    #[test]
    fn empaquetar_y_desempaquetar_son_inversos() {
        let mut v = [0i8; DIMS];
        for i in 0..DIMS {
            v[i] = (i as i32 - 32) as i8;
        }
        let (lo, hi) = empaquetar(&v);
        assert_eq!(desempaquetar(&lo, &hi), v);
    }

    #[test]
    fn empaquetado_soporta_valores_negativos() {
        // El caso que rompe una implementación ingenua: -1 como u8 es 255.
        let mut v = [0i8; DIMS];
        v[0] = -1;
        v[63] = -128;
        let (lo, hi) = empaquetar(&v);
        assert_eq!(lo[0], 255u8);
        assert_eq!(hi[31], 128u8);
        assert_eq!(desempaquetar(&lo, &hi), v);
    }

    #[test]
    fn corpus_vacio_es_novedad_total() {
        let a = unitario_en(0);
        let (sim, _) = similitud_maxima(&a, &[], 9000);
        assert_eq!(novedad_bp(sim), BP);
    }

    #[test]
    fn detecta_el_duplicado_dentro_del_corpus() {
        let a = unitario_en(0);
        let corpus = [unitario_en(5), unitario_en(3), a, unitario_en(9)];
        let (sim, idx) = similitud_maxima(&a, &corpus, 9000);
        assert_eq!(sim, BP);
        assert_eq!(idx, 2, "debe señalar cuál es el duplicado");
    }

    #[test]
    fn corta_temprano_al_superar_el_umbral() {
        // El duplicado está en la posición 1; no debe seguir hasta el final.
        let a = unitario_en(0);
        let corpus = [unitario_en(7), a, unitario_en(2)];
        let (sim, idx) = similitud_maxima(&a, &corpus, 9000);
        assert_eq!(idx, 1);
        assert_eq!(sim, BP);
    }

    #[test]
    fn producto_punto_no_desborda_en_el_peor_caso() {
        let v = [127i8; DIMS];
        assert_eq!(producto_punto(&v, &v), DIMS as i32 * 127 * 127);
        assert_eq!(producto_punto(&v, &v), 1_032_256);
    }

    #[test]
    fn similitud_parcial_cae_entre_los_extremos() {
        // Vector a 45° en el plano (0,1): ambas componentes ≈ 127/√2 ≈ 90.
        let a = unitario_en(0);
        let mut b = [0i8; DIMS];
        b[0] = 90;
        b[1] = 90;
        let s = similitud_bp(producto_punto(&a, &b));
        assert!(s > 6_800 && s < 7_300, "esperaba ~7071 bp, obtuve {}", s);
    }
}
