import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class EventsService {

   constructor() {
      console.log("events service started")
   }

   public watchForAccountChanges(address: string) { }
}
