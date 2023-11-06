import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
   selector: 'app-first-run',
   templateUrl: './first-run.component.html',
   styleUrls: ['./first-run.component.scss'],
})
export class FirstRunComponent implements OnInit {

   constructor(private router: Router) {
   }

   ngOnInit() {
   }
   public createWallet() {
      console.log("create wallet")
      this.router.navigate(['new-mnemonic'])
   }
}
