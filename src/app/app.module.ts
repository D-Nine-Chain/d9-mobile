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
import { BurnPortfolioComponent } from './pages/burn-portfolio/burn-portfolio/burn-portfolio.component';
import { SettingsComponent } from './pages/settings/settings/settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MerchantAccountComponent } from './pages/merchant-account/merchant-account/merchant-account.component';
import { SendComponent } from './pages/send/send/send.component';
import { ReceiveComponent } from './pages/receive/receive/receive.component';
import { AncestorsComponent } from './pages/ancestors/ancestors/ancestors.component';
import { SwapComponent } from './pages/swap/swap/swap.component';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner/qr-scanner.component';
import { AccountManagementComponent } from './pages/account-management/account-management/account-management.component';
import { NodesManagementComponent } from './pages/nodes-management/nodes-management/nodes-management.component';
import { BondComponent } from './pages/bond/bond/bond.component';
import { LiquidityComponent } from './pages/liquidity/liquidity/liquidity.component';
import { CountdownModule } from 'ngx-countdown';
import { PayMerchantComponent } from './pages/merchant-account/pay-merchant/pay-merchant/pay-merchant.component';
import { MerchantQrComponent } from './pages/merchant-account/merchant-qr/merchant-qr.component';
import { AllowanceRequestComponent } from './modals/allowance-request/allowance-request/allowance-request.component';
import { NodeVotingComponent } from './pages/nodes-management/node-voting/node-voting.component';
import { SessionOverviewComponent } from './pages/nodes-management/session-overview/session-overview/session-overview.component';
import { NodeInfoComponent } from './pages/nodes-management/node-info/node-info.component';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { GreenAccountComponent } from './pages/green-account/green-account.component';
import { ConfirmationComponent } from './modals/swap/confirmation/confirmation.component';
import { AllowancesComponent } from './pages/allowances/allowances/allowances.component';
import { ErrorComponent } from './pages/error/error/error.component';
import { VotingComponent } from './pages/voting/voting/voting.component';

@NgModule({
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
   declarations: [AppComponent, FirstRunComponent, NewMnemonicComponent, HomeComponent, ExchangeCardComponent, MenuComponent, AssestsListComponent, BurnPortfolioComponent, SettingsComponent, MerchantAccountComponent, SendComponent, ReceiveComponent, AncestorsComponent, SwapComponent, QrScannerComponent, AccountManagementComponent, NodesManagementComponent, BondComponent, LiquidityComponent, PayMerchantComponent, MerchantQrComponent, AllowanceRequestComponent, NodeVotingComponent, SessionOverviewComponent, NodeInfoComponent, NumberFormatPipe, GreenAccountComponent, ConfirmationComponent, AllowancesComponent, ErrorComponent, VotingComponent],
   imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FontAwesomeModule, ReactiveFormsModule, SweetAlert2Module.forRoot(), CountdownModule],
   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
   bootstrap: [AppComponent],
})
export class AppModule { }

