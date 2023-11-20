import { GasLimits } from "app/types";
import { D9Contract } from "../contracts";
import { ContractRx } from "app/utils/api-contract";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { environment } from "environments/environment";
import { CurrencyTickerEnum, Utils } from "app/utils/utils";
import { ContractCallOutcome } from "app/utils/api-contract/types";
import { firstValueFrom } from "rxjs";

export class AmmManager implements D9Contract {
   contract: ContractRx;
   gasLimits: GasLimits;

   constructor(contract: any, gasLimits: GasLimits) {
      this.contract = contract;
      this.gasLimits = gasLimits;
   }
   /**
    * @description makes a transaction that swaps D9 for USDT
    * @param amount 
    * @returns 
    */
   getLiquidityProvider(address: string): Promise<ContractCallOutcome> {
      console.log("getting liquiidty provider in manager")
      return firstValueFrom(this.contract.query['getLiquidityProvider'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, address));
   }

   getReserves(address: string): Promise<ContractCallOutcome> {
      return firstValueFrom(this.contract.query['getCurrencyReserves'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }));
   }

   makeD9ToUsdtTx(amount: number): SubmittableExtrinsic<'rxjs'> {
      return this.contract.tx['getUsdt']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
         value: Utils.toBigNumberString(amount, CurrencyTickerEnum.D9)
      })
   }

   makeUsdtToD9Tx(amount: number): SubmittableExtrinsic<'rxjs'> {
      const usdtAmount = Utils.toBigNumberString(amount, CurrencyTickerEnum.D9)
      return this.contract.tx['getD9']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, usdtAmount)
   }

   addLiquidity(d9Amount: number, usdtAmount: number): SubmittableExtrinsic<'rxjs'> {
      const usdt = Utils.toBigNumberString(usdtAmount, CurrencyTickerEnum.USDT);
      const d9 = Utils.toBigNumberString(d9Amount, CurrencyTickerEnum.D9);
      return this.contract.tx['getD9']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
         value: d9
      }, usdt)
   }
}
