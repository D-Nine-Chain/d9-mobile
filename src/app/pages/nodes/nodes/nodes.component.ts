import { Component, OnInit } from '@angular/core';
import { NodesService } from 'app/services/nodes/nodes.service';

@Component({
   selector: 'app-nodes',
   templateUrl: './nodes.component.html',
   styleUrls: ['./nodes.component.scss'],
})
export class NodesComponent implements OnInit {
   validators: any;
   constructor(private nodesService: NodesService) {
      this.nodesService.getSessionValidators()
         .subscribe((data) => {
            console.log("nodes", data)
            this.validators = data.validators
         })

      this.nodesService.getActiveEra()
         .subscribe((data) => {
            console.log("active era", data)
         })
      this.nodesService.getEraStakers()
         .subscribe((data) => {
            console.log("era stakers", data)
         })
   }

   ngOnInit() { }

}
