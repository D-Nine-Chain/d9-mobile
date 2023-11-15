import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'app/services/asset/asset.service';

@Component({
   selector: 'app-ancestors',
   templateUrl: './ancestors.component.html',
   styleUrls: ['./ancestors.component.scss'],
})
export class AncestorsComponent implements OnInit {
   ancestors: string[] = []
   parent: string = ""
   subs: any[] = [];
   constructor(private assets: AssetsService) {
      const sub1 = this.assets.getParent().subscribe((parent) => {
         console.log("parentt", parent)
         if (parent) {
            let sub3 = parent.subscribe((parent: any) => {
               console.log("parent", parent.toHuman())
               this.parent = parent
            })

            this.subs.push(sub3)
            // this.parent = parent
         }
      })
      const sub2 = this.assets.getAncestors().subscribe((ancestors) => {
         console.log("parentt", ancestors)
         if (ancestors) {
            let sub4 = ancestors.subscribe((ancestors: any) => {
               console.log("ancestors", ancestors.toHuman())
               this.ancestors = ancestors
            })

            this.subs.push(sub4)
            // this.parent = parent
         }
      })
      this.subs.push(sub1)
      this.subs.push(sub2)
   }

   ngOnInit() { }

}
function u8aToHex(parent: {}): any {
   throw new Error('Function not implemented.');
}

