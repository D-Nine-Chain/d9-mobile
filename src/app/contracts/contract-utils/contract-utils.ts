const fs = require('fs/promises');
import path from 'path';
export class ContractUtils {

   static async getABIJSON(contractInfo: { address: string, file_name: string }): Promise<any> {
      try {
         const filePath = path.join(__dirname, '../../../../resources/contractABIs', `${contractInfo.file_name}.json`);

         const data = await fs.readFile(filePath);

         return JSON.parse(data).abi;
      } catch (error) {
         // Handle errors (e.g. file not found, JSON parsing errors)
         console.error("Error reading ABI file:", error);
         throw error; // Re-throw the error to be handled by the caller
      }
   }
}
