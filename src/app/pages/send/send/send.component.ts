import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AssetsService } from 'app/services/asset/asset.service';
import { substrateAddressValidator } from 'app/utils/Validators';

@Component({
   selector: 'app-send',
   templateUrl: './send.component.html',
   styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {
   amountToSend = new FormControl(1, [Validators.required, Validators.min(1)]);
   toAddress = new FormControl('', [Validators.required, Validators.min(1), substrateAddressValidator()]);
   constructor(private asset: AssetsService) { }

   ngOnInit() { }

   send() {
      if (this.amountToSend.valid && this.toAddress.valid) {
         const address = this.toAddress.value;
         const amount = this.amountToSend.value;
         this.asset.transfer(address!, amount!)

      }
   }
}
