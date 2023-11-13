import { Component, OnInit } from '@angular/core';
import { BurnMiningService } from 'app/services/assets/burn-mining/burn-mining.service';
import { BurnPortfolio } from 'app/types';
import { Utils } from 'app/utils/utils';
import { Subscription, forkJoin, from, map, switchMap } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { AccountService } from 'app/services/account/account.service';
import { LoadingController } from '@ionic/angular';
@Component({
   selector: 'app-burn-mining',
   templateUrl: './burn-mining.component.html',
   styleUrls: ['./burn-mining.component.scss'],
})
export class BurnMiningComponent implements OnInit {
   burnAmount = new FormControl(100, [Validators.required, Validators.min(100)]);
   networkBurned: number = 0;
   totalBurnedSub: Subscription | null = null;
   burnPortfolioSub: Subscription | null = null;
   burnPortfolio: BurnPortfolio = {
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
   };

   constructor(private burnMiningService: BurnMiningService, private accountService: AccountService, private loadingController: LoadingController) {
      this.subscribeToLiveData();
   }

   ngOnInit() { }
   ngOnDestroy() {

   }
   async burn() {
      const loading = await this.loadingController.create({
         message: 'Burning D9...',
      })
      loading.present();
      if (this.burnAmount.valid) {
         const amount = this.burnAmount.value;
         console.log('Amount to burn:', amount);
         this.burnMiningService.executeBurn(amount!).subscribe((result) => {
            console.log("result in burn component is ", result)
            if (result.status.isInBlock) {
               loading.message = "Waiting for confirmation..."
            }

            if (result.status.isFinalized) {
               loading.message = "Updating burn portfolio..."
               this.accountService.getAccount()
                  .then((account) => {

                     return Promise.all([
                        this.burnMiningService.getNetworkBurned(account.address),
                        this.burnMiningService.getBurnPortfolio(account.address)
                     ])
                  })
                  .then(([networkBurned, burnPortfolio]) => {
                     loading.dismiss()
                     this.networkBurned = networkBurned;
                     this.burnPortfolio = burnPortfolio;
                  })
            }
         })

         console.log("current portofol", this.burnPortfolio)
      }
   }
   /** 
    * @description a wrapper function that formats numbers for UI. reduces decimals, formats for region. 
    * */
   formatNumber(number: number) {
      return Utils.formatNumberForUI(number as number)
   }
   subscribeToLiveData() {
      console.info("burn mining component is subscribing to live data")

      this.accountService.getAccountObservable().pipe(
         switchMap(account => {
            // Convert both promises to observables and execute them in parallel
            const burnPortfolio$ = from(this.burnMiningService.getBurnPortfolio(account.address));
            const networkBurned$ = from(this.burnMiningService.getNetworkBurned(account.address));

            return forkJoin([burnPortfolio$, networkBurned$]).pipe(
               map(([burnPortfolio, networkBurned]) => {
                  return { burnPortfolio, networkBurned };
               })
            );
         })
      ).subscribe(({ burnPortfolio, networkBurned }) => {
         // Handle the data here
         this.burnPortfolio = burnPortfolio;
         this.networkBurned = networkBurned;
         console.log("Burn Portfolio:", burnPortfolio);
         console.log("Network Burned:", networkBurned);
      });

   }

   calculateContributionPercentage() {
      if (this.networkBurned > 0) {
         return this.burnPortfolio.amountBurned / this.networkBurned * 100;
      }
      else {
         return 0;
      }
   }

   toHumanDate(millisecondDate: number) {
      return new Date(millisecondDate).toLocaleDateString();
   }

   unsubscribeToAll() {
      this.totalBurnedSub?.unsubscribe();
   }
}
