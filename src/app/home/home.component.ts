import { Component, OnInit } from '@angular/core';
import { faQrcode, faWallet, faArrowDown, faArrowUp, faShuffle, faBars, faHome } from "@fortawesome/free-solid-svg-icons"
import { Account, Asset } from 'app/types';
import { AccountService } from 'app/services/account/account.service';
import { AssetsService } from 'app/services/asset/asset.service';
import { Subscription } from 'rxjs';
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
   account: Account | null = null;
   assetsSub: Subscription | null = null;
   constructor(private accountService: AccountService) {
   }

   ngOnInit() { }

}
