import { Injectable } from '@angular/core';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { TransactionsService } from 'app/services/transactions/transactions.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { environment } from 'environments/environment';
import { GreenPointsAccount, GreenPointsCreated } from 'app/types';
import { MerchantManager } from 'app/contracts/merchant-manager/merchant-manager';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { BehaviorSubject, Observable, catchError, distinctUntilChanged, filter, firstValueFrom, from, map, switchMap, tap, throwError } from 'rxjs';
import { UsdtService } from '../usdt/usdt.service';
import { Router } from '@angular/router';

@Injectable({
   providedIn: 'root'
})
export class MerchantService {

   merchantManager: MerchantManager | null = null;
   merchantExpirySubject = new BehaviorSubject<number | null>(null);
   greenAccountSubject = new BehaviorSubject<GreenPointsAccount | null>(null);
   merchantManagerSubject = new BehaviorSubject<MerchantManager | null>(null);
   constructor(private wallet: WalletService, private transaction: TransactionsService, private d9: D9ApiService, private usdt: UsdtService, private router: Router) {

      this.init().catch((err) => {
         console.log(err)
      })
   }
   async init() {
      this.merchantManager = await this.d9.getContract(environment.contracts.merchant.name)
      this.merchantManagerSubject.next(this.merchantManager)
      const userAddress = await this.wallet.getAddressPromise();
      this.updateGreenPointsAccount(userAddress!).catch((err) => { })
   }

   public merchantExpiryObservable(): Observable<number | null> {
      return this.merchantManagerObservable()
         .pipe(
            filter((manager) => manager != null),
            switchMap((manager) => {
               return this.wallet.activeAddressObservable()
                  .pipe(
                     distinctUntilChanged(),
                     switchMap((address) => {
                        return from(manager!.getMerchantExpiry(address!))
                     }),
                     map((callOutcome) => this.transaction.processReadOutcomes(callOutcome, this.formatExpiry)),
                     switchMap((expiry) => {
                        this.merchantExpirySubject.next(expiry);
                        return this.merchantExpirySubject.asObservable();
                     })
                  )
            })
         )
   }

