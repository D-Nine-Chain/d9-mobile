import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FirstRunComponent } from './pages/first-run/first-run.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NewMnemonicComponent } from './pages/new-mnemonic/new-mnemonic.component';
import { HomeComponent } from './pages/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExchangeCardComponent } from './pages/home/exchange-card/exchange-card.component';
import { MenuComponent } from './menu/menu.component';
import { AssestsListComponent } from './pages/home/assets-list/assests-list/assests-list.component';
import { BurnMiningComponent } from './pages/burn-mining/burn-mining/burn-mining.component';
import { SettingsComponent } from './pages/settings/settings/settings.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
   declarations: [AppComponent, FirstRunComponent, NewMnemonicComponent, HomeComponent, ExchangeCardComponent, MenuComponent, AssestsListComponent, BurnMiningComponent, SettingsComponent],
   imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FontAwesomeModule, ReactiveFormsModule],
   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
   bootstrap: [AppComponent],
})
export class AppModule { }

