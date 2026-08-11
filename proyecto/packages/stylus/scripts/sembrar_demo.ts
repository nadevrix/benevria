/**
 * Siembra el corpus con conocimiento real para que el demo tenga sustancia.
 *
 * Sin esto, el panel se ve muerto: corpus en 0, barra al 0 %, nivel Base. Un jurado
 * abriría el link y vería un formulario en blanco en vez de un organismo vivo.
 *
 * Los aportes son **conocimiento boliviano real y verificable** —trámites, cálculos
 * laborales, jerga de oficio— justo el tipo de dato que los modelos grandes alucinan
 * y que nadie escribió en internet. Es la tesis del proyecto, demostrada con datos.
 *
 * Uso:
 *   yarn sembrar                 # siembra temas y aportes
 *   yarn sembrar --solo-temas    # solo el panel de demanda
 *
 * Requiere: contrato desplegado y `NEXT_PUBLIC_BENEVRIA_ADDRESS` o `--address 0x...`.
 */

import { config as dotenvConfig } from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { createWalletClient, createPublicClient, http, keccak256, toHex, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

dotenvConfig({ path: path.resolve(__dirname, "../.env") });

const RPC = process.env["RPC_URL"] ?? "https://sepolia-rollup.arbitrum.io/rpc";
const DIMS = 64;
const ESCALA = 127;

// ---------------------------------------------------------------------------
// Contenido de la siembra
// ---------------------------------------------------------------------------

/** Temas que la comunidad reclama. Se publican primero para que los aportes los llenen. */
const TEMAS = [
  "Cómo se calcula el finiquito laboral en Bolivia",
  "Trámites para abrir una empresa unipersonal en Santa Cruz",
  "Qué documentos pide la Aduana para importación de bajo valor",
  "Jerga de obra y construcción en el oriente boliviano",
];

/**
 * Aportes de conocimiento. `tema` es 1-indexado y 0 significa "sin tema".
 *
 * Cada uno es sustancialmente distinto de los demás: si dos fueran parecidos, el
 * contrato rechazaría el segundo — que es justo lo que queremos demostrar, pero en
 * el demo en vivo, no en la siembra.
 */
const APORTES: Array<{ tema: number; texto: string }> = [
  {
    tema: 1,
    texto:
      "El finiquito laboral en Bolivia se compone de tres partes distintas que se calculan por separado. " +
      "El desahucio equivale a tres sueldos promedio y solo corresponde cuando el despido es intempestivo, " +
      "no cuando el trabajador renuncia. La indemnización por tiempo de servicio es un sueldo promedio por " +
      "cada año trabajado, y se paga proporcionalmente si el tiempo supera los tres meses. El aguinaldo " +
      "proporcional se calcula sobre los meses efectivamente trabajados dentro del año en curso. El sueldo " +
      "promedio se saca de los últimos tres meses e incluye bonos de antigüedad y horas extra habituales.",
  },
  {
    tema: 2,
    texto:
      "Para registrar una empresa unipersonal en Santa Cruz de la Sierra, el primer paso en FUNDEMPRESA es " +
      "el control de homonimia, que verifica que el nombre comercial no esté ya tomado. Ese trámite tiene un " +
      "costo aproximado de 136 bolivianos y suele resolverse en 24 horas hábiles. Recién con la homonimia " +
      "aprobada se presenta el formulario de solicitud junto con la fotocopia de la cédula de identidad del " +
      "titular y el croquis de ubicación del domicilio comercial. El certificado de registro se emite a los " +
      "pocos días y es el documento que después piden en Impuestos Nacionales para el NIT.",
  },
  {
    tema: 3,
    texto:
      "Las importaciones de bajo valor por courier en Bolivia siguen un régimen simplificado distinto al de " +
      "las importaciones formales. La Aduana Nacional exige la factura comercial del proveedor, el documento " +
      "de transporte emitido por el courier y la declaración jurada del contenido. Cuando el valor declarado " +
      "supera el umbral del régimen simplificado, el envío pasa a despacho general y ahí sí se necesita un " +
      "agente despachante de aduana acreditado. El error más común es declarar un valor menor al real: si la " +
      "Aduana lo detecta, el envío queda en abandono y la multa supera el valor de la mercadería.",
  },
  {
    tema: 4,
    texto:
      "En la construcción del oriente boliviano hay vocabulario que no aparece en ningún manual técnico. " +
      "La 'camisa' es el encofrado que rodea una columna antes del vaciado. 'Vaciar' es colar el hormigón, " +
      "y 'chorrear' se usa cuando se hace sin bomba, directo del mezclador. El 'contrapiso' es la capa de " +
      "nivelación bajo el piso final, distinta de la 'carpeta'. Cuando el maestro dice que algo está " +
      "'a plomo' se refiere a la verticalidad, y 'a nivel' a la horizontalidad. Pedir 'una bolsa de fino' " +
      "significa cemento para revoque, no para estructura.",
  },
  {
    tema: 0,
    texto:
      "El sistema de facturación en Bolivia migró a modalidad electrónica en línea, y eso cambió cómo se " +
      "corrige un error. Una factura electrónica ya emitida no se puede modificar: hay que anularla dentro " +
      "del plazo establecido y emitir una nueva. Pasado ese plazo, la anulación deja de estar disponible y " +
      "la única salida es una nota de crédito-débito. Los contribuyentes que emiten pocas facturas suelen " +
      "usar la modalidad portal web, mientras que quienes facturan volumen necesitan integrar su sistema " +
      "por API con el servicio de impuestos.",
  },
  {
    tema: 0,
    texto:
      "En el altiplano boliviano la construcción con adobe sigue viva y tiene reglas que el hormigón no " +
      "comparte. El adobe se fabrica con tierra arcillosa mezclada con paja picada, que trabaja como " +
      "refuerzo y evita que la pieza se fisure al secar. El secado debe ser a la sombra y demora entre dos " +
      "y tres semanas: si se seca al sol directo, la superficie endurece antes que el núcleo y la pieza " +
      "queda hueca. Los muros necesitan sobrecimiento de piedra para aislarlos de la humedad del suelo, " +
      "porque el adobe en contacto con agua se disgrega.",
  },
];

// ---------------------------------------------------------------------------
// Embedding local — replica exacta de packages/nextjs/lib/embedding.ts
// ---------------------------------------------------------------------------

function normalizar(v: number[]): number[] {
  const norma = Math.sqrt(v.reduce((a, x) => a + x * x, 0));
  return norma === 0 ? v.map(() => 0) : v.map(x => x / norma);
}

function embeddingLocal(texto: string): number[] {
  const v = new Array(DIMS).fill(0);
  const limpio = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const piezas: string[] = [];
  const palabras = limpio.split(" ").filter(Boolean);
  piezas.push(...palabras);
  for (let i = 0; i + 1 < palabras.length; i++) piezas.push(palabras[i] + "_" + palabras[i + 1]);
  const sinEspacios = limpio.replace(/ /g, "_");
  for (let i = 0; i + 3 <= sinEspacios.length; i++) piezas.push(sinEspacios.slice(i, i + 3));

  for (const pieza of piezas) {
    let h = 0x811c9dc5;
    for (let i = 0; i < pieza.length; i++) {
      h ^= pieza.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    v[h % DIMS] += (h >>> 31) & 1 ? -1 : 1;
  }
  return normalizar(v);
}

function empaquetar(vector: number[]): { lo: Hex; hi: Hex } {
  const q = new Uint8Array(DIMS);
  for (let i = 0; i < DIMS; i++) {
    let x = Math.round((vector[i] ?? 0) * ESCALA);
    if (x > 127) x = 127;
    if (x < -127) x = -127;
    q[i] = x < 0 ? x + 256 : x;
  }
  const hex = (b: Uint8Array) => ("0x" + Array.from(b, x => x.toString(16).padStart(2, "0")).join("")) as Hex;
  return { lo: hex(q.slice(0, 32)), hi: hex(q.slice(32, 64)) };
}

// ---------------------------------------------------------------------------

const ABI = [
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
  { type: "function", name: "depositarIngreso", stateMutability: "payable", inputs: [], outputs: [] },
  { type: "function", name: "tamanoCorpus", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "puntajeColectivo", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "nivel", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
] as const;

function direccionContrato(): Hex {
  const desdeArg = process.argv.find(a => a.startsWith("--address="))?.split("=")[1];
  if (desdeArg) return desdeArg as Hex;

  const envNext = path.resolve(__dirname, "../../nextjs/.env.local");
  if (fs.existsSync(envNext)) {
    const m = fs.readFileSync(envNext, "utf8").match(/NEXT_PUBLIC_BENEVRIA_ADDRESS=(0x[a-fA-F0-9]{40})/);
    if (m) return m[1] as Hex;
  }
  throw new Error(
    "No encuentro la dirección del contrato. Pasa --address=0x... o define NEXT_PUBLIC_BENEVRIA_ADDRESS en packages/nextjs/.env.local",
  );
}

async function main() {
  const pk = (process.env["PRIVATE_KEY_SEPOLIA"] ?? process.env["PRIVATE_KEY"]) as Hex | undefined;
  if (!pk) throw new Error("Falta PRIVATE_KEY_SEPOLIA en packages/stylus/.env");

  const address = direccionContrato();
  const cuenta = privateKeyToAccount(pk);
  const wallet = createWalletClient({ account: cuenta, chain: arbitrumSepolia, transport: http(RPC) });
  const publico = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) });

  console.log(`📡 Contrato: ${address}`);
  console.log(`🔑 Sembrando desde: ${cuenta.address}\n`);

  const soloTemas = process.argv.includes("--solo-temas");

  // --- Temas ---
  for (const titulo of TEMAS) {
    try {
      const hash = await wallet.writeContract({
        account: cuenta,
        chain: arbitrumSepolia,
        address,
        abi: ABI,
        functionName: "pedirTema",
        args: [titulo],
      });
      await publico.waitForTransactionReceipt({ hash });
      console.log(`  ✅ tema: ${titulo}`);
    } catch (e) {
      console.log(`  ⚠️  tema falló (${titulo}): ${String(e).slice(0, 120)}`);
    }
  }

  if (soloTemas) return;

  // --- Aportes ---
  console.log("");
  for (const [i, aporte] of APORTES.entries()) {
    const { lo, hi } = empaquetar(embeddingLocal(aporte.texto));
    const hashContenido = keccak256(toHex(aporte.texto));
    try {
      const hash = await wallet.writeContract({
        account: cuenta,
        chain: arbitrumSepolia,
        address,
        abi: ABI,
        functionName: "aportar",
        args: [lo, hi, hashContenido, aporte.tema],
      });
      await publico.waitForTransactionReceipt({ hash });
      console.log(`  ✅ aporte ${i + 1}/${APORTES.length} (tema ${aporte.tema || "—"})`);
    } catch (e) {
      // Si el contrato lo rechaza por duplicado, es señal de que la verificación
      // funciona: se reporta y se sigue.
      const msg = String(e);
      const motivo = msg.includes("AporteDuplicado")
        ? "rechazado por duplicado (la verificación on-chain funciona)"
        : msg.slice(0, 120);
      console.log(`  ⚠️  aporte ${i + 1} no entró: ${motivo}`);
    }
  }

  // --- Estado final ---
  const [corpus, puntaje, nivel] = await Promise.all([
    publico.readContract({ address, abi: ABI, functionName: "tamanoCorpus" }),
    publico.readContract({ address, abi: ABI, functionName: "puntajeColectivo" }),
    publico.readContract({ address, abi: ABI, functionName: "nivel" }),
  ]);

  console.log(`\n📊 Estado tras la siembra`);
  console.log(`   corpus:   ${corpus}`);
  console.log(`   puntaje:  ${puntaje}`);
  console.log(`   nivel:    ${nivel}`);
  console.log(`\n💡 Para que el nivel suba también hace falta tesorería:`);
  console.log(`   deposita con depositarIngreso() desde el panel o con otra wallet.`);
}

main().catch(e => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
