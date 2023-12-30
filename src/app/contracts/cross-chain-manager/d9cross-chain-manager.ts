import { ContractRx } from "app/utils/api-contract";
import { D9Contract } from "../contracts";
import { GasLimits } from "app/types";
import { firstValueFrom } from "rxjs";
import { environment } from "environments/environment";
import { ContractCallOutcome } from "app/utils/api-contract/types";
import { SubmittableExtrinsic } from "@polkadot/api/types";

export class D9CrossChainManager implements D9Contract {
   contract: ContractRx;
   gasLimits: GasLimits;

   constructor(contract: any, gasLimits: GasLimits) {
      this.contract = contract;
      this.gasLimits = gasLimits;
   }

   getTransactionId(address: string): Promise<ContractCallOutcome> {
      return firstValueFrom(this.contract.query['generateTxId'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, address))
   }

   getLastTransaction(address: string): Promise<ContractCallOutcome> {
      return firstValueFrom(this.contract.query['getLastTransaction'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, address))
   }

   getTransaction(address: string, transactionId: string): Promise<ContractCallOutcome> {
      return firstValueFrom(this.contract.query['getTransaction'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, transactionId))
   }

}