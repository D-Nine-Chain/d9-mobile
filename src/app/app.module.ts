import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FirstRunComponent } from './first-run/first-run.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NewMnemonicComponent } from './new-mnemonic/new-mnemonic.component';
import { HomeComponent } from './home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExchangeCardComponent } from './home/exchange-card/exchange-card.component';
import { MenuComponent } from './menu/menu.component';
import { AssestsListComponent } from './home/assets-list/assests-list/assests-list.component';
@NgModule({
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
   declarations: [AppComponent, FirstRunComponent, NewMnemonicComponent, HomeComponent, ExchangeCardComponent, MenuComponent, AssestsListComponent],
   imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FontAwesomeModule],
   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
   bootstrap: [AppComponent],
})
export class AppModule { }

