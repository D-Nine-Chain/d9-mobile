import { Component, OnInit } from '@angular/core';
import { MerchantMiningService } from 'app/services/contracts/merchant-mining/merchant-mining.service';


@Component({
   selector: 'app-merchant-mining',
   templateUrl: './merchant-mining.component.html',
   styleUrls: ['./merchant-mining.component.scss'],
})
export class MerchantMiningComponent implements OnInit {

   constructor(private merchantMining: MerchantMiningService) { }

   ngOnInit() { }

}
