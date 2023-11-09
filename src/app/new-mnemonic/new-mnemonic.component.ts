import { Component, OnInit } from '@angular/core';
import { WalletService } from '../services/wallet/wallet.service';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
   selector: 'app-new-mnemonic',
   templateUrl: './new-mnemonic.component.html',
   styleUrls: ['./new-mnemonic.component.scss'],
})
export class NewMnemonicComponent implements OnInit {
   mnemonicArray: string[] = [];
   wordNumber: number = 1;

   constructor(private wallet: WalletService, private toastController: ToastController, private router
      : Router) { }

   ngOnInit() {
      console.log(this.wallet.createNewMnemonic());
      let mnemonic = this.wallet.createNewMnemonic();
      this.wallet.createNewWallet(mnemonic);
      this.mnemonicArray = mnemonic.split(" ");
   }

   async saveWallet() {
      try {
         await Preferences.set({ key: 'firstLoad', value: 'false' })
         await this.presentToast();
         this.router.navigate(['/home']);
      } catch (e) {
         console.log(e);
      }
   }

   async presentToast() {
      const toast = await this.toastController.create({
         message: 'Wallet Created',
         duration: 1500,
         position: 'bottom',
      });
   }

}
