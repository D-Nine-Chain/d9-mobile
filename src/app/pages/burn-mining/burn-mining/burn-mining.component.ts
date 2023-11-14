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
   dataSubs: Subscription | null = null;
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
      this.subscribeToLiveData()
   }

   async ngOnInit() {

   }
   ngOnDestroy() {

   }
   async burn() {
      if (this.burnAmount.valid) {
         const amount = this.burnAmount.value;
         this.burnMiningService.executeBurn(amount!)

      }
   }

   async withdraw() {
      console.log("withdraw called")
      this.burnMiningService.executeWithdraw()
   }

   /** 
    * @description a wrapper function that formats numbers for UI. reduces decimals, formats for region. 
    * */
   formatNumber(number: number) {
      return Utils.formatNumberForUI(number as number)
   }
   async subscribeToLiveData() {
      const loading = await this.loadingController.create({
         message: 'Loading...',
      })
      loading.present();
      this.burnMiningService.getNetworkBurnObservable()
         .subscribe((burned) => {
            this.networkBurned = burned;
            if (burned > 0) {
               loading.dismiss();
            }
         })
      this.burnMiningService.getPortfolioObservable()
         .subscribe((portfolio) => {
            this.burnPortfolio = portfolio;

         })
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
      this.dataSubs?.unsubscribe();
   }
}