   public greenAccountObservable(): Observable<GreenPointsAccount | null> {
      return this.wallet.activeAddressObservable()
         .pipe(
            distinctUntilChanged(),
            tap({
               next: async (address) => {
                  await this.updateGreenPointsAccount(address!)
               }
            }),
            switchMap(() => {
               return this.greenAccountSubject.asObservable()
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

   public calcRelationshipFactor(account: GreenPointsAccount): number {
      const transmutationRate = 1 / 2000;
      console.log("merchant account in relationship factor", account)
      const sonsFactor = account.relationshipFactors[0] * account.greenPoints * transmutationRate * 0.10;
      const grandsonFactor = account.relationshipFactors[1] * account.greenPoints * transmutationRate * 0.01;

      return sonsFactor + grandsonFactor;
   }

   public async payMerchant(merchantId: string, amount: number, currency: CurrencyTickerEnum): Promise<void> {
      const methodName = currency == CurrencyTickerEnum.USDT ? "payMerchantUSDT" : "payMerchantD9"
      if (!this.merchantManager) {
         throwError(() => new Error("Merchant Manager is not defined"));
      }

      let sub = from(this.wallet.getAddressPromise()).pipe(
         switchMap(userAddress => {
            const tx = this.merchantManager![methodName](merchantId, amount);
            if (!tx) {
               return throwError(() => new Error("could not create tx"));
            }

            return from(this.wallet.signTransaction(tx)).pipe(
               switchMap(signedTx => {
                  return this.transaction.sendSignedTransaction(signedTx).pipe(
                     tap({
                        next: async (result) => {
                           if (result.status.isFinalized) {
                              await this.updateGreenPointsAccount(userAddress!)
                              sub.unsubscribe()
                           }
                        },
                        error: err => {
                           // Handle any errors here
                        },
                        complete: () => {
                           // Handle completion here
                           if (currency == CurrencyTickerEnum.USDT) {
                              this.usdt.updateBalance(userAddress!)
                           }

                        }
                     })
                  );
               })
            );
         }),
         catchError(err => {
            // Handle errors that occur during the observable stream
            console.error(err);
            return throwError(() => err);
         })
      ).subscribe();
   }

   public async withdrawD9() {
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
            if (result.status.isFinalized) {
               this.updateGreenPointsAccount(address!)
               sub.unsubscribe()
            }
         })
   }

   public async subscribe(months: number) {
      console.log(`subscribing for ${months} months`)
      const tx = this.merchantManager?.subscribe(months)
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

   public giveGreenPoints(toAddress: string, amount: number, currency: CurrencyTickerEnum) {
      // First, we need to handle the potential nullability of this.merchantManager
      const methodName = currency == CurrencyTickerEnum.USDT ? "giveGreenPointsUSDT" : "giveGreenPointsD9"
      if (!this.merchantManager) {
         throwError(() => new Error("Merchant Manager is not defined"));
      }

      let sub = from(this.wallet.getAddressPromise()).pipe(
         switchMap(userAddress => {
            const tx = this.merchantManager![methodName](toAddress, amount);
            if (!tx) {
               return throwError(() => new Error("could not create tx"));
            }

            return from(this.wallet.signTransaction(tx)).pipe(
               switchMap(signedTx => {
                  return this.transaction.sendSignedTransaction(signedTx).pipe(
                     tap({
                        next: async (result) => {
                           if (result.status.isFinalized && !result.dispatchError) {
                              await this.updateGreenPointsAccount(userAddress!)
                              this.router.navigate(['green-account'])
                              sub.unsubscribe()
                           }
                           else if (result.dispatchError) {
                              this.router.navigate(['error'])
                              sub.unsubscribe()
                           }

                        },
                        error: err => {
                           // Handle any errors here
                        },
                        complete: () => {
                           // Handle completion here
                        }
                     })
                  );
               })
            );
         }),
         catchError(err => {
            // Handle errors that occur during the observable stream
            console.error(err);
            return throwError(() => err);
         })
      ).subscribe();

   }

   /**
    * Calculates the amount of green points given a specified USDT amount.
    *
    * @param {number} usdtAmount - The amount of USDT.
    * @return {Object} An object containing the calculated green points for the consumer and merchant.
    */
   public calculateGiveGreenPoints(usdtAmount: number): { consumer: string, merchant: string } {
      const consumerGreenPoints = (usdtAmount / 0.16) * 100;
      const merchantGreenPoints = consumerGreenPoints * 0.16;
      return {
         consumer: consumerGreenPoints.toFixed(2),
         merchant: merchantGreenPoints.toFixed(2)
      };
   }
   private merchantManagerObservable() {
      return this.merchantManagerSubject.asObservable()
   }

   public updateGreenPointsAccount(userAddress: string) {
      return firstValueFrom(this.merchantManagerObservable()
         .pipe(
            filter((manager) => manager != null),
            distinctUntilChanged(),
            switchMap((manager) => {
               return from(manager!.getGreenPointsAccount(userAddress))
            }),
            map((outcome) => {
               return this.transaction.processReadOutcomes(outcome, this.formatGreenPointsAccount)
            }),
            tap((greenAccount) => {
               this.greenAccountSubject.next(greenAccount)
            })
         ))
   }

   private formatExpiry(expiry: number): number {
      return expiry as number
   }

   private formatGreenPointsAccount(greenPointsAccount: any): GreenPointsAccount {
      const formattedGreenPoints: GreenPointsAccount = {
         greenPoints: Utils.reduceByCurrencyDecimal(greenPointsAccount.greenPoints, CurrencyTickerEnum.GREEN_POINTS),
         relationshipFactors: greenPointsAccount.relationshipFactors,
         lastConversion: greenPointsAccount.lastConversion,
         redeemedUsdt: Utils.reduceByCurrencyDecimal(greenPointsAccount.redeemedUsdt, CurrencyTickerEnum.USDT),
         redeemedD9: Utils.reduceByCurrencyDecimal(greenPointsAccount.redeemedD9, CurrencyTickerEnum.D9),
         createdAt: greenPointsAccount.createdAt,
      }
      console.log("formatted green points is ", formattedGreenPoints)
      return formattedGreenPoints;
   }

}