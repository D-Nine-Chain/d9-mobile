import { Injectable } from '@angular/core';
import { Account, BurnPortfolio, GasLimits } from 'app/types';
import { BehaviorSubject, Subscription, filter, first, firstValueFrom, from, map, of, switchMap, tap } from 'rxjs';
import { BurnManager } from 'app/contracts/burn-manager/burn-manager';
// import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { environment } from 'environments/environment';
import { AccountService } from 'app/services/account/account.service';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { TransactionsService } from 'app/services/transactions/transactions.service';

@Injectable({
   providedIn: 'root'
})
export class BurnMiningService {
   private burnPortfolioSubject = new BehaviorSubject<BurnPortfolio>({
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
   private burnManagerSubject: BehaviorSubject<BurnManager | null> = new BehaviorSubject<BurnManager | null>(null);
   private burnManager: BurnManager | null = null;
   private userAccount: Account | null = null;
   private networkBurnedSubject = new BehaviorSubject<number>(0);
   private currentTransactionSub: Subscription | null = null;
   constructor(private account: AccountService, private d9: D9ApiService, private wallet: WalletService, private transaction: TransactionsService) {
      this.account.getAccountObservable().subscribe((account) => {
         this.userAccount = account;
         if (account.address.length > 0) {
            this.initData(account)
               .then(() => {
                  console.log("calling prep contract")
               })
         }
      })
   }

   public getPortfolioObservable() {
      return this.burnPortfolioSubject.asObservable();
   }

   public getNetworkBurnObservable() {
      return this.networkBurnedSubject.asObservable();
   }

   public executeBurn(amount: number) {
      this.currentTransactionSub = from(this.getBurnManager()).pipe(
         switchMap((bm) => {
            const burnTx = bm!.makeBurnTx(amount);
            return from(this.wallet.signContractTransaction(burnTx))
               .pipe(switchMap(signedTx => {
                  return from(this.transaction.sendSignedTransaction(signedTx))
                     .pipe(
                        tap(async (result) => {
                           if (result.status.isFinalized) {
                              await this.updateData()
                           }
                        })
                     );
               }))
         }),
      ).subscribe();
   }

   public executeWithdraw() {
      this.currentTransactionSub = from(this.getBurnManager()).pipe(
         switchMap(bm => {
            const burnTx = bm!.makeWithdrawTx();
            return from(this.wallet.signContractTransaction(burnTx))
               .pipe(switchMap(signedTx => {
                  return from(this.transaction.sendSignedTransaction(signedTx))
                     .pipe(
                        tap(async (result) => {
                           if (result.status.isFinalized) {
                              console.log("withdrawal result human", result.toHuman())
                              await this.updateData()
                           }
                        })
                     );
               }))
         }),
      ).subscribe();
   }

   private getBurnManager() {
      console.log("getting burn manager")
      return firstValueFrom(this.burnManagerSubject.asObservable()
         .pipe(
            filter((burnManager) => burnManager !== null),
            first()
         ))
   }

   private async updateData() {
      await this.updatePortfolioFromChain(this.userAccount!.address);
      await this.updateNetworkBurnedFromChain(this.userAccount!.address);
      this.currentTransactionSub?.unsubscribe();
   }

   async initData(account: Account) {
      try {
         let bm = await this.d9.getContract(environment.contracts.burn_manager.name);
         this.updateBurnManager(bm);
         await this.updateNetworkBurnedFromChain(account.address)
         await this.updatePortfolioFromChain(account.address);
      } catch (err) {
         console.log("error in prepping contract ", err)
      }
   }

   private async updatePortfolioFromChain(address: string) {
      let bm = await this.getBurnManager();
      const { output, result } = await bm!.getBurnPortfolio(address)
      if (result.isOk && output != null) {
         let burnPortfolio = (output!.toJSON()! as any).ok
         console.log(burnPortfolio)
         if (burnPortfolio) {
            burnPortfolio.amountBurned = Utils.reduceByCurrencyDecimal(burnPortfolio.amountBurned, CurrencyTickerEnum.D9);
            burnPortfolio.balanceDue = Utils.reduceByCurrencyDecimal(burnPortfolio.balanceDue, CurrencyTickerEnum.D9);
            burnPortfolio.balancePaid = Utils.reduceByCurrencyDecimal(burnPortfolio.balancePaid, CurrencyTickerEnum.D9);
         }
         this.updateBurnPortfolio(burnPortfolio);
      }
   }

   private async updateNetworkBurnedFromChain(address: string) {
      let bm = await this.getBurnManager();
      const { output, result } = await bm!.getRawNetworkBurned(address)
      if (result.isOk && output != null) {
         let networkBurn = (output!.toJSON()! as any).ok
         console.log(networkBurn)
         if (networkBurn) {
            networkBurn = Utils.reduceByCurrencyDecimal(networkBurn, CurrencyTickerEnum.D9);
         }
         this.updateNetworkBurned(networkBurn);
         return networkBurn;
      }
   }

   private updateBurnPortfolio(burnPortfolio: BurnPortfolio) {
      this.burnPortfolioSubject.next(burnPortfolio);
   }

   private updateNetworkBurned(networkBurned: number) {
      this.networkBurnedSubject.next(networkBurned);
   }

   private updateBurnManager(burnManager: BurnManager) {
      console.log("burn manager is ", burnManager)
      this.burnManagerSubject.next(burnManager);
   }
}