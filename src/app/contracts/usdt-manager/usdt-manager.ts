import { GasLimits } from "app/types";
import { D9Contract } from "../contracts";
import { ContractRx } from "app/utils/api-contract";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { environment } from "environments/environment";
import { CurrencyTickerEnum, Utils } from "app/utils/utils";
import { ContractCallOutcome } from "app/utils/api-contract/types";
import { firstValueFrom } from "rxjs";

export class UsdtManager implements D9Contract {
   contract: ContractRx;
   gasLimits: GasLimits;

   constructor(contract: any, gasLimits: GasLimits) {
      this.contract = contract;
      this.gasLimits = gasLimits;
   }

   getBalance(address: string): Promise<ContractCallOutcome> {
      return firstValueFrom(this.contract.query['psp22::balanceOf'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, address))
   }

   getAllowance(userAddress: string): Promise<ContractCallOutcome> {
      return firstValueFrom(this.contract.query['psp22::allowance'](userAddress, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, userAddress, environment.contracts.amm.address))
   }
   makeUsdtTransferTx(to: string, amount: number): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['psp22::transfer']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, to, Utils.toBigNumberString(amount, CurrencyTickerEnum.USDT))
   }

   approve(spender: string, amount: number): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['psp22::approve']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, spender, Utils.toBigNumberString(amount, CurrencyTickerEnum.USDT))
   }

}
