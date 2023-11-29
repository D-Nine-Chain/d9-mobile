import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
   selector: 'app-error',
   templateUrl: './error.component.html',
   styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
   queryParams: any;
   constructor(private route: ActivatedRoute) { }

   ngOnInit() {
      this.queryParams = this.route.snapshot.queryParams;
      console.log("query params are", this.queryParams)
   }

}
