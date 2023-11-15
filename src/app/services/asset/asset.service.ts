import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Asset, CurrencyInfo } from 'app/types';
import { environment } from 'environments/environment';
import { BehaviorSubject, firstValueFrom, from, map, switchMap, tap } from 'rxjs';
import { BN } from '@polkadot/util';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { D9ApiService } from '../d9-api/d9-api.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletService } from '../wallet/wallet.service';
import { Router } from '@angular/router';
// import { D9BalancesService } from '../assets/d9-balances/d9-balances.service';
@Injectable({
   providedIn: 'root'
})
export class AssetsService {
   public appBaseCurrencyInfo: CurrencyInfo = Utils.currenciesRecord[CurrencyTickerEnum.D9];

   private assetsSource = new BehaviorSubject<Asset[]>([]);
   private transactionSub: any;
   constructor(private d9: D9ApiService, private transaction: TransactionsService, private wallet: WalletService, private router: Router) {
      // this.loadAssetsFromPreferences();

   }

   public async transfer(toAddress: string, amount: number) {
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

   getConversionRate(baseCurrency: CurrencyTickerEnum, targetCurrency: CurrencyTickerEnum): Promise<number> {
      // Implementation that gets the conversion rate
      // For now, we return a dummy value
      return Promise.resolve(1); // Replace with actual implementation
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


   async calculateAssetValue(asset: Asset): Promise<BN> {
      const conversionRate = new BN(await this.getConversionRate(asset.ticker, this.appBaseCurrencyInfo.ticker as CurrencyTickerEnum));
      const assetValueInBase = new BN(asset.valueInBase);
      const assetBalance = new BN(typeof asset.balance === 'string' ? asset.balance : asset.balance?.toString() ?? '1');
      let assetValueInAppBase = assetValueInBase.mul(conversionRate).mul(assetBalance).div(new BN(10).pow(new BN(this.appBaseCurrencyInfo.decimals)));

      // If the asset has decimals defined, we need to account for it in the calculation
      if (asset.decimal) {
         // BN does not support floating point operations, so we handle decimals by dividing by 10^decimal
         const divisor = new BN(10).pow(new BN(asset.decimal));
         assetValueInAppBase = assetValueInAppBase.div(divisor);
      }

      return assetValueInAppBase; // Returns a BN instance representing the value
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
