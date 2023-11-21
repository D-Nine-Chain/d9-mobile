import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { register } from 'swiper/element/bundle';
import { faQrcode, faWallet, faArrowDown, faArrowUp, faShuffle, faBars, faHome, faBell } from "@fortawesome/free-solid-svg-icons";
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AssetsService } from './services/asset/asset.service';
import '@polkadot/api-augment'
register();


// import Swiper and modules styles


@Component({
   selector: 'app-root',
   templateUrl: 'app.component.html',
   styleUrls: ['app.component.scss'],
})
export class AppComponent {
   walletIcon = faWallet;
   qrCodeIcon = faQrcode;
   notificationIcon = faBell;
   receiveIcon = faArrowDown;
   sendIcon = faArrowUp;
   swapIcon = faShuffle;
   menuIcon = faBars;
   homeIcon = faHome;
   hasNotifications = false;
   constructor(private _router: Router, private menuController: MenuController, private platform: Platform, private assets: AssetsService) {
      this.prepPlatformFunctions();
      this.checkFirstLoad();
   }

   prepPlatformFunctions() {
      this.platform.ready().then(() => {
         this.platform.pause.subscribe(async () => {
            // await this.assets.saveAssetsToPreferences();
         });
      })
   }

   scan() {
      this._router.navigate(['/qr-scanner']);
   }
   checkFirstLoad() {
      Preferences.get({ key: 'firstLoad' }).then(({ value }) => {
         console.log('firstLoad', value);
         if (value === null) {
            console.log("the value is null")
            // this._router.navigate(['/first-run']);
            this._router.navigate(['/new-mnemonic']);
         }
         else {
            this._router.navigate(['/liquidity']);
         }
      });
   }

   toAccountManagement() {
      this._router.navigate(['/account-management']);
   }

   toggleMenu() {
      console.log("toggling menu")
      this.menuController.toggle('main-menu')
   }
}
