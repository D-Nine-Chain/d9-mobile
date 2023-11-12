import { Component, OnInit } from '@angular/core';
import { faQrcode, faWallet, faArrowDown, faArrowUp, faShuffle, faBars, faHome } from "@fortawesome/free-solid-svg-icons"
import { Account, Asset, D9Balances } from 'app/types';
import { AccountService } from 'app/services/account/account.service';
import { Subscription } from 'rxjs';
import { D9BalancesService } from 'app/assets/d9-balances/d9-balances.service';
import { CurrencySymbol, CurrencyTickerEnum } from 'app/utils/utils';
import { Utils } from 'app/utils/utils';
@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
   walletIcon = faWallet;
   qrCodeIcon = faQrcode
   receiveIcon = faArrowDown;
   sendIcon = faArrowUp;
   swapIcon = faShuffle;
   menuIcon = faBars;
   homeIcon = faHome;
   assets: Asset[] = [];
   account: Account = {
      address: "",
      name: "",
   };
   assetsSub: Subscription | null = null;
   d9Balances: D9Balances = {
      frozen: "0",
      reserved: "0",
      free: "0",
   }
   currencySymbol = CurrencySymbol.D9
   accountSub: Subscription | null = null;
   balancesSub: Subscription | null = null;
   constructor(private accountService: AccountService, private d9BalancesService: D9BalancesService) {
      this.accountSub = this.accountService.getAccountObservable().subscribe((account) => {
         this.account = account
         console.log("account is ", account);
         this.balancesSub = this.d9BalancesService.connectToD9BalancesSub(account.address).subscribe((d9Balances) => {
            console.log("d9 balances", d9Balances)
            this.d9Balances = {
               free: Utils.reduceByCurrencyDecimal(d9Balances.free, CurrencyTickerEnum.D9),
               frozen: Utils.reduceByCurrencyDecimal(d9Balances.frozen, CurrencyTickerEnum.D9),
               reserved: Utils.reduceByCurrencyDecimal(d9Balances.reserved, CurrencyTickerEnum.D9)
            }
         })
      })

   }
   formatNumber(number: string | number) {
      return Utils.formatNumberForUI(number as number)
   }
   ngOnInit() {

      // this.d9BalancesService.connectToD9BalancesSub()
   }

   ngOnDestroy() {
      this.accountSub?.unsubscribe();
      this.balancesSub?.unsubscribe();
   }

}
