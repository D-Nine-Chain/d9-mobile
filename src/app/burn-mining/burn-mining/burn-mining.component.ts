import { Component, OnInit } from '@angular/core';
import { BurnMiningService } from 'app/services/assets/burn-mining/burn-mining.service';
@Component({
   selector: 'app-burn-mining',
   templateUrl: './burn-mining.component.html',
   styleUrls: ['./burn-mining.component.scss'],
})
export class BurnMiningComponent implements OnInit {

   constructor(private burnMiningService: BurnMiningService) { }

   ngOnInit() { }

   subscribeToLiveData() {

   }
}
