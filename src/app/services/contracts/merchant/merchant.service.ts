import { Injectable } from '@angular/core';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { TransactionsService } from 'app/services/transactions/transactions.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { environment } from 'environments/environment';
import { GreenPointsAccount } from 'app/types';
import { MerchantManager } from 'app/contracts/merchant-manager/merchant-manager';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { BehaviorSubject, filter, from, map, switchMap, tap } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class MerchantService {

   merchantManager: MerchantManager | null = null;
   merchantExpirySubject = new BehaviorSubject<number | null>(null);
   merchantAccountSubject = new BehaviorSubject<GreenPointsAccount | null>(null);
   merchantManagerSubject = new BehaviorSubject<MerchantManager | null>(null);
   constructor(private wallet: WalletService, private transaction: TransactionsService, private d9: D9ApiService) {

      this.init().catch((err) => {
         console.log(err)
      })
   }
   async init() {
      this.merchantManager = await this.d9.getContract(environment.contracts.merchant.name)
      this.merchantManagerSubject.next(this.merchantManager)
      this.updateGreenPointsAccount().catch((err) => { })
   }

   public merchantExpiryObservable() {
      return this.merchantManagerObservable()
         .pipe(
            filter((manager) => manager != null),
            switchMap((manager) => {
               return this.wallet.getActiveAddressObservable()
                  .pipe(
                     filter((address) => address != null),
                     switchMap((address) => {
                        console.log(`address for merchant account is ${address}`)
                        return from(manager!.getMerchantExpiry(address!))
                     }),
                     map((callOutcome) => this.transaction.processReadOutcomes(callOutcome, this.formatExpiry)),
                     tap((expiry) => { console.log(`expiry ${expiry}`) }),
                  )
            })
         )
   }

   public greenPointsAccountObservable() {
      return this.merchantManagerObservable()
         .pipe(
            filter((manager) => manager != null),
            switchMap((manager) => {
               return this.wallet.getActiveAddressObservable()
                  .pipe(
                     filter((address) => address != null),
                     switchMap((address) => {
                        console.log(`address for merchant account is ${address}`)
                        return from(manager!.getMerchantAccount(address!))
                     }),
                     map((callOutcome) => this.transaction.processReadOutcomes(callOutcome, this.formatGreenPointsAccount)),
                     switchMap((greenAccount) => {
                        console.log(`green account is ${greenAccount} in switch map`)
                        this.merchantAccountSubject.next(greenAccount)
                        return this.merchantAccountSubject.asObservable()
                     }),
                     tap((greenAccount) => { console.log(`expiry ${greenAccount}`) }),
                  )
            })
         )
   }

   public calcTimeFactor(account: GreenPointsAccount): number {
      const transmutationRate = 1 / 2000;
      console.log("merchant account in time factor", account)
      const day = environment.constants.milliseconds_per_day;
      console.log("day is ", day)
      const lastInteraction = account.lastConversion ?? account.createdAt;
      console.log("last interaction", lastInteraction)
      const now = Date.now();
      const daysSinceLastInteraction = (now - lastInteraction) / day;
      console.log("days since last interaction", daysSinceLastInteraction)
      const timeFactor = account.greenPoints * transmutationRate * daysSinceLastInteraction;
      console.log("time factor ", timeFactor)

      return timeFactor;
   }

   public calcRelationshipFactor(account: GreenPointsAccount) {
      const transmutationRate = 1 / 2000;
      console.log("merchant account in relationship factor", account)
      const sonsFactor = account.relationshipFactors[0] * account.greenPoints * transmutationRate * 0.10;
      const grandsonFactor = account.relationshipFactors[1] * account.greenPoints * transmutationRate * 0.01;

      return sonsFactor + grandsonFactor;
   }

   public async payMerchantD9(merchantId: string, amount: number) {
      const tx = this.merchantManager?.payMerchantD9(merchantId, amount)
      if (!tx) throw new Error("could not create tx");
      const signedTx = await this.wallet.signTransaction(tx)
      const sub = this.transaction.sendSignedTransaction(signedTx)
         .subscribe(async (result) => {
            if (result.status.isFinalized) {
               sub.unsubscribe()
            }
         })
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
      console.log(`address for merchant account is ${userAddress}`)
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
               await this.updateGreenPointsAccount()
            }
         })
   }

   private merchantManagerObservable() {
      return this.merchantManagerSubject.asObservable()
   }

   public async updateGreenPointsAccount() {
      const userAddress = await this.wallet.getAddressPromise();
      if (!userAddress) throw new Error("no address")
      const outcome = await this.merchantManager?.getMerchantAccount(userAddress)
      if (!outcome) throw new Error("could not get merchant account")
      const merchantAccount = this.transaction.processReadOutcomes(outcome, this.formatGreenPointsAccount)
      if (merchantAccount) this.merchantAccountSubject.next(merchantAccount)
   }



   private formatExpiry(expiry: number): number {
      return expiry as number
   }

   private formatGreenPointsAccount(greenPointsAccount: any): GreenPointsAccount {
      console.log("merchant account is ", greenPointsAccount)
      const formattedGreenPoints: GreenPointsAccount = {
         greenPoints: Utils.reduceByCurrencyDecimal(greenPointsAccount.greenPoints, CurrencyTickerEnum.GREEN_POINTS),
         relationshipFactors: greenPointsAccount.relationshipFactors,
         lastConversion: greenPointsAccount.lastConversion,
         redeemedUsdt: Utils.reduceByCurrencyDecimal(greenPointsAccount.redeemedUsdt, CurrencyTickerEnum.USDT),
         redeemedD9: Utils.reduceByCurrencyDecimal(greenPointsAccount.redeemedD9, CurrencyTickerEnum.D9),
         createdAt: greenPointsAccount.createdAt,
         expiry: greenPointsAccount.expiry,
      }
      console.log("formatted green points is ", formattedGreenPoints)
      return formattedGreenPoints;
   }

}