import { Injectable } from '@angular/core';
import { Account, BurnPortfolio, GasLimits } from 'app/types';
import { BehaviorSubject, filter, first, firstValueFrom, of, switchMap } from 'rxjs';
import { BurnManager } from 'app/contracts/burn-manager/burn-manager';
// import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { formatNumber } from '@angular/common';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { environment } from 'environments/environment';
import { AccountService } from 'app/services/account/account.service';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';

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
   burnManagerSubject: BehaviorSubject<BurnManager | null> = new BehaviorSubject<BurnManager | null>(null);
   burnManager: BurnManager | null = null;
   userAccount: Account | null = null;
   private totalNetworkBurnedSubject = new BehaviorSubject<number>(0);
   constructor(private account: AccountService, private d9: D9ApiService, private wallet: WalletService) {
      this.account.getAccountObservable().subscribe((account) => {
         this.userAccount = account;
         if (account.address.length > 0) {
            this.initData()
               .then(() => {
                  console.log("calling prep contract")
               })
         }
      })

   }

   getBurnManager() {
      console.log("getting burn manager")
      return firstValueFrom(this.burnManagerSubject.asObservable()
         .pipe(
            filter((burnManager) => burnManager !== null),
            first()
         ))
   }

   async executeBurn(amount: number) {
      try {
         const burnTx = await this.burnManager?.makeBurnTx(amount);
         const signedTx = await this.wallet.signContractTransaction(burnTx as any);
         signedTx.send((result: any) => { })
      } catch (err) {
         console.log("error in execute burn ", err)
      }
   }




   async initData() {
      try {
         let bm = await this.d9.getContract(environment.contracts.burn_manager.name);
         this.burnManagerSubject.next(bm);
         this.getNetworkBurned(this.userAccount!.address)
            .then((totalNetworkBurn) => {
               console.log("network burn is ", totalNetworkBurn)
               // if (totalNetworkBurn) {
               //    this.updateTotalNetworkBurn(totalNetworkBurn);
               // }
            })

      } catch (err) {
         console.log("error in prepping contract ", err)

      }

   }

   async getBurnPortfolio(address: string) {
      console.log("address being used ", address)
      let bm = await this.getBurnManager();
      const { output, result } = await bm!.getBurnPortfolio(address)
      if (result.isOk && output != null) {
         console.log("burn portfolio result is ", result.toJSON())
         console.log("burn portfolio output is ", output.toJSON())
         let burnPortfolio = (output!.toJSON()! as any).ok
         console.log(burnPortfolio)
         if (burnPortfolio) {
            burnPortfolio.amountBurned = Utils.reduceByCurrencyDecimal(burnPortfolio.amountBurned, CurrencyTickerEnum.D9);
            burnPortfolio.balanceDue = Utils.reduceByCurrencyDecimal(burnPortfolio.balanceDue, CurrencyTickerEnum.D9);
            burnPortfolio.balancePaid = Utils.reduceByCurrencyDecimal(burnPortfolio.balancePaid, CurrencyTickerEnum.D9);
         }
         return burnPortfolio;
      }
      else {
         throw new Error("Error getting burn portfolio.");
      }
   }

   updateBurnPortfolio(burnPortfolio: BurnPortfolio) {
      this.burnPortfolioSubject.next(burnPortfolio);
   }

   async getNetworkBurned(address: string) {
      let bm = await this.getBurnManager();
      let { output, result } = await bm!.getNetworkBurned(address)
      console.log("output is ", output)
      console.log("result is ", result.toJSON())
      if (result.isOk && output != null) {
         let totalBurned = (output!.toJSON()! as any).ok
         if (totalBurned) {
            totalBurned = Utils.reduceByCurrencyDecimal(totalBurned, CurrencyTickerEnum.D9);
         }
         return totalBurned;
      }
   }
   /**
    * @description get total network burn observable
    * @returns returns a number in human decimal format
    */
   getTotalNetworkBurnedObservable() {
      return this.totalNetworkBurnedSubject.asObservable();
   }


   updateTotalNetworkBurn(totalNetworkBurn: number | string) {
      const formattedNumber = Utils.reduceByCurrencyDecimal(totalNetworkBurn, CurrencyTickerEnum.D9);
      this.totalNetworkBurnedSubject.next(formattedNumber);
   }

   // prepService() {
   //    this.account.getAccountObservable().subscribe((account) => {
   //       this.burnManager = new BurnManager()
   //    })
   //    this.getNetworkBurn()
   //       .then((totalNetworkBurn) => {
   //          console.log("network burn is ", totalNetworkBurn)
   //          this.updateTotalNetworkBurn(totalNetworkBurn);
   //       })
   // }
}
