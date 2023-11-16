import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Asset, CurrencyInfo, D9Balances } from 'app/types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, firstValueFrom, from, map, pipe, switchMap, tap } from 'rxjs';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { D9ApiService } from '../d9-api/d9-api.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletService } from '../wallet/wallet.service';
import { Router } from '@angular/router';
import { AmmManager } from 'app/contracts/amm-manager/amm-manager';
import { UsdtManager } from 'app/contracts/usdt-manager/usdt-manager';
import { VoidFn } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
// import { D9BalancesService } from '../assets/d9-balances/d9-balances.service';
@Injectable({
   providedIn: 'root'
})
export class AssetsService {
   public appBaseCurrencyInfo: CurrencyInfo = Utils.currenciesRecord[CurrencyTickerEnum.D9];
   private usdtBalanceSource = new BehaviorSubject<number>(0);;
   private assetsSource = new BehaviorSubject<Asset[]>([]);
   private transactionSub: any;
   d9BalancesSub: VoidFn | null = null;

   constructor(private d9: D9ApiService, private transaction: TransactionsService, private wallet: WalletService, private router: Router) {
      this.init()
         .then(() => { })
         .catch((err) => { })
   }

   public async init() {
      await this.updateUsdtBalance()
   }

   public getUsdtBalanceObservable() {
      return this.usdtBalanceSource.asObservable();
   }

   public async transferUsdt(toAddress: string, amount: number) {
      const contract = this.d9.getContract(environment.contracts.usdt.name);
   }

   public d9BalancesObservable(): Observable<any> {
      console.log("getting d9 balance");
      const d9 = from(this.d9.getApi());
      return d9.pipe(
         switchMap(api =>
            from(this.wallet.getActiveAddressObservable()).pipe(
               switchMap(address =>
                  api.derive.balances.all(address)
               ),
               map(balanceInfo => {
                  console.log("balance info is ", balanceInfo);
                  return this.formatD9Balances(balanceInfo);
               })
            )
         ),
      );
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
      console.log("formated balances ", formattedBalances)
      for (const balance in formattedBalances) {
         formattedBalances[balance] = Utils.reduceByCurrencyDecimal(formattedBalances[balance], CurrencyTickerEnum.D9)
      }
      return formattedBalances as D9Balances;
   }


   public async transferD9(toAddress: string, amount: number) {
      const numberString = Utils.toBigNumberString(amount, CurrencyTickerEnum.D9);
      const api = await this.d9.getApi();
      const transferTx = api.tx.balances.transfer(toAddress, numberString)
      const signedTransaction = await this.wallet.signContractTransaction(transferTx)
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

   public swapD9ForUsdt(amount: number) {
      return from(this.d9.getContract(environment.contracts.amm.name)).pipe(
         switchMap((contract: AmmManager) => {
            const tx = contract.makeD9ToUsdtTx(amount);
            return from(this.wallet.signContractTransaction(tx));
         }),
         switchMap((signedTx) => {
            return this.transaction.sendSignedTransaction(signedTx);
         }),
         tap((result: ISubmittableResult) => {
            if (result.isFinalized) {
               this.updateUsdtBalance()
            }
         })
      )
   }

   private async updateUsdtBalance() {
      console.log("getting usdt balance")
      const contract: UsdtManager = await this.d9.getContract(environment.contracts.usdt.name);
      const address = await firstValueFrom(this.wallet.getActiveAddressObservable())
      const contractOutcome = await contract.getBalance(address)
      const balance = this.transaction.processReadOutcomes(contractOutcome, this.formatUsdtBalance)
      if (balance) {
         this.usdtBalanceSource.next(balance)
      }
   }

   public formatUsdtBalance(balance: string | number) {
      return Utils.reduceByCurrencyDecimal(balance, CurrencyTickerEnum.USDT)
   }

   getParent() {
      return this.wallet.getActiveAddressObservable()
         .pipe(switchMap(
            async (account) => {
               const d9 = await this.d9.getApi();
               return await (d9.rpc as any).referral.getParent(account)
            }
         ),

         )
   }

   getAncestors() {
      return this.wallet.getActiveAddressObservable()
         .pipe(switchMap(
            async (account) => {
               const d9 = await this.d9.getApi();
               return await (d9.rpc as any).referral.getAncestors(account)
            }
         ),

         )
   }

   async loadAssetsFromPreferences() {
      const result = await Preferences.get({ key: environment.preferences_assets_key })
      if (result.value) {
         const assets = JSON.parse(result.value);
         this.assetsSource.next(assets);
      }
      else {
         const defaultAssets: Asset[] = [
            {
               name: "USDT",
               ticker: CurrencyTickerEnum.USDT,
               valueInBase: '1'
            },
            {
               name: "D9",
               ticker: CurrencyTickerEnum.D9,
               valueInBase: '1'
            }
         ]
         this.assetsSource.next(defaultAssets);
      }
   }

   public async saveAssetsToPreferences() {
      const assets = this.assetsSource.getValue();
      await Preferences.set({ key: environment.preferences_assets_key, value: JSON.stringify(assets) });
   }

   addAsset(asset: Asset) {
      this.assetsSource.next([...this.assetsSource.getValue(), asset]);
   }

   public getAssetsObservable() {
      return this.assetsSource.asObservable();
   }


}
