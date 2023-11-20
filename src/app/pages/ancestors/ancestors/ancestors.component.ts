import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'app/services/asset/asset.service';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { firstValueFrom } from 'rxjs';
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
      // firstValueFrom(this.assets.getDirectReferralsCount())
      //    .then((count) => {
      //       console.log("count of sons", count)
      //    })
      this.assets.getParent().then((parent) => {
         console.log("parentt", parent)
         if (parent) {
            console.log("parentt", parent)
            let decoded = decodeAddress(parent)
            console.log("decoded", decoded)
            let encoded = encodeAddress(decoded)
            console.log("encoded", encoded)
            this.parent = encoded
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
      this.subs.push(sub2)
   }

   ngOnInit() { }

}
function u8aToHex(parent: {}): any {
   throw new Error('Function not implemented.');
}

