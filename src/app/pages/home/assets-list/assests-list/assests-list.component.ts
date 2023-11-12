import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'app/services/asset/asset.service';
import { Asset } from 'app/types';
import { Subscription } from 'rxjs';

@Component({
   selector: 'home-assests-list',
   templateUrl: './assests-list.component.html',
   styleUrls: ['./assests-list.component.scss'],
})
export class AssestsListComponent implements OnInit {
   assets: Asset[] = [];
   assetsSub: Subscription | null = null;
   currencySymbol: string = this.assetService.appBaseCurrencyInfo.symbol;
   constructor(private assetService: AssetsService) {
      this.assetsSub = this.assetService.getAssetsObservable().subscribe((assets) => {
         this.assets = assets;
      })
   }

   ngOnInit() { }
   ngOnDestroy() {
      if (this.assetsSub) {
         this.assetsSub.unsubscribe();
      }
   }
}
