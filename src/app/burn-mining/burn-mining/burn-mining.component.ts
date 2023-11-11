import { Component, OnInit } from '@angular/core';
import { BurnMiningService } from 'app/services/assets/burn-mining/burn-mining.service';
import { Utils } from 'app/utils/utils';
@Component({
   selector: 'app-burn-mining',
   templateUrl: './burn-mining.component.html',
   styleUrls: ['./burn-mining.component.scss'],
})
export class BurnMiningComponent implements OnInit {
   totalBurned: number = 0;
   totalBurnedSub: any;
   constructor(private burnMiningService: BurnMiningService) {
      this.subscribeToLiveData();
   }

   ngOnInit() { }
   ngOnDestroy() {

   }
   formatNumber(number: number) {
      return Utils.formatNumberForUI(number as number)
   }
   subscribeToLiveData() {
      console.info("burn mining component is subscribing to live data")
      this.totalBurnedSub = this.burnMiningService.getTotalNetworkBurnedObservable().subscribe((totalBurned) => {
         console.log("total burned on burn mining component is ", totalBurned)
         this.totalBurned = totalBurned;
      });
   }

   unsubscribeToAll() {
      this.totalBurnedSub?.unsubscribe();
   }
}
