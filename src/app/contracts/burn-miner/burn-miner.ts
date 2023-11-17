import { environment } from "environments/environment";
import { firstValueFrom } from "rxjs";
import { ContractRx } from "@polkadot/api-contract";
import { ContractCallOutcome } from "app/utils/api-contract/types";
import { GasLimits } from "app/types";
export class BurnMiner {
   contract: ContractRx;
   gasLimits: GasLimits;
   constructor(contract: any, gasLimits: GasLimits) {
      this.contract = contract;
      this.gasLimits = gasLimits;
   }

   Errors = {
      GettingTotalNetworkBurned: "BurnManager::ErrorGettingTotalNetworkBurned",
      GettingBurnPortfolio: "BurnManager::ErrorGettingBurnPortfolio",

   }

   getAccount(address: string): Promise<ContractCallOutcome> {
      console.log("getAccount called")
      return firstValueFrom(this.contract.query['getAccount'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit
      }, address))
   }

}
