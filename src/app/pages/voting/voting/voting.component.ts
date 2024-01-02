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
      /**
       * get a user's voting power
       */
      this.voting.getVotingInterest().subscribe((interest) => {
         console.log("voting interest", interest)
      })

      this.voting.getCandidates().subscribe((candidates) => {
         console.log("candidates ", candidates)
      })
   }
   /**
    * add voting power to user's account
    */
   addVote() {
      this.voting.addVotingInterest(500)
   }
   /**
    * vote for a node
    */
   delegateVotes() {
      const voteDelegation = {
         candidate: "ytBPqMwQPfbs9ugGHadMUjQk6VBRNWe9cRBtqPSX4eEdQR8", votes: 100
      }
      this.voting.delegateVotes([voteDelegation])
   }

   redistributeVotes() {
      this.voting.redistributeVotes("ytBPqMwQPfbs9ugGHadMUjQk6VBRNWe9cRBtqPSX4eEdQR8", "xK27mBoGffhi9RAqMcgc8pSeFUHxq7JenGrqUFmT5izrYLj")
   }

   removeVotes() {
      this.voting.removeVotesFromCandidate("xK27mBoGffhi9RAqMcgc8pSeFUHxq7JenGrqUFmT5izrYLj", 50)
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