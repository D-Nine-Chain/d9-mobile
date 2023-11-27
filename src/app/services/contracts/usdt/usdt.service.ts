import { Injectable } from '@angular/core';
import { WalletService } from '../../wallet/wallet.service';
import { D9ApiService } from '../../d9-api/d9-api.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subscription, catchError, distinctUntilChanged, filter, firstValueFrom, from, lastValueFrom, map, switchMap, take, tap } from 'rxjs';
import { UsdtManager } from 'app/contracts/usdt-manager/usdt-manager';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';

@Injectable({
   providedIn: 'root'
})
export class UsdtService {
   private usdtManager: UsdtManager | null = null;
   private allowanceSubject = new BehaviorSubject<number>(0);
   private usdtBalanceSubject = new BehaviorSubject<number>(0);
   private addressSub: Subscription | null = null;
   private usdtManagerSubject = new BehaviorSubject<UsdtManager | null>(null);
   constructor(private d9: D9ApiService, private transaction: TransactionsService, private wallet: WalletService) {
      this.init().catch((err) => {
         console.log(err)
      })
   }

   public async init() {
      this.usdtManager = await this.d9.getContract(environment.contracts.usdt.name)
      this.usdtManagerSubject.next(this.usdtManager);
   }

   getUsdtBalancePromise() {
      return lastValueFrom(this.balanceObservable().pipe(
         catchError(err => {
            console.log('Error in stream', err);
            throw err;
         }),
         tap(balance => console.log("tapped balance promise is ", balance)),
         filter(balance => balance != null),
         take(1),
      ))
   }

   balanceObservable() {
      return this.wallet.activeAddressObservable()
         .pipe(
            distinctUntilChanged(), // only emit when the current value is different than the last
            switchMap((address) => {
               return from(this.updateBalance(address!))
            }),
            map((balance) => { return balance ?? 0 }),
            switchMap((balance) => {
               this.usdtBalanceSubject.next(balance);
               return this.usdtBalanceSubject.asObservable()
            })
         )
   }


   allowancePromise(forWhoAddress: string) {
      return firstValueFrom(this.allowanceObservable(forWhoAddress))
   }

   allowanceObservable(forWhoAddress: string) {
      return this.wallet.activeAddressObservable()
         .pipe(
            distinctUntilChanged(),
            switchMap((address) => {
               return from(this.getCurrentAllowance(address!, forWhoAddress))
            }),
            map((allowance) => { return allowance ?? 0 }),
            switchMap((allowance) => {
               this.allowanceSubject.next(allowance);
               return this.allowanceSubject.asObservable()
            })
         )
   }

   async increaseAllowance(userAddress: string, forWhoAddress: string, amount: number) {
      console.log('increase allowance called')
      const tx = this.usdtManager?.increaseAllowance(environment.contracts.amm.address, amount)
      if (!tx) {
         throw new Error("could not create tx")
      }
      const signedTransaction = await this.wallet.signTransaction(tx);
      const sub = this.transaction.sendSignedTransaction(signedTransaction)
         .subscribe((result) => {
            console.log("result is ", result)
            if (result.status.isFinalized) {
               this.getCurrentAllowance(userAddress, forWhoAddress)
               sub.unsubscribe()
            }
         })
   }

   public async setAllowance(approveWho: string, amount: number) {
      const userAddress = await this.wallet.getAddressPromise();
      console.log(`approve usdt called with ${approveWho} and ${amount}`)
      const tx = this.usdtManager?.approve(approveWho, amount)
      if (!tx) {
         throw new Error("could not create tx")
      }
      const signedTransaction = await this.wallet.signTransaction(tx);
      const sub = this.transaction.sendSignedTransaction(signedTransaction)
         .subscribe((result) => {
            console.log("result is ", result)
            if (result.status.isFinalized) {
               this.getCurrentAllowance(userAddress!, approveWho)
               sub.unsubscribe()
            }
         })
   }

   updateBalance(userAddress: string): Promise<number | null> {
      return firstValueFrom(this.usdtManagerSubject.asObservable()
         .pipe(
            filter((manager) => manager != null),
            switchMap((manager) => {
               return from(manager!.getBalance(userAddress))
            }),
            map((outcome) => {
               return this.transaction.processReadOutcomes(outcome, this.formatUsdtBalance)
            }),
            tap((balance) => {
               console.log("balance is ", balance)
               this.usdtBalanceSubject.next(balance ?? 0);
            })
         ))
   }

   async getCurrentAllowance(userAddress: string, forWho: string) {
      return firstValueFrom(this.usdtManagerSubject.asObservable()
         .pipe(
            filter((manager) => manager != null),
            take(1),
            switchMap((manager) => {
               return from(manager!.getAllowance(userAddress, forWho))
            }),
            map((outcome) => {
               return this.transaction.processReadOutcomes(outcome, this.formatUsdtBalance)
            }),
         ))
   }

   public formatUsdtBalance(balance: string | number) {
      return Utils.reduceByCurrencyDecimal(balance, CurrencyTickerEnum.USDT)
   }

}
