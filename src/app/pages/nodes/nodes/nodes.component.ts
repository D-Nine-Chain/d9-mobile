import { Component, OnInit } from '@angular/core';
import { NodesService } from 'app/services/nodes/nodes.service';
import { SessionOverview } from 'app/types';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-nodes',
   templateUrl: './nodes.component.html',
   styleUrls: ['./nodes.component.scss'],
})
export class NodesComponent implements OnInit {

   ngOnInit() { }

}
