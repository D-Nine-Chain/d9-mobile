import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NodesService } from 'app/services/nodes/nodes.service';

@Component({
   selector: 'app-bond',
   templateUrl: './bond.component.html',
   styleUrls: ['./bond.component.scss'],
})
export class BondComponent implements OnInit {
   bondAmount = new FormControl(100, [Validators.required, Validators.min(100)]);
   constructor(private nodes: NodesService) { }

   ngOnInit() { }
   bondTokens() {
      if (this.bondAmount.valid) {
         console.log("bond tokens called")
         const amount = this.bondAmount.value;
         this.nodes.bondTokens(amount!)
      }
   }
}
