import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'app/services/asset/asset.service';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { firstValueFrom } from 'rxjs';
import { ReferralService } from 'app/services/referral/referral.service';
@Component({
   selector: 'app-ancestors',
   templateUrl: './ancestors.component.html',
   styleUrls: ['./ancestors.component.scss'],
})
export class AncestorsComponent implements OnInit {
   ancestors: string[] = []
   parent: string = ""
   subs: any[] = [];
   childCount: number | string = 0;
   constructor(private referral: ReferralService) {
      // firstValueFrom(this.assets.getDirectReferralsCount())
      //    .then((count) => {
      //       console.log("count of sons", count)
      //    })
      this.referral.getParent().then((parent) => {
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
      const sub5 = this.referral.getDirectReferrals()
         .subscribe((count) => {
            console.log("child coundt count", count)
            if (count) {
               this.childCount = typeof count === 'number' || typeof count === 'string' ? count : 0
            }
         })
      this.subs.push(sub5)
      const sub2 = this.referral.getAncestors().subscribe((ancestors) => {
         console.log("parentt", ancestors)
         if (ancestors) {
            let sub4 = ancestors.subscribe((ancestors: any) => {
               console.log("ancestors", ancestors.toHuman())
               let ancestorsArr = ancestors.toJSON()
               let decoded = ancestorsArr.map((ancestor: any) => {
                  return decodeAddress(ancestor)
               })
               let encoded = decoded.map((ancestor: any) => {
                  return encodeAddress(ancestor)
               })
               this.ancestors = encoded
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

