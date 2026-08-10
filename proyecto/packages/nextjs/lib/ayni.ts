/**
 * Contrato AyniCore: dirección, ABI y constantes compartidas.
 *
 * La dirección se lee de una variable de entorno para que el despliegue no exija
 * recompilar el frontend. Se rellena al correr `yarn deploy`.
 */

export const AYNI_ADDRESS = (process.env.NEXT_PUBLIC_AYNI_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const CHAIN_ID = 421614; // Arbitrum Sepolia

/** Dimensiones del embedding tras truncar. Debe coincidir con `vector::DIMS`. */
export const DIMS = 64;

/** Escala de cuantización int8. Debe coincidir con `vector::ESCALA`. */
export const ESCALA = 127;

/**
 * Modelos por nivel. El contrato solo guarda el número de nivel; el mapeo a un
 * modelo concreto vive aquí porque cambiar de proveedor no debería costar un
 * despliegue.
 *
 * Solo modelos de pesos abiertos: revender acceso a modelos propietarios
 * (Claude, Gemini, GPT) choca con los términos de servicio de sus dueños.
 */
export const MODELOS_POR_NIVEL: Record<number, { id: string; nombre: string; nota: string }> = {
  0: {
    id: "meta-llama/llama-3.2-3b-instruct",
    nombre: "Llama 3.2 3B",
    nota: "Nivel base: la comunidad aún no ha desbloqueado nada",
  },
  1: {
    id: "qwen/qwen-2.5-7b-instruct",
    nombre: "Qwen 2.5 7B",
    nota: "Desbloqueado por la comunidad",
  },
  2: {
    id: "deepseek/deepseek-chat",
    nombre: "DeepSeek V3",
    nota: "Desbloqueado por la comunidad",
  },
  3: {
    id: "moonshotai/kimi-k2",
    nombre: "Kimi K2",
    nota: "Nivel máximo alcanzado por la comunidad",
  },
};

export const NOMBRES_NIVEL = ["Base", "Bronce", "Plata", "Oro"];

/** ABI del contrato, generado con `cargo stylus export-abi`. */
export const AYNI_ABI = [
  {
    type: "function",
    name: "aportar",
    stateMutability: "nonpayable",
    inputs: [
      { name: "lo", type: "bytes32" },
      { name: "hi", type: "bytes32" },
      { name: "hash_contenido", type: "bytes32" },
      { name: "tema", type: "uint32" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "pedirTema",
    stateMutability: "nonpayable",
    inputs: [{ name: "titulo", type: "string" }],
    outputs: [{ type: "uint32" }],
  },
  {
    type: "function",
    name: "votarTema",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint32" }],
    outputs: [{ type: "uint32" }],
  },
  { type: "function", name: "depositarIngreso", stateMutability: "payable", inputs: [], outputs: [] },
  {
    type: "function",
    name: "reclamar",
    stateMutability: "nonpayable",
    inputs: [{ name: "epoca", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "retirarPresupuesto",
    stateMutability: "nonpayable",
    inputs: [{ name: "monto", type: "uint256" }],
    outputs: [],
  },
  { type: "function", name: "nivel", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  {
    type: "function",
    name: "nivelPorConocimiento",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "nivelPorTesoreria",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "faltaParaSiguienteNivel",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  { type: "function", name: "puntajeColectivo", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "tamanoCorpus", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalTemas", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "tema",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint32" }],
    outputs: [{ type: "string" }, { type: "address" }, { type: "uint32" }, { type: "uint32" }],
  },
  {
    type: "function",
    name: "puntosDe",
    stateMutability: "view",
    inputs: [
      { name: "quien", type: "address" },
      { name: "epoca", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "puntosTotalesDe",
    stateMutability: "view",
    inputs: [{ name: "epoca", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "pozoDe",
    stateMutability: "view",
    inputs: [{ name: "epoca", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "reclamable",
    stateMutability: "view",
    inputs: [
      { name: "quien", type: "address" },
      { name: "epoca", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "presupuestoInferencia",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  { type: "function", name: "gastadoInferencia", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "bloqueL2", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "epocaActual", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "keeper", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  {
    type: "function",
    name: "setKeeper",
    stateMutability: "nonpayable",
    inputs: [{ name: "nuevo", type: "address" }],
    outputs: [],
  },
  // --- Eventos ---
  {
    type: "event",
    name: "AporteAceptado",
    inputs: [
      { name: "autor", type: "address", indexed: true },
      { name: "indice", type: "uint256", indexed: true },
      { name: "tema", type: "uint32", indexed: true },
      { name: "hashContenido", type: "bytes32", indexed: false },
      { name: "novedadBp", type: "int32", indexed: false },
      { name: "puntos", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "NivelCambiado",
    inputs: [
      { name: "anterior", type: "uint8", indexed: false },
      { name: "nuevo", type: "uint8", indexed: false },
      { name: "puntajeColectivo", type: "uint256", indexed: false },
      { name: "tesoreria", type: "uint256", indexed: false },
    ],
  },
  // --- Errores (para decodificar reverts con mensaje útil) ---
  {
    type: "error",
    name: "AporteDuplicado",
    inputs: [
      { name: "similitudBp", type: "int32" },
      { name: "indice", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "NovedadInsuficiente",
    inputs: [
      { name: "novedadBp", type: "int32" },
      { name: "minimo", type: "int32" },
    ],
  },
  { type: "error", name: "HashRepetido", inputs: [{ name: "hashContenido", type: "bytes32" }] },
  {
    type: "error",
    name: "EpocaAbierta",
    inputs: [
      { name: "epoca", type: "uint256" },
      { name: "epocaActual", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "SinPuntos",
    inputs: [
      { name: "quien", type: "address" },
      { name: "epoca", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "YaReclamado",
    inputs: [
      { name: "quien", type: "address" },
      { name: "epoca", type: "uint256" },
    ],
  },
  { type: "error", name: "NoAutorizado", inputs: [{ name: "quien", type: "address" }] },
  {
    type: "error",
    name: "PresupuestoExcedido",
    inputs: [
      { name: "pedido", type: "uint256" },
      { name: "disponible", type: "uint256" },
    ],
  },
  { type: "error", name: "TemaInexistente", inputs: [{ name: "id", type: "uint32" }] },
  { type: "error", name: "TransferenciaFallida", inputs: [] },
  { type: "error", name: "DimensionInvalida", inputs: [] },
] as const;

/** Traduce un error del contrato a algo que un humano entienda. */
export function explicarError(e: unknown): string {
  const msg = String((e as { message?: string })?.message ?? e);
  if (msg.includes("AporteDuplicado")) {
    return "Este conocimiento ya está en el corpus. El contrato detectó que es una reformulación de algo existente.";
  }
  if (msg.includes("HashRepetido")) {
    return "Este texto exacto ya fue registrado antes.";
  }
  if (msg.includes("NovedadInsuficiente")) {
    return "El aporte es nuevo pero aporta muy poca señal frente a lo que ya sabe la IA.";
  }
  if (msg.includes("EpocaAbierta")) {
    return "Esa época todavía no cierra. Solo se puede reclamar de épocas cerradas.";
  }
  if (msg.includes("SinPuntos")) {
    return "No aportaste nada en esa época, así que no hay nada que reclamar.";
  }
  if (msg.includes("YaReclamado")) {
    return "Ya reclamaste tu parte de esa época.";
  }
  if (msg.includes("User rejected") || msg.includes("denied")) {
    return "Cancelaste la transacción.";
  }
  return msg.slice(0, 200);
}
