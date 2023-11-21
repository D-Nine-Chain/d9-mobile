import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { D9ApiService } from '../d9-api/d9-api.service';
import { TransactionsService } from '../transactions/transactions.service';
import { GenericContractServiceBase } from '../contracts/generic-contract/generic-contract.service';
import { environment } from 'environments/environment';
import { GenericContractServiceInterface } from '../contracts/generic-contract/generic-interface';
import { D9Contract } from 'app/contracts/contracts';
import { AmmManager } from 'app/contracts/amm-manager/amm-manager';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { Asset, LiquidityProvider } from 'app/types';
import { UsdtService } from '../usdt/usdt.service';
import { BehaviorSubject, firstValueFrom, lastValueFrom, take, tap } from 'rxjs';
import { AssetsService } from '../asset/asset.service';
import { SubmittableExtrinsic } from '@polkadot/api/types';

@Injectable({
   providedIn: 'root'
})
export class AmmService {
   private ammManager: AmmManager | null = null;
   private liquidityProviderSubject = new BehaviorSubject<LiquidityProvider | null>(null);
   private reservesSubject = new BehaviorSubject<any>([0, 0]);
   constructor(private d9: D9ApiService, private transaction: TransactionsService, private wallet: WalletService, private usdtService: UsdtService, private assets: AssetsService) {

      this.init().catch((err) => {
         console.log(err)
      })
   }
   private async init() {
      this.ammManager = await this.d9.getContract(environment.contracts.amm.name);
      this.updateLiquidityProvider().catch((err) => { })
      this.updateReserves().catch((err) => { })
   }

   liquidityProviderObservable() {
      return this.liquidityProviderSubject.asObservable();
   }

   currencyReservesObservable() {
      return this.reservesSubject.asObservable();
   }


   public async swap(swap: Swap) {
      let tx: SubmittableExtrinsic<'rxjs'> | undefined = undefined;
      if (swap.from == CurrencyTickerEnum.USDT) {
         tx = this.ammManager?.getD9(swap.fromAmount)
      }
      else if (swap.from == CurrencyTickerEnum.D9) {
         tx = this.ammManager?.getUsdt(swap.fromAmount)
      }
      else {
         throw new Error("invalid swap")
      }
      if (!tx) {
         throw new Error("could not create tx")
      }
      const signedTransaction = await this.wallet.signTransaction(tx);
      const sub = this.transaction.sendSignedTransaction(signedTransaction)
         .subscribe(async (result) => {
            console.log("result is ", result)
            if (result.status.isFinalized) {
               await this.usdtService.updateBalance();
               await this.updateReserves();
               sub.unsubscribe()
            }
            if (result.isError) {
               console.log("result ", result.toHuman())
               throw new Error("swap failed")
            }
         })
   }

   public async removeLiquidity(): Promise<void> {
      const tx = this.ammManager?.removeLiquidity();
      if (!tx) {
         throw new Error("could not create tx")
      }
      const signedTransaction = await this.wallet.signTransaction(tx);
      const sub = this.transaction.sendSignedTransaction(signedTransaction)
         .subscribe(async (result) => {
            console.log("result is ", result)
            if (result.status.isFinalized) {
               await this.updateLiquidityProvider();
               await this.updateReserves();
               await this.usdtService.updateBalance();
               sub.unsubscribe()
            }
         })
   }

   public getPrice(from: Asset, to: Asset): number {
      const reserves = this.reservesSubject.getValue();
      if (from.ticker == CurrencyTickerEnum.D9 && to.ticker == CurrencyTickerEnum.USDT) {
         return reserves[0] / reserves[1];
      }
      else if (from.ticker == CurrencyTickerEnum.USDT && to.ticker == CurrencyTickerEnum.D9) {
         return reserves[1] / reserves[0];
      }
      else {
         return 0;
      }
   }

   public async addLiquidity(d9Amount: number, usdtAmount: number): Promise<void> {
      console.log("adding liqudity")
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
      const tx = this.ammManager?.addLiquidity(d9Amount, usdtAmount);
      if (!tx) {
         throw new Error("could not create tx")
      }
      const signedTransaction = await this.wallet.signTransaction(tx);
      const sub = this.transaction.sendSignedTransaction(signedTransaction)
         .subscribe(async (result) => {
            console.log("result is ", result)
            if (result.status.isFinalized) {
               await this.updateLiquidityProvider();
               await this.updateReserves();
               await this.usdtService.updateBalance();
               sub.unsubscribe()
            }
         })
   }

   private async checkLiquidity(d9: number, usdt: number): Promise<boolean> {
      console.log("checking liquidity")
      const threshold = 0.1;
      const reserves = this.reservesSubject.getValue();
      const d9Reserve = reserves[0];
      const usdtReserve = reserves[1];
      const price = d9Reserve / usdtReserve;
      const newLiquidityPrice = d9 / usdt;
      const difference = Math.abs(price - newLiquidityPrice);
      console.log(`difference is ${difference}`)
      if (reserves[0] == 0 || reserves[1] == 0) {
         return true;
      }
      return difference < threshold;

   }

   private async checkUsdtBalance(amount: number): Promise<boolean> {
      console.log("checking usdt balance")
      const balance = (await this.usdtService.getUsdtBalancePromise()) ?? 0;
      console.log("usdt balance is ", balance)

      return balance ? balance >= amount : false;
   }

   private async checkUsdtAllowance(amount: number): Promise<boolean> {
      console.log("checking usdt allowance")
      const allowance = await this.usdtService.usdtAllowancePromise();
      return allowance ? allowance >= amount : false;
   }

   private async checkD9Balance(amount: number): Promise<boolean> {
      console.log("checking balance in amm")
      const balance = await this.assets.d9BalancesPromise();
      return balance.free as number >= amount;
   }

   async updateLiquidityProvider(): Promise<void> {
      const userAddress = await this.wallet.getAddressPromise();
      if (!userAddress) throw new Error("no address")
      const rx = await this.ammManager?.getLiquidityProvider(userAddress)
      if (!rx) {
         throw new Error("could not get liquidity provider")
      }
      const liquidityProvider = this.transaction.processReadOutcomes(rx, this.formatLiquidityProvider)
      if (liquidityProvider) {
         this.liquidityProviderSubject.next(liquidityProvider)
      }
   }

   async updateReserves(): Promise<void> {
      console.log("updating reserves")
      const userAddress = await this.wallet.getAddressPromise();
      if (!userAddress) throw new Error("no address")
      const rx = await this.ammManager?.getReserves(userAddress)
      if (!rx) {
         throw new Error("could not get liquidity provider")
      }
      const reserves = this.transaction.processReadOutcomes(rx, this.formatCurrencyReserves)
      if (reserves) {
         this.reservesSubject.next(reserves)
      }
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

   private formatCurrencyReserves(reserves: any[]): any {
      const d9 = Utils.reduceByCurrencyDecimal(reserves[0], CurrencyTickerEnum.D9);
      const usdt = Utils.reduceByCurrencyDecimal(reserves[1], CurrencyTickerEnum.USDT);
      return [d9, usdt]
   }


}

export interface Swap {
   from: CurrencyTickerEnum,
   to: CurrencyTickerEnum,
   fromAmount: number,
}