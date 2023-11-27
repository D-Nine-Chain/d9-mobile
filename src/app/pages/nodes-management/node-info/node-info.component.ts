import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodesService } from 'app/services/nodes/nodes.service';
import { NodeInfo } from 'app/types';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-node-info',
   templateUrl: './node-info.component.html',
   styleUrls: ['./node-info.component.scss'],
})
export class NodeInfoComponent implements OnInit {
   queryParams: any;
   nodeAddress: string = "";
   nodeInfo: NodeInfo | null = null;
   constructor(private route: ActivatedRoute, private node: NodesService) { }
   nodeInfoSub: Subscription | null = null;
   ngOnInit() {
      // this.queryParams = this.route.snapshot.queryParams;
      console.log("query params are ", this.queryParams)
      if (this.queryParams) {
         this.nodeAddress = this.queryParams.nodeAddress
         console.log("node address is ", this.nodeAddress)
         if (this.nodeAddress) {
            console.log(`node ${this.nodeAddress} is `)
            this.nodeInfoSub = this.node.getNodeInfo(this.nodeAddress).subscribe((data: NodeInfo) => {
               if (data) {
                  this.nodeInfo = data
               }
               console.log("node info in component is ", this.nodeInfo)
            })
         }
      }

   }

   ngOnDestroy() {
      this.nodeInfoSub?.unsubscribe()
   }

}
