import { Component, OnInit } from '@angular/core';
import { faQrcode, faWallet, faArrowDown, faArrowUp, faShuffle } from "@fortawesome/free-solid-svg-icons"
@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

   constructor() { }
   walletIcon = faWallet;
   qrCodeIcon = faQrcode
   receiveIcon = faArrowDown;
   sendIcon = faArrowUp;
   swapIcon = faShuffle;
   ngOnInit() { }

}
