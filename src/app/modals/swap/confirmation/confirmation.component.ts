import { Component, OnInit } from '@angular/core';
import { CurrencySymbol } from 'app/utils/utils';
import { details } from './confirmation.component.mock';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { AmmService } from 'app/services/contracts/amm/amm.service';
@Component({
   selector: 'app-confirmation',
   templateUrl: './confirmation.component.html',
   styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
   swapData: any;
   constructor(private modalController: ModalController, navParams: NavParams, private amm: AmmService) {
      this.swapData = navParams.get('data');
   }
   baseCurrencySymbol = CurrencySymbol.D9;
   convertedCurrencySymbol = CurrencySymbol.USDT;
   baseCurrency = 'GP';
   details = details;
   ngOnInit() { }
   async swap() {
      await this.amm.swap(this.swapData)
   }

   closeModal() {
      this.modalController.dismiss(); // Dismiss the modal
   }
}
