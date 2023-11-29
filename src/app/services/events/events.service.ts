import { Injectable } from '@angular/core';
import { D9ApiService } from '../d9-api/d9-api.service';
import { map, switchMap, tap } from 'rxjs';
import { Abi } from '@polkadot/api-contract';
@Injectable({
   providedIn: 'root'
})
export class EventsService {

   constructor(private d9: D9ApiService) {
      console.log("events service started")
      // this.getEvents().subscribe((events) => console.log(`events are`, events))
   }

   // private getEvents() {
   //    return this.d9.getApiObservable()
   //       .pipe(
   //          switchMap(api => api.query.system.events()
   //             .pipe(
   //                map((events) => { return { api, events } }),
   //                tap(({ api, events }) => this.checkContractEvents(api, events)),
   //             )
   //          ),

   //       )
   // }

   // private checkContractEvents(api: any, events: any) {
   //    console.log("Checking contract events");

   //    // Assuming you have the contract ABI and address
   //    const contractAbi = /* Your Contract ABI */;
   //    const contractAddress = '5F...'; // Your Contract Address

   //    events.forEach((record: { event: any; }) => {
   //       const { event } = record;

   //       // Filter for ContractEmitted events
   //       if (event.section === 'contracts' && event.method === 'ContractEmitted') {
   //          const [emittedContractAddress, data] = event.data;

   //          // Check if the event is from the contract you are interested in
   //          if (emittedContractAddress.toString() === contractAddress) {
   //             // Decode the event data using the contract ABI
   //             const decodedData = new ContractPromise(api, contractAbi, emittedContractAddress).abi.decodeEvent(data);

   //             console.log("Contract emitted event:", decodedData);
   //          }
   //       }
   //    });
   // }

}

export interface D9Event {
   pallet: string;
   method: string;
   data: any;
}