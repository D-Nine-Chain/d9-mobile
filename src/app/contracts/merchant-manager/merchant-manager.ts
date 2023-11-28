import { SubmittableExtrinsic } from "@polkadot/api/types";
import { GasLimits } from "app/types";
import { ContractRx } from "app/utils/api-contract";
import { ContractCallOutcome } from "app/utils/api-contract/types";
import { environment } from "environments/environment";
import { distinctUntilChanged, firstValueFrom, from, map, switchMap } from "rxjs";
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

   getGreenPointsAccount(address: string): Promise<ContractCallOutcome> {
      console.log(`getting merchant account for ${address}`)
      return firstValueFrom(this.contract.query['getAccount'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, address));
   }

   subscribe(months: number): SubmittableExtrinsic<'rxjs'> {
      const usdtAmount = months * 10;
      return this.contract.tx['subscribe']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, Utils.toBigNumberString(usdtAmount, CurrencyTickerEnum.USDT))
   }

   payMerchantD9(address: string, amount: number): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['payMerchantD9']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
         value: Utils.toBigNumberString(amount, CurrencyTickerEnum.D9)
      }, address)
   }

   payMerchantUSDT(address: string, amount: number): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['payMerchantUsdt']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, address, Utils.toBigNumberString(amount, CurrencyTickerEnum.USDT))
   }

   /**
    * Generates a transaction to give green points in USDT to a specified address.
    *
    * @param {string} address - The address to receive the green points.
    * @param {number} usdtAmount - The amount of USDT to give as green points.
    * @return {SubmittableExtrinsic<'rxjs'>} - The transaction to give green points.
    */
   giveGreenPointsUSDT(address: string, usdtAmount: number): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['giveGreenPointsUsdt']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, address, Utils.toBigNumberString(usdtAmount, CurrencyTickerEnum.USDT))
   }

   giveGreenPointsD9(address: string, amount: number): SubmittableExtrinsic<'rxjs'> {
      console.log(`doing green points through d9`)
      return this.contract.tx['giveGreenPointsD9']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
         value: Utils.toBigNumberString(amount, CurrencyTickerEnum.D9)
      }, address)
   }

   redeemD9(address: string): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['redeemD9']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      })
   }



}
