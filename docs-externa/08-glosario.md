# Glosario web3 en lenguaje normal

| Término | Qué es realmente |
|---|---|
| **dApp** | Aplicación cuyo backend (o parte de él) es un smart contract en vez de un servidor |
| **Smart contract** | Programa que vive en la blockchain. Es público, inmutable y cualquiera puede llamarlo |
| **EVM** | Ethereum Virtual Machine. La "CPU" donde corren los contratos de Solidity |
| **WASM** | WebAssembly. La VM alternativa que usa Stylus, mucho más eficiente |
| **Gas** | El precio de ejecutar código on-chain. Se paga en ETH. Más cómputo = más gas |
| **Wallet** | Aplicación que guarda tu clave privada y firma transacciones (MetaMask, Rainbow) |
| **Dirección** | `0x...` de 40 hex. Identifica una cuenta o un contrato |
| **ABI** | El "contrato de interfaz" JSON que le dice al frontend qué funciones existe y cómo llamarlas |
| **Transacción (tx)** | Una escritura en la blockchain. Cuesta gas, tarda en confirmar, y queda pública |
| **Call / read** | Una lectura del estado. Es gratis e instantánea |
| **Evento (event)** | Log que emite un contrato. Es la forma barata de "notificar" al frontend y de indexar historial |
| **L1 / L2 / L3** | Ethereum / Arbitrum / una cadena Orbit sobre Arbitrum |
| **Rollup** | L2 que agrupa transacciones y publica un resumen en L1 |
| **Optimistic rollup** | Rollup que asume validez y permite impugnar con pruebas de fraude (Arbitrum) |
| **Fraud proof** | Prueba de que un resumen publicado era falso |
| **Bridge / puente** | Mecanismo para mover activos entre L1 y L2 |
| **Testnet** | Red de pruebas con dinero sin valor. Arbitrum Sepolia |
| **Faucet** | Servicio que te regala tokens de testnet |
| **Arbiscan** | Explorador de bloques de Arbitrum. Ahí se ve tu contrato y sus transacciones |
| **RPC** | El endpoint HTTP al que tu app le habla para leer/escribir en la cadena |
| **Chain ID** | Número que identifica la red (42161 = Arbitrum One, 421614 = Arbitrum Sepolia) |
| **viem / ethers** | Librerías JS para hablar con la blockchain desde el frontend |
| **wagmi** | Hooks de React encima de viem: conectar wallet, leer y escribir contratos |
| **RainbowKit** | Componente de UI para el botón "conectar wallet" |
| **Hardhat / Foundry** | Entornos de desarrollo para compilar, testear y desplegar contratos Solidity |
| **Scaffold-ETH** | Plantilla completa (Next.js + Hardhat/Foundry + wagmi) para arrancar una dApp rápido |
| **Stylus** | Tecnología de Arbitrum para escribir contratos en Rust/C/C++ |
| **ERC-20 / ERC-721 / ERC-1155** | Estándares de token fungible / NFT / híbrido |
| **Mint** | Crear un token nuevo |
| **On-chain / off-chain** | Dentro de la blockchain / fuera de ella (tu servidor, tu base de datos) |
| **Nonce** | Contador de transacciones de una cuenta; evita repeticiones |
| **Firma (signature)** | Prueba criptográfica de que una dirección autorizó un mensaje, sin gastar gas |
| **Indexer** | Servicio que lee eventos y los guarda en una base de datos consultable (aquí: Postgres) |
