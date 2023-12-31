import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Asset, CurrencyInfo, D9Balances, LiquidityProvider } from 'app/types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, filter, first, firstValueFrom, from, lastValueFrom, map, pipe, switchMap, tap } from 'rxjs';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { D9ApiService } from '../d9-api/d9-api.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletService } from '../wallet/wallet.service';
import { Router } from '@angular/router';

import { VoidFn } from '@polkadot/api/types';

// import { D9BalancesService } from '../assets/d9-balances/d9-balances.service';
@Injectable({
   providedIn: 'root'
})
export class AssetsService {
   public appBaseCurrencyInfo: CurrencyInfo = Utils.currenciesRecord[CurrencyTickerEnum.D9];

   private transactionSub: any;
   d9BalancesSub: VoidFn | null = null;

   constructor(private d9: D9ApiService, private transaction: TransactionsService, private wallet: WalletService, private router: Router) {

      this.init().catch((err) => {
         console.log(err)
      })
   }

   private async init() {

      const api = await this.d9.getApiPromise();
   }

   public async d9BalancesPromise(): Promise<D9Balances> {
      return firstValueFrom(this.d9BalancesObservable())
   }

   /**
    * 
    * @returns should return a `D9Balances` object. the important values are `free`
    */
   public d9BalancesObservable(): Observable<D9Balances> {
      console.log("getting d9 balance");
      const d9 = from(this.d9.getApiPromise());
      return d9.pipe(
         switchMap(api =>
            from(this.wallet.activeAddressObservable()).pipe(
               filter(address => address != null),
               switchMap(address =>
                  api.derive.balances.all(address!)
               ),
               map(balanceInfo => {
                  return this.formatD9Balances(balanceInfo);
               }),
            )
         ),
      );
   }

   public async getBurnManagerBalance() {
      const d9 = await this.d9.getApiPromise();
      const burnManagerBalance = await firstValueFrom(d9.derive.balances.all(environment.contracts.main_pool.address));
      console.log("burn manager balance", burnManagerBalance)
      return this.formatD9Balances(burnManagerBalance);
   }

   public async transferD9(toAddress: string, amount: number) {
      const numberString = Utils.toBigNumberString(amount, CurrencyTickerEnum.D9);
      const api = await this.d9.getApiPromise();
      const transferTx = api.tx.balances.transfer(toAddress, numberString)
      const signedTransaction = await this.wallet.signTransaction(transferTx)
      this.transactionSub = this.transaction.sendSignedTransaction(signedTransaction)
         .pipe(
            tap(
               async (result) => {
                  if (result.status.isFinalized) {
                     this.transactionSub.unsubscribe();
                     this.router.navigate(['/home']);
                  }
               }
            )
         )
         .subscribe()
   }


   public getAssetIcon(ticker: CurrencyTickerEnum): string {
      const currencyInfo = Utils.getCurrencyInfo(ticker);
      return currencyInfo.symbol
   }




   private formatD9Balances(balanceInfo: any): D9Balances {
      let formattedBalances: Record<string, any> = {
         free: balanceInfo.freeBalance.toString(),

         reserved: balanceInfo.reservedBalance.toString(),
         locked: balanceInfo.lockedBalance.toString(),
         vested: balanceInfo.vestedBalance.toString(),
         voting: balanceInfo.votingBalance.toString(),
         available: balanceInfo.availableBalance.toString()
      }
      for (const balance in formattedBalances) {
         formattedBalances[balance] = Utils.reduceByCurrencyDecimal(formattedBalances[balance], CurrencyTickerEnum.D9)
      }
      return formattedBalances as D9Balances;
   }


}
