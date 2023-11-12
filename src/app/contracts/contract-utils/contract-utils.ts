// const fs = require('fs/promises');

import { environment } from "environments/environment"
import { burnContractABI } from "../burn-manager/burnManagerABI"

// import path from 'path';
const contracts: Record<string, any> = {
   [environment.contracts.burn_manager.name]: {
      abi: burnContractABI,
      address: environment.contracts.burn_manager.address
   }
}
const enum Contracts {
   BurnManager,
}
export class ContractUtils {
   constructor() { }

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
