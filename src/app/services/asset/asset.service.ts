import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Asset, CurrencyInfo, D9Balances, LiquidityProvider } from 'app/types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, filter, first, firstValueFrom, from, map, pipe, switchMap, tap } from 'rxjs';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { D9ApiService } from '../d9-api/d9-api.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletService } from '../wallet/wallet.service';
import { Router } from '@angular/router';
import { AmmManager } from 'app/contracts/amm-manager/amm-manager';
import { UsdtManager } from 'app/contracts/usdt-manager/usdt-manager';
import { VoidFn } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { GenericContractService } from '../contracts/generic-contract/generic-contract.service';
// import { D9BalancesService } from '../assets/d9-balances/d9-balances.service';
@Injectable({
   providedIn: 'root'
})
export class AssetsService extends GenericContractService implements GenericContractService {
   public appBaseCurrencyInfo: CurrencyInfo = Utils.currenciesRecord[CurrencyTickerEnum.D9];
   private usdtBalanceSource = new BehaviorSubject<number>(0);;
   private assetsSource = new BehaviorSubject<Asset[]>([]);
   private ammManagerKey = "amm_manager";
   private usdtManagerKey = "usdt_manager";
   liquidityProviderKey = "liquidity_provider";
   currencyReservesKey = "currency_reserves";
   private transactionSub: any;
   d9BalancesSub: VoidFn | null = null;

   constructor(d9: D9ApiService, transaction: TransactionsService, wallet: WalletService, private router: Router) {
      super(wallet, transaction, d9);
      this.init().catch((err) => {
         console.log(err)
      })
   }

   public async init() {
      const ammManager = await this.initManager(this.ammManagerKey, environment.contracts.amm.name)
      const _ = await this.initManager(this.usdtManagerKey, environment.contracts.usdt.name)
      await this.initObservables(ammManager)
      await this.updateUsdtBalance()
   }
   /**
    * @descirption get the Usdt balance of an account
    * @returns Observable with formatted USDT balance
    */
   public getUsdtBalanceObservable() {
      return this.usdtBalanceSource.asObservable();
   }
   /**
    * @description get the Usdt allowance of the AMM Contract
    * @returns Promise<number|null>
    */
   public async getUsdtAllowance(): Promise<number | null> {
      const usdtManager = await this.getManager<UsdtManager>(this.usdtManagerKey);
      const callOutcome = await usdtManager.getAllowance(environment.contracts.amm.address);
      const data = this.transaction.processReadOutcomes(callOutcome, this.formatUsdtBalance);
      return data;
   }
   public async transferUsdt(toAddress: string, amount: number) {
      const contract = this.d9.getContract(environment.contracts.usdt.name);
   }
   /**
    * 
    * @returns should return a `D9Balances` object. the important values are `free`
    */
   public d9BalancesObservable(): Observable<any> {
      console.log("getting d9 balance");
      const d9 = from(this.d9.getApi());
      return d9.pipe(
         switchMap(api =>
            from(this.wallet.getActiveAddressObservable()).pipe(
               filter(address => address != null),
               switchMap(address =>
                  api.derive.balances.all(address!)
               ),
               map(balanceInfo => {
                  console.log("balance info is ", balanceInfo);
                  return this.formatD9Balances(balanceInfo);
               })
            )
         ),
      );
   }

   public getCurrencyReservesObservable() {
      return this.getObservable<any>(this.currencyReservesKey);
   }

