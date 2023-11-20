import { Injectable } from '@angular/core';
import { Account, BurnMinerAccount, BurnPortfolio } from 'app/types';
import { BehaviorSubject, Subscription, filter, first, firstValueFrom, from, last, switchMap, tap } from 'rxjs';
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
   private burnManagerBalanceSubject = new BehaviorSubject<number>(0);
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

   public async getAccountOnBurnMiner(): Promise<BurnMinerAccount> {
      const address = await firstValueFrom(this.wallet.getActiveAddressObservable());
      const burnMiner = await this.d9.getContract(environment.contracts.burn_miner.name);
      const contractCallOutcome = await burnMiner.getAccount(address)
      const account = this.transaction.processReadOutcomes(contractCallOutcome, this.formatBurnMinerAccount)!;
      return account;
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
            return from(this.wallet.signTransaction(burnTx))
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
            return from(this.wallet.signTransaction(burnTx))
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

   public async calculateDividend(burnPortfolio: BurnPortfolio,): Promise<number> {
      const baseExtraction = await this.calculateBaseExtraction(burnPortfolio);

      const referralBoost = await this.calculateReferralBoost();
      return baseExtraction + referralBoost;
   }

   public async calculateBaseExtraction(burnPortfolio: BurnPortfolio): Promise<number> {
      console.info("calculating base extraction")
      const lastInteraction = this.getLatestDate(burnPortfolio);
      const now = new Date();
      const millisecondDay = 600000
      console.log("last interaction ", lastInteraction)
      console.log("now ", now.getTime())
      const daysSinceLastAction = Math.floor((now.getTime() - lastInteraction) / millisecondDay);
      console.info(`days since last action ${daysSinceLastAction}`)
      const dailyReturnPercent = await this.getReturnPercent();

      const dailyAllowance = dailyReturnPercent * burnPortfolio.amountBurned;
      console.info(`daily allowance ${dailyAllowance}`)
      // Multiply the daily allowance by the number of days since the last withdrawal
      const allowance = Math.max(0, dailyAllowance * daysSinceLastAction);
      console.info(`total allowance ${allowance}`)
      return allowance;
   }

   public async calculateReferralBoost(): Promise<number> {
      const burnMinerAccount = await this.getAccountOnBurnMiner();
      return burnMinerAccount.referralBoostCoefficients[0] * 0.1 + burnMinerAccount.referralBoostCoefficients[1] * 0.01;
   }

   private getLatestDate(portfolio: BurnPortfolio): number {
      let latestTime = portfolio.lastBurn.time;
      if (portfolio.lastWithdrawal && portfolio.lastWithdrawal.time > latestTime) {
         latestTime = portfolio.lastWithdrawal.time;
      }

      return latestTime;
   }

   async getReturnPercent(): Promise<number> {
      console.log("return percent called")
      const totalAmountBurned = await firstValueFrom(this.getNetworkBurnObservable()
         .pipe(filter(num => num > 0))
      );
      const firstThresholdAmount = 200000000; // Equivalent to 200_000_000_000_000_000_000 in contract
      let percentage = 8 / 1000; // Equivalent to Perbill::from_rational(8u32, 1000u32)
      console.log("percent total amount burned", totalAmountBurned)
      if (totalAmountBurned <= firstThresholdAmount) {
         return percentage;
      }
      const excessAmount = Math.max(0, totalAmountBurned - firstThresholdAmount);
      const reductions = Math.floor(excessAmount / 100000000) + 1;
      for (let i = 0; i < reductions; i++) {
         percentage /= 2; // Equivalent to saturating_div in Rust
      }
      console.log("percentage is ", percentage)
      return percentage;
   }


   private getBurnManager() {
      console.log("getting burn manager")
      return firstValueFrom(this.burnManagerSubject.asObservable()
         .pipe(
            filter((burnManager) => burnManager !== null),
            first()
         ))
   }
   private formatBurnMinerAccount(data: any): BurnMinerAccount {
      console.log("formatting burn miner account", data)
      const newReferralBoost = data.referralBoostCoefficients.map((coefficient: any) => {
         return Utils.reduceByCurrencyDecimal(coefficient, CurrencyTickerEnum.D9)
      })
      return {
         creationTimestamp: data.creationTimestamp,
         amountBurned: Utils.reduceByCurrencyDecimal(data.amountBurned, CurrencyTickerEnum.D9),
         balanceDue: Utils.reduceByCurrencyDecimal(data.balanceDue, CurrencyTickerEnum.D9),
         balancePaid: Utils.reduceByCurrencyDecimal(data.balancePaid, CurrencyTickerEnum.D9),
         lastWithdrawal: data.lastWithdrawal,
         lastBurn: data.lastBurn,
         referralBoostCoefficients: newReferralBoost,
         lastInteraction: data.lastInteraction
      }
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
      if (result.isOk && (output?.toJSON() as any).ok == null) {
         this.updateBurnPortfolio({
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
      }
      else if (result.isOk && (output?.toJSON() as any).ok != null) {
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