import { Injectable } from '@angular/core';
import { BurnPortfolio } from 'app/types';
import { BehaviorSubject } from 'rxjs';
import { BurnManager } from 'app/contracts/burn-manager/burn-manager';
// import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { formatNumber } from '@angular/common';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { environment } from 'environments/environment';
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
   private totalNetworkBurnSubject = new BehaviorSubject<number>(0);
   constructor(private wallet: WalletService) {

   }

   getBurnPortfolioSub() {
      return this.burnPortfolioSource.asObservable();
   }

   async getNetworkBurn(): Promise<number> {
      const totalBurned = await this.burnManager?.getTotalNetworkBurned(this.wallet.getAddress())
      if (totalBurned == null) {
         return 0;
      } else {
         return Utils.reduceByCurrencyDecimal(totalBurned, CurrencyTickerEnum.D9);
      }
   }

   getNetworkBurnSub() {
      return this.totalNetworkBurnSubject.asObservable();
   }

   updateBurnPortfolio(burnPortfolio: BurnPortfolio) {
      this.burnPortfolioSource.next(burnPortfolio);
   }

   updateNetworkBurn(totalNetworkBurn: number | string) {
      const formattedNumber = Utils.reduceByCurrencyDecimal(totalNetworkBurn, CurrencyTickerEnum.D9);
      this.totalNetworkBurnSubject.next(formattedNumber);
   }
}
