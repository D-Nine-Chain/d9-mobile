import { Component, OnInit, Input } from '@angular/core';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
@Component({
   selector: 'main-menu',
   templateUrl: './menu.component.html',
   styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
   @Input() menuId: string = '';
   discoverIcon = faMagnifyingGlass;
   constructor() { }

   ngOnInit() {
      console.info("main menu is being used")
   }

   routeTo(route: string) {
      console.log("routing to", route)
   }

}