   public updateCurrencyReservesFromChain() {
      return firstValueFrom(this.wallet.getActiveAddressObservable().pipe(
         switchMap(async (address) => this.updateDataFromChain<Date>(this.currencyReservesKey, (await this.getManager<AmmManager>(this.ammManagerKey)).getReserves(address!), this.formatCurrencyReserves))
      ))
   }
   public async getBurnManagerBalance() {
      const d9 = await this.d9.getApi();
      const burnManagerBalance = await firstValueFrom(d9.derive.balances.all(environment.contracts.burn_manager.address));
      console.log("burn manager balance", burnManagerBalance)
      return this.formatD9Balances(burnManagerBalance);
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

   public swapUsdtForD9(amount: number) {
      return from(this.d9.getContract(environment.contracts.amm.name)).pipe(
         switchMap((contract: AmmManager) => {
            const tx = contract.makeUsdtToD9Tx(amount);
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
      const address = await firstValueFrom(this.wallet.getActiveAddressObservable().pipe(filter((address) => address != null)))
      const contractOutcome = await contract.getBalance(address!)
      const balance = this.transaction.processReadOutcomes(contractOutcome, this.formatUsdtBalance)
      if (balance) {
         this.usdtBalanceSource.next(balance)
      }
   }


   getParent(): Promise<string> {
      const observable$ = this.wallet.getActiveAddressObservable().pipe(
         switchMap(account =>
            from(this.d9.getApi()).pipe(
               switchMap(d9 => from((d9.rpc as any).referral.getParent(account)))

            ).pipe(


            )
         ),
      );

      return firstValueFrom(observable$ as Observable<string>);
   }

   public getDirectReferralsCount() {
      return this.wallet.getActiveAddressObservable()
         .pipe(
            switchMap(address =>
               from(this.d9.getApi()).pipe(
                  switchMap(d9 =>
                     from((d9.rpc as any).referral.getDirectReferralsCount(address))
                  )
               )
            )
         );
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
      const result = await Preferences.get({ key: environment.preferences_assets })
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
      await Preferences.set({ key: environment.preferences_assets, value: JSON.stringify(assets) });
   }

   addAsset(asset: Asset) {
      this.assetsSource.next([...this.assetsSource.getValue(), asset]);
   }

   public getAssetsObservable() {
      return this.assetsSource.asObservable();
   }

   public swap(amount: number, from: CurrencyTickerEnum, to: CurrencyTickerEnum) {
      const currenyInBigNumberString = Utils.toBigNumberString(amount, from);
      if (from == CurrencyTickerEnum.D9 && to == CurrencyTickerEnum.USDT) {
         return this.swapD9ForUsdt(amount)
      }
      else if (from == CurrencyTickerEnum.USDT && to == CurrencyTickerEnum.D9) {
         return this.swapUsdtForD9(amount)
      }
      else {
         throw new Error("Invalid swap")
      }
   }
   public getReserves() {
      return firstValueFrom(this.wallet.getActiveAddressObservable().pipe(
         switchMap(async (address) => this.updateDataFromChain<Date>(this.currencyReservesKey, (await this.getManager<AmmManager>(this.ammManagerKey)).getReserves(address!), this.formatCurrencyReserves))
      ))
   }
   /**
    * @description adds liquidity to the pool
    * @note does a check to see if the new liquidity is within some threshold. 
    * that threshold right nwo is 0.1
    */
   public async addLiquidity(d9Amount: number, usdtAmount: number): Promise<void> {
      const d9BalanceCheck = await this.checkD9Balance(d9Amount);
      const usdtBalanceCheck = await this.checkUsdtBalance(usdtAmount);
      const usdtAllowanceCheck = await this.checkUsdtAllowance(usdtAmount);
      if (!d9BalanceCheck) {
         throw new Error("Insufficient D9")
      }
      if (!usdtBalanceCheck) {
         throw new Error("Insufficient USDT")
      }
      if (!usdtAllowanceCheck) {
         throw new Error("Insufficient USDT allowance")
      }
      console.log("add liquidity called")
      const isLiquiditySufficient = await this.checkLiquidity(d9Amount, usdtAmount);
      if (!isLiquiditySufficient) {
         throw new Error("Insufficient liquidity")
      }
      const updatePromises = [
         this.updateLiquidityProviderFromChain(),
      ]
      this.currentTransactionSub = this.wallet.getActiveAddressObservable()
         .pipe(switchMap(address => {
            return this.executeWriteTransaction(this.ammManagerKey, 'addLiquidity', [d9Amount, usdtAmount], updatePromises)
         })).subscribe();
   }

   public getLiquidityProviderObservable() {
      return this.getObservable<LiquidityProvider | null>(this.liquidityProviderKey);
   }

   private async updateLiquidityProviderFromChain(): Promise<void> {
      console.log("updating LP from chain")
      return firstValueFrom(this.wallet.getActiveAddressObservable().pipe(
         switchMap(async (address) => this.updateDataFromChain<LiquidityProvider | null>(this.liquidityProviderKey, (await this.getManager<AmmManager>(this.ammManagerKey)).getLiquidityProvider(address!), this.formatLiquidityProvider))
      ))
   }

   private checkUsdtBalance(amount: number): boolean {
      const balance = this.usdtBalanceSource.getValue();
      return balance >= amount;
   }

   private async checkUsdtAllowance(amount: number): Promise<boolean> {
      const usdtManager = await this.getManager<UsdtManager>(this.usdtManagerKey);
      const callOutcome = await usdtManager.getAllowance(environment.contracts.amm.address);
      const data = this.transaction.processReadOutcomes(callOutcome, this.formatUsdtBalance);

      return data ? (data as number >= amount) : false;
   }

   private async checkD9Balance(amount: number): Promise<boolean> {
      const balance = await firstValueFrom(this.d9BalancesObservable());
      return balance.free >= amount;
   }

   private async checkLiquidity(d9: number, usdt: number): Promise<boolean> {
      console.log("checking liquidity")
      const threshold = 0.1;
      const reserves = await firstValueFrom(this.getCurrencyReservesObservable());
      if (reserves[0] == 0 || reserves[1] == 0) {
         return true;
      }
      console.log("reserves are ", reserves)
      const d9Reserve = reserves[0];
      const usdtReserve = reserves[1];
      const price = d9Reserve / usdtReserve;
      const newLiquidityPrice = d9 / usdt;
      const difference = Math.abs(price - newLiquidityPrice);
      console.log(`difference is ${difference}`)
      return difference < threshold;
   }
   private formatLiquidityProvider(liquidityProvider: any): LiquidityProvider | null {
      if (!liquidityProvider) {
         return null;
      }
      return {
         accountId: encodeAddress(decodeAddress(liquidityProvider.accountId)),
         usdt: Utils.reduceByCurrencyDecimal(liquidityProvider.usdt, CurrencyTickerEnum.USDT),
         d9: Utils.reduceByCurrencyDecimal(liquidityProvider.d9, CurrencyTickerEnum.D9),
         lpTokens: Utils.reduceByCurrencyDecimal(liquidityProvider.lpTokens, CurrencyTickerEnum.LP_TOKEN)
      }
   }

   public formatUsdtBalance(balance: string | number) {
      return Utils.reduceByCurrencyDecimal(balance, CurrencyTickerEnum.USDT)
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

   private formatCurrencyReserves(reserves: any[]): any {
      const d9 = Utils.reduceByCurrencyDecimal(reserves[0], CurrencyTickerEnum.D9);
      const usdt = Utils.reduceByCurrencyDecimal(reserves[1], CurrencyTickerEnum.USDT);
      return [d9, usdt]
   }
   private async initObservables(ammManager: AmmManager) {

      this.initObservable<LiquidityProvider | null>(this.liquidityProviderKey,
         null
      );
      this.initObservable<any | null>(this.currencyReservesKey,
         [0, 0]
      );
      this.wallet.getActiveAddressObservable()
         .subscribe(async (address) => {
            if (address) {
               const getLiquidityAccountPromise = ammManager.getLiquidityProvider(address)
               await this.updateDataFromChain<LiquidityProvider>(this.liquidityProviderKey, getLiquidityAccountPromise, this.formatLiquidityProvider);
               const getCurrencyReservesPromise = ammManager.getReserves(address);
               await this.updateDataFromChain<any>(this.currencyReservesKey, getCurrencyReservesPromise, this.formatCurrencyReserves)
            }
         })


      this.observablesInitializedSubject.next(true);
   }



}
