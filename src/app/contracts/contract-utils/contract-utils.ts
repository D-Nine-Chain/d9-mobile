
import { environment } from "environments/environment"
import { burnContractABI } from "../burn-manager/burnManagerABI"
import { merchantContractABI } from "../merchant-manager/merchantManagerABI"
import { usdtContractABI } from "../usdt-manager/d9Usdt";
import { ammContractABI } from "../amm-manager/market_maker";

const contracts: Record<string, any> = {
   [environment.contracts.burn_manager.name]: {
      abi: burnContractABI,
      address: environment.contracts.burn_manager.address,
   },
   [environment.contracts.merchant.name]: {
      abi: merchantContractABI,
      address: environment.contracts.merchant.address,
   },
   [environment.contracts.usdt.name]: {
      abi: usdtContractABI,
      address: environment.contracts.usdt.address,
   },
   [environment.contracts.amm.name]: {
      abi: ammContractABI,
      address: environment.contracts.amm.address,
   },
}
const enum Contracts {
   BurnManager,
}
export class ContractUtils {
   constructor() { }

   static async getContractMetadata(contractName: string): Promise<any> {
      return contracts[contractName]
   }
}
