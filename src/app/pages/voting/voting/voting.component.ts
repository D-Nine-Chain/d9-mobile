import { Component, OnInit } from '@angular/core';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { VotingService } from 'app/services/voting/voting.service';
import { WalletService } from 'app/services/wallet/wallet.service';

@Component({
   selector: 'app-voting',
   templateUrl: './voting.component.html',
   styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {
   constructor(private voting: VotingService, private usdt: UsdtService, private wallet: WalletService) { }

   ngOnInit() {
      // this.voting.getSortedCandidates().subscribe((candidates) => {
      //    console.log("sorted candidates ", candidates);
      // })

      // this.voting.getVotingInterest().subscribe((interest) => {
      //    console.log("voting interest", interest)
      // })

   }

   addVote() {
      // this.voting.addVotingInterest(100)

   }
}
/*!query
candidateAccumulativeVotes: function memoized(args)​​
candidateSupporters: function memoized(args)​​
currentNumberOfCandidates: function memoized(args)​​
currentValidators: function memoized(args)​​
palletVersion: function memoized(args)​​
sessionCandidateList: function memoized(args)​​
usersVotingInterests: function memoized(args)​​
voteDelegations: function memoized(args)
*/

/**!tx
 * addVotingInterest: function decorated(params)​
delegateVotes: function decorated(params)​
redistributeVotes: function decorated(params)​
removeCandidacy: function decorated(params)​
submitCandidacy: function decorated(params)​
tryRemoveVotesFromCandidate: function decorated(params)
 * 
 */