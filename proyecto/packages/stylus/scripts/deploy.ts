import deployStylusContract from "./deploy_contract";
import {
  getDeploymentConfig,
  getRpcUrlFromChain,
  printDeployedAddresses,
} from "./utils/";
import { DeployOptions } from "./utils/type";
import { config as dotenvConfig } from "dotenv";
import * as path from "path";
import * as fs from "fs";

const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  dotenvConfig({ path: envPath });
}

/**
 * Define your deployment logic here
 */
export default async function deployScript(deployOptions: DeployOptions) {
  const config = getDeploymentConfig(deployOptions);

  console.log(`📡 Using endpoint: ${getRpcUrlFromChain(config.chain)}`);
  if (config.chain) {
    console.log(`🌐 Network: ${config.chain?.name}`);
    console.log(`🔗 Chain ID: ${config.chain?.id}`);
  }
  console.log(`🔑 Using private key: ${config.privateKey.substring(0, 10)}...`);
  console.log(`📁 Deployment directory: ${config.deploymentDir}`);
  console.log(`\n`);

  // BenevriaCore: el nucleo del protocolo.
  //
  // constructor(owner, keeper):
  //   owner  -> puede rotar el keeper si se compromete su clave. Nada mas.
  //   keeper -> ejecutor sin privilegios: solo puede gastar el presupuesto de
  //             inferencia ya autorizado por el contrato, nunca el pozo de los
  //             aportantes. Aqui apunta al deployer; en produccion es una wallet
  //             aparte y acotada.
  await deployStylusContract({
    contract: "benevria-core",
    constructorArgs: [config.deployerAddress!, config.deployerAddress!],
    ...deployOptions,
  });

  // Print the deployed addresses
  console.log("\n\n");
  printDeployedAddresses(config.deploymentDir, config.chain.id.toString());
}
