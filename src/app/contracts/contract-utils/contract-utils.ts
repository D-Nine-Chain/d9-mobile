// const fs = require('fs/promises');

import { environment } from "environments/environment"
import { burnContractABI } from "../burn-manager/burnManagerContract"

// import path from 'path';
const contracts: Record<string, any> = {
   "burnManager": {
      abi: burnContractABI,
      address: environment.contracts.burn_manager.address
   }
}
export class ContractUtils {

   static async getContractMetadata(contractName: string): Promise<any> {
      return contracts[contractName]
      // try {
      //    const filePath = path.join(__dirname, '../../../../resources/contractABIs', `${contractInfo.file_name}.json`);

      //    const data = await fs.readFile(filePath);

      //    return JSON.parse(data).abi;
      // } catch (error) {
      //    // Handle errors (e.g. file not found, JSON parsing errors)
      //    console.error("Error reading ABI file:", error);
      //    throw error; // Re-throw the error to be handled by the caller
      // }
   }
}
