import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodesService } from 'app/services/nodes/nodes.service';

@Component({
   selector: 'app-validator-info',
   templateUrl: './validator-info.component.html',
   styleUrls: ['./validator-info.component.scss'],
})
export class ValidatorInfoComponent implements OnInit {
   queryParams: any;
   validatorAddress: string = "";
   constructor(private route: ActivatedRoute, private node: NodesService) { }

   ngOnInit() {
      this.queryParams = this.route.snapshot.queryParams;
      if (this.queryParams) {

      }
   }

}
