import { Component, OnInit } from '@angular/core';
import { CurrencySymbol } from 'app/utils/utils';
import { details } from './confirmation.component.mock';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  constructor(private modalController: ModalController) {}
  baseCurrencySymbol = CurrencySymbol.D9;
  convertedCurrencySymbol = CurrencySymbol.USDT;
  baseCurrency = 'GP';
  details = details;
  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss(); // Dismiss the modal
  }
}
