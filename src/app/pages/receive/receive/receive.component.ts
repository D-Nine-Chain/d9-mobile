import { Component, OnInit } from '@angular/core';
import { WalletService } from 'app/services/wallet/wallet.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-receive',
   templateUrl: './receive.component.html',
   styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
   addressSub: Subscription | null = null;
   constructor(private wallet: WalletService) {

   }
   address: string = '';
   ngOnInit() {
      this.addressSub = this.wallet.getActiveAddressObservable().subscribe((address: string) => {
         this.address = address
      })
   }

}
