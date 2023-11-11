import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { MenuController } from '@ionic/angular';
@Component({
   selector: 'main-menu',
   templateUrl: './menu.component.html',
   styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
   @Input() menuId: string = '';
   discoverIcon = faMagnifyingGlass;
   constructor(private router: Router, private menuController: MenuController) {

   }
   navigateTo(route: string) {
      this.router.navigate([`/${route}`])
      this.menuController.toggle(this.menuId)

   }
   ngOnInit() {
      console.info("main menu is being used")
   }

   routeTo(route: string) {
      console.log("routing to", route)
   }

}
