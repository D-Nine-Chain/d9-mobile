import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { D9ApiService } from '../d9-api/d9-api.service';
import { TransactionsService } from '../transactions/transactions.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subscription, catchError, filter, firstValueFrom, lastValueFrom, take, tap } from 'rxjs';
import { UsdtManager } from 'app/contracts/usdt-manager/usdt-manager';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';

@Injectable({
   providedIn: 'root'
})
export class UsdtService {
   private usdtManager: UsdtManager | null = null;
   private usdtAllowanceSubject = new BehaviorSubject<number>(0);
   private usdtBalanceSubject = new BehaviorSubject<number>(0);
   private addressSub: Subscription | null = null;
   constructor(private d9: D9ApiService, private transaction: TransactionsService, private wallet: WalletService) {
      this.init().catch((err) => {
         console.log(err)
      })
   }

   public async init() {
      this.usdtManager = await this.d9.getContract(environment.contracts.usdt.name)
      await this.updateBalance()
      await this.updateAllowance()
      this.addressSub = this.wallet.getActiveAddressObservable().subscribe((address) => {
         if (address) {
            console.log("address in usdt service is ", address)
            this.updateBalance().catch((err) => { })
            this.updateAllowance().catch((err) => { })
         }
      })
   }

   getUsdtBalancePromise() {
      return lastValueFrom(this.usdtBalanceObservable().pipe(
         catchError(err => {
            console.log('Error in stream', err);
            throw err;
         }),
         tap(balance => console.log("tapped balance promise is ", balance)),
         filter(balance => balance != null),
         take(1),
      ))
   }

   usdtBalanceObservable() {

      return this.usdtBalanceSubject.asObservable()
   }

   usdtAllowancePromise() {
      return firstValueFrom(this.allowanceObservable())
   }

   allowanceObservable() {
      console.log("allowance observable called")
      return this.usdtAllowanceSubject.asObservable()
   }

   async increaseAllowance(amount: number) {
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
               this.updateAllowance()
               sub.unsubscribe()
            }
         })
   }

   public async approveUsdt(amount: number) {
      const tx = this.usdtManager?.approve(environment.contracts.amm.address, amount)
      if (!tx) {
         throw new Error("could not create tx")
      }
      const signedTransaction = await this.wallet.signTransaction(tx);
      const sub = this.transaction.sendSignedTransaction(signedTransaction)
         .subscribe((result) => {
            console.log("result is ", result)
            if (result.status.isFinalized) {
               this.updateAllowance()
               sub.unsubscribe()
            }
         })
   }

   async updateBalance() {
      console.log("getting usdt balance")
      const address = await firstValueFrom(this.wallet.getActiveAddressObservable().pipe(filter((address) => address != null)))
      const outcome = await this.usdtManager?.getBalance(address!)
      if (!outcome) {
         throw new Error("could not get balance")
      }
      const balance = this.transaction.processReadOutcomes(outcome, this.formatUsdtBalance)
      console.log("updating balance with ", balance)
      if (balance != null) this.usdtBalanceSubject.next(balance)
   }

   async updateAllowance() {
      const userAddress = await this.wallet.getAddressPromise();
      if (!userAddress) {
         throw new Error("could not get user address")
      }
      const outcome = await this.usdtManager?.getAllowance(userAddress);
      if (!outcome) {
         throw new Error("could not get allowance")
      }
      const allowance = this.transaction.processReadOutcomes(outcome, this.formatUsdtBalance)
      if (allowance) {
         this.usdtAllowanceSubject.next(allowance)
      }
   }

   public formatUsdtBalance(balance: string | number) {
      return Utils.reduceByCurrencyDecimal(balance, CurrencyTickerEnum.USDT)
   }

}
