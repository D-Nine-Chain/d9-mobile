import { Injectable } from '@angular/core';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { TransactionsService } from 'app/services/transactions/transactions.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { environment } from 'environments/environment';
import { MerchantAccount } from 'app/types';
import { MerchantManager } from 'app/contracts/merchant-manager/merchant-manager';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { BehaviorSubject } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class MerchantMiningService {

   merchantManager: MerchantManager | null = null;
   merchantExpirySubject = new BehaviorSubject<number | null>(null);
   merchantAccountSubject = new BehaviorSubject<MerchantAccount | null>(null);

   constructor(private wallet: WalletService, private transaction: TransactionsService, private d9: D9ApiService) {

      this.init().catch((err) => {
         console.log(err)
      })
   }
   async init() {
      this.merchantManager = await this.d9.getContract(environment.contracts.merchant.name)
      this.updateExpiry().catch((err) => { })
   }

   public merchantExpiryObservable() {
      return this.merchantExpirySubject.asObservable()
   }

   public merchantAccountObservable() {
      return this.merchantAccountSubject.asObservable()
   }

   public async withdrawD9(amount: number) {
      const address = await this.wallet.getAddressPromise();
      if (!address) {
         throw new Error("no address")
      }
      const extrinsic = this.merchantManager?.redeemD9(address)
      if (!extrinsic) {
         throw new Error("could not create tx")
      }
      const signedTx = await this.wallet.signTransaction(extrinsic)
      const sub = this.transaction.sendSignedTransaction(signedTx)
         .subscribe((result) => {
            console.log("result is ", result)
            if (result.status.isFinalized) {
               sub.unsubscribe()
            }
         })
   }

   public async subscribe(months: number) {
      const tx = this.merchantManager?.d9Subscribe(months)
      if (!tx) throw new Error("could not create tx");
      const signedTx = await this.wallet.signTransaction(tx)
      const sub = this.transaction.sendSignedTransaction(signedTx)
         .subscribe(async (result) => {
            if (result.status.isFinalized) {
               sub.unsubscribe()

               await this.updateExpiry();
            }
         })

   }

   public async updateExpiry() {
      const userAddress = await this.wallet.getAddressPromise();
      if (!userAddress) throw new Error("no address")
      const outcome = await this.merchantManager?.getMerchantExpiry(userAddress)
      if (!outcome) throw new Error("could not get expiry")
      const expiry = this.transaction.processReadOutcomes(outcome, this.formatExpiry)
      if (expiry) this.merchantExpirySubject.next(expiry)

   }

   public async sendGreenPoints(toAddress: string, amount: number) {
      const tx = this.merchantManager?.giveGreenPoints(toAddress, amount)
      if (!tx) throw new Error("could not create tx");
      const signedTx = await this.wallet.signTransaction(tx)
      const sub = this.transaction.sendSignedTransaction(signedTx)
         .subscribe(async (result) => {
            if (result.status.isFinalized) {
               sub.unsubscribe()
               await this.updateMerchantAccount()
            }
         })
   }

   public async updateMerchantAccount() {
      const userAddress = await this.wallet.getAddressPromise();
      if (!userAddress) throw new Error("no address")
      const outcome = await this.merchantManager?.getMerchantAccount(userAddress)
      if (!outcome) throw new Error("could not get merchant account")
      const merchantAccount = this.transaction.processReadOutcomes(outcome, this.formatMerchantAccount)
      if (merchantAccount) this.merchantAccountSubject.next(merchantAccount)
   }



   private formatExpiry(expiry: number): number {
      return expiry as number
   }

   private formatMerchantAccount(merchantAccount: any): MerchantAccount {
      const formattedMerchantAccount: MerchantAccount = {
         greenPoints: Utils.reduceByCurrencyDecimal(merchantAccount.greenPoints, CurrencyTickerEnum.D9),
         lastConversion: merchantAccount.lastConversion,
         redeemedUsdt: Utils.reduceByCurrencyDecimal(merchantAccount.redeemedUsdt, CurrencyTickerEnum.USDT),
         redeemedD9: Utils.reduceByCurrencyDecimal(merchantAccount.redeemedD9, CurrencyTickerEnum.D9),
         createdAt: merchantAccount,
         expiry: merchantAccount.expiry,
      }
      return formattedMerchantAccount;
   }

}