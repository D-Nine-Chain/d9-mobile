import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AssetsService } from 'app/services/asset/asset.service';
import { substrateAddressValidator } from 'app/utils/Validators';
import { Subject, takeUntil } from 'rxjs';

@Component({
   selector: 'app-send',
   templateUrl: './send.component.html',
   styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {
   private destroy$ = new Subject<void>();
   amountToSend = new FormControl(1, [Validators.required, Validators.min(1)]);
   toAddress = new FormControl('', [Validators.required, Validators.min(1), substrateAddressValidator()]);
   queryParams: any;
   constructor(private asset: AssetsService, private route: ActivatedRoute) { }

   ngOnInit() {
      this.queryParams = this.route.snapshot.queryParams;
      if (this.queryParams) {
         this.toAddress.setValue(this.queryParams.address)
      }
   }

   send() {
      if (this.amountToSend.valid && this.toAddress.valid) {
         const address = this.toAddress.value;
         const amount = this.amountToSend.value;
         this.asset.transferD9(address!, amount!)

      }
   }
}
