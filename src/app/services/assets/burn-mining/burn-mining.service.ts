import { Injectable } from '@angular/core';
import { BurnPortfolio } from 'app/types';
import { BehaviorSubject } from 'rxjs';
import { BurnManager } from 'app/contracts/burn-manager/burn-manager';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { WalletService } from 'app/services/wallet/wallet.service';
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
   burnManager: BurnManager;
   private totalNetworkBurn = new BehaviorSubject<number>(0);
   constructor(private d9api: D9ApiService, private wallet: WalletService) {
      this.burnManager = new BurnManager(d9api);
   }

   getBurnPortfolioSub() {
      return this.burnPortfolioSource.asObservable();
   }

   getNetworkBurn() {
      return
   }

   getNetworkBurnSub() {
      return this.totalNetworkBurn.asObservable();
   }

   updateBurnPortfolio(burnPortfolio: BurnPortfolio) {
      this.burnPortfolioSource.next(burnPortfolio);
   }

   updateNetworkBurn(totalNetworkBurn: number) {
      this.totalNetworkBurn.next(totalNetworkBurn);
   }
}
