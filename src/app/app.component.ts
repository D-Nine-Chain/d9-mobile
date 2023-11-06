import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { register } from 'swiper/element/bundle';

register();


// import Swiper and modules styles


@Component({
   selector: 'app-root',
   templateUrl: 'app.component.html',
   styleUrls: ['app.component.scss'],
})
export class AppComponent {

   constructor(private _router: Router) {
      Preferences.get({ key: 'firstLoad' }).then(({ value }) => {
         console.log('firstLoad', value);
         if (value === null) {
            console.log("the value is null")
            // this._router.navigate(['/first-run']);
            this._router.navigate(['/new-mnemonic']);
         } else {
            this._router.navigate(['/home']);
         }
      });

      //todo ionic error handling
   }
}
