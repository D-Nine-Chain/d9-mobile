import { Injectable } from '@angular/core';
import { Account, BurnPortfolio, GasLimits } from 'app/types';
import { BehaviorSubject } from 'rxjs';
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
   burnManager: BurnManager | null = null;
   userAccount: Account | null = null;
   private totalNetworkBurnedSubject = new BehaviorSubject<number>(0);
   constructor(private account: AccountService, private d9: D9ApiService) {
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
   async executeBurn(amount: number) {
      const bigNumber = Utils.toBigNumberString(amount, CurrencyTickerEnum.D9);
      this.
   }

   async initData() {
      try {
         this.burnManager = await this.d9.getContract(environment.contracts.burn_manager.name);
         this.getTotalNetworkBurn(this.userAccount!.address)
            .then((totalNetworkBurn) => {
               console.log("network burn is ", totalNetworkBurn)
               if (totalNetworkBurn) {
                  this.updateTotalNetworkBurn(totalNetworkBurn);
               }
            })
         const burnPortfolio = await this.getBurnPortfolio(this.userAccount!.address);
         if (burnPortfolio) {
            console.info("updating burn portfolio");
            this.updateBurnPortfolio(burnPortfolio);
         }
      } catch (err) {
         console.log("error in prepping contract ", err)

      }

   }

   async getBurnPortfolio(address: string) {
      return this.burnManager?.getBurnPortfolio(address)
   }

   getBurnPortfolioObservable() {
      return this.burnPortfolioSubject.asObservable();
   }

   updateBurnPortfolio(burnPortfolio: BurnPortfolio) {
      this.burnPortfolioSubject.next(burnPortfolio);
   }

   async getTotalNetworkBurn(address: string) {

      if (!this.burnManager) {
         console.log("burn manager is not ready")
      } else if (this.burnManager) {
         console.log("burn manager is ready")
      }
      try {
         return await this.burnManager?.getTotalNetworkBurned(address);
      } catch (err) {
         throw err;
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
