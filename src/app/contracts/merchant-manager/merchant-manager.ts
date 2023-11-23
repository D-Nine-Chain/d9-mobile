import { SubmittableExtrinsic } from "@polkadot/api/types";
import { GasLimits } from "app/types";
import { ContractRx } from "app/utils/api-contract";
import { ContractCallOutcome } from "app/utils/api-contract/types";
import { environment } from "environments/environment";
import { firstValueFrom } from "rxjs";
import { BN } from '@polkadot/util';
import { CurrencyTickerEnum, Utils } from "app/utils/utils";
import { D9Contract } from "../contracts";
export class MerchantManager implements D9Contract {
   contract: ContractRx;
   gasLimits: GasLimits;

   constructor(contract: any, gasLimits: GasLimits) {
      this.contract = contract;
      this.gasLimits = gasLimits;
   }


   getMerchantExpiry(address: string): Promise<ContractCallOutcome> {
      console.log(`getting merchant expiry for ${address}`)
      return firstValueFrom(this.contract.query['getExpiry'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,

      }, address));
   }

   getMerchantAccount(address: string): Promise<ContractCallOutcome> {
      console.log(`getting merchant account for ${address}`)
      return firstValueFrom(this.contract.query['getAccount'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, address));
   }

   d9Subscribe(months: number): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['d9Subscribe']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
         value: new BN(months).mul(new BN(10).mul(new BN(10).pow(new BN(12)))).toString()
      })
   }

   giveGreenPoints(address: string, amount: number): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['giveGreenPoints']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
         value: Utils.toBigNumberString(amount, CurrencyTickerEnum.GREEN_POINTS)
      }, address)
   }

   redeemD9(address: string): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['redeemD9']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      })
   }



}
