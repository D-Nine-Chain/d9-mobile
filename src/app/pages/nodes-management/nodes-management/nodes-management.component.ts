import { Component, OnInit } from '@angular/core';
import { NodesService } from 'app/services/nodes/nodes.service';
import { SessionOverview } from 'app/types';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-nodes-management',
   templateUrl: './nodes-management.component.html',
   styleUrls: ['./nodes-management.component.scss'],
})
export class NodesManagementComponent implements OnInit {

   ngOnInit() { }

}
