import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NodesService } from 'app/services/nodes/nodes.service';
import { SessionOverview } from 'app/types';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-session-overview',
   templateUrl: './session-overview.component.html',
   styleUrls: ['./session-overview.component.scss'],
})
export class SessionOverviewComponent implements OnInit {
   validators: string[] = [];
   overview: SessionOverview | null = null;
   subs: Subscription[] = []
   constructor(private nodesService: NodesService, private router: Router) {


      let overviewSub = this.nodesService.getOverview()
         .subscribe((data) => {
            if (data) {
               this.overview = data
            }
         })
      this.subs.push(overviewSub)
   }

   ngOnInit() { }
   navigateTo(address: string) {
      console.log("navigate to ", address)
      this.router.navigate(['/nodes-management/node-info', { address: address }])
   }
}
