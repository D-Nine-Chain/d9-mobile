import { Component, OnInit } from '@angular/core';
import { WalletService } from 'app/services/wallet/wallet.service';

@Component({
   selector: 'app-settings',
   templateUrl: './settings.component.html',
   styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

   constructor(private wallet: WalletService) {

   }

   ngOnInit() { }
   saveWallet() {
      this.wallet.createNewWallet("test")
         .then(() => console.log("wallet saved"))
   }

   resetEverything() {
      this.wallet.resetEverything()
         .then(() => console.log("nuke dropped"))
   }
}
