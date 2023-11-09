import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Asset, BurnPortfolio, CurrencyInfo } from 'app/types';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';
import { BN } from '@polkadot/util';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
@Injectable({
   providedIn: 'root'
})
export class AssetsService {
   public appBaseCurrencyInfo: CurrencyInfo = Utils.currenciesRecord[CurrencyTickerEnum.D9];

   private burnPortfolioSource = new BehaviorSubject<BurnPortfolio>({
      amountBurned: 0,
      balanceDue: 0,
      balancePaid: 0,
      lastBurn: {
         time: 0,
         contract: ''
      },
      lastWithdrawal: {
         time: 0,
         contract: ''
      }
   });

   private assetsSource = new BehaviorSubject<Asset[]>([]);
   private totalNetworkBurn = new BehaviorSubject<number>(0);

   constructor() {
      this.loadAssetsFromPreferences();
      console.log(this.appBaseCurrencyInfo)
   }

   getConversionRate(baseCurrency: CurrencyTickerEnum, targetCurrency: CurrencyTickerEnum): Promise<number> {
      // Implementation that gets the conversion rate
      // For now, we return a dummy value
      return Promise.resolve(1); // Replace with actual implementation
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
      console.log("loading assets from preferences")
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



   getBurnPortfolioSub() {
      return this.burnPortfolioSource.asObservable();
   }

   getNetworkBurn() {
      return this.totalNetworkBurn.getValue();
   }

   getNetworkBurnSub() {
      return this.totalNetworkBurn.asObservable();
   }

   updateBurnPortfolio(burnPortfolio: BurnPortfolio) {
      this.burnPortfolioSource.next(burnPortfolio);
   }

   updateNetworkBurn(totalNetworkBurn: number) {
      this.totalNetworkBurn.next(totalNetworkBurn);
   }
}
