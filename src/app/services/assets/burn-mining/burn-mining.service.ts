import { Injectable } from '@angular/core';
import { BurnPortfolio, GasLimits } from 'app/types';
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
   burnManager: BurnManager | null = null;
   private totalNetworkBurnedSubject = new BehaviorSubject<number>(0);
   constructor(private account: AccountService, private d9: D9ApiService) {
      this.prepContract()
         .then(() => {
            console.log("calling prep contract")
         })
   }

   async prepContract() {
      try {
         const burnManagerContractPromise = await this.d9.getContractPromise('burnManager');
         const gasLimits: GasLimits = {
            readLimit: await this.d9.getReadGasLimit(),
            writeLimit: await this.d9.getGasLimit()
         }
         this.burnManager = new BurnManager(burnManagerContractPromise, gasLimits);
         console.log("contract is ", this.burnManager)
         this.getTotalNetworkBurn()
            .then((totalNetworkBurn) => {
               console.log("network burn is ", totalNetworkBurn)
               if (totalNetworkBurn) {
                  this.updateTotalNetworkBurn(totalNetworkBurn);
               }
            })
      } catch (err) {
         console.log("error in prepping contract ", err)

      }

   }

   getBurnPortfolioSub() {
      return this.burnPortfolioSource.asObservable();
   }

   async getTotalNetworkBurn() {
      if (!this.burnManager) {
         console.log("burn manager is not ready")
      } else if (this.burnManager) {
         console.log("burn manager is ready")
      }
      // return 300000000000000;
      return await this.burnManager?.getTotalNetworkBurned(environment.contracts.burn.address);
   }

   getTotalNetworkBurnedObservable() {
      return this.totalNetworkBurnedSubject.asObservable();
   }

   updateBurnPortfolio(burnPortfolio: BurnPortfolio) {
      this.burnPortfolioSource.next(burnPortfolio);
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
