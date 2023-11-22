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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MerchantMiningComponent } from './pages/merchant-mining/merchant-mining/merchant-mining.component';
import { SendComponent } from './pages/send/send/send.component';
import { ReceiveComponent } from './pages/receive/receive/receive.component';
import { AncestorsComponent } from './pages/ancestors/ancestors/ancestors.component';
import { SwapComponent } from './pages/swap/swap/swap.component';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner/qr-scanner.component';
import { AccountManagementComponent } from './pages/account-management/account-management/account-management.component';
import { NodesComponent } from './pages/nodes/nodes/nodes.component';
import { BondComponent } from './pages/bond/bond/bond.component';
import { LiquidityComponent } from './pages/liquidity/liquidity/liquidity.component';
import { CountdownModule } from 'ngx-countdown';
import { PayMerchantComponent } from './pages/merchant-mining/pay-merchant/pay-merchant/pay-merchant.component';
import { MerchantQrComponent } from './pages/merchant-mining/merchant-qr/merchant-qr.component';
import { AllowanceRequestComponent } from './modals/allowance-request/allowance-request/allowance-request.component';
@NgModule({
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
   declarations: [AppComponent, FirstRunComponent, NewMnemonicComponent, HomeComponent, ExchangeCardComponent, MenuComponent, AssestsListComponent, BurnMiningComponent, SettingsComponent, MerchantMiningComponent, SendComponent, ReceiveComponent, AncestorsComponent, SwapComponent, QrScannerComponent, AccountManagementComponent, NodesComponent, BondComponent, LiquidityComponent, PayMerchantComponent, MerchantQrComponent, AllowanceRequestComponent],
   imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FontAwesomeModule, ReactiveFormsModule, SweetAlert2Module.forRoot(), CountdownModule],
   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
   bootstrap: [AppComponent],
})
export class AppModule { }

