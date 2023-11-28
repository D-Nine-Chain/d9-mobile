import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FirstRunComponent } from './pages/first-run/first-run.component';
import { NewMnemonicComponent } from './pages/new-mnemonic/new-mnemonic.component';
import { HomeComponent } from './pages/home/home.component';
import { BurnPortfolioComponent } from './pages/burn-portfolio/burn-portfolio/burn-portfolio.component';
import { SettingsComponent } from './pages/settings/settings/settings.component';
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
import { PayMerchantComponent } from './pages/merchant-account/pay-merchant/pay-merchant/pay-merchant.component';
import { MerchantQrComponent } from './pages/merchant-account/merchant-qr/merchant-qr.component';
import { AllowanceRequestComponent } from './modals/allowance-request/allowance-request/allowance-request.component';
import { NodeVotingComponent } from './pages/nodes-management/node-voting/node-voting.component';
import { SessionOverviewComponent } from './pages/nodes-management/session-overview/session-overview/session-overview.component';
import { GreenAccountComponent } from './pages/green-account/green-account.component';
import { ConfirmationComponent } from './modals/swap/confirmation/confirmation.component';
import { NodeInfoComponent } from './pages/nodes-management/node-info/node-info.component';
import { AllowancesComponent } from './pages/allowances/allowances/allowances.component';
const routes: Routes = [
   {
      path: 'first-run', component: FirstRunComponent
   },
   { path: 'new-mnemonic', component: NewMnemonicComponent },
   { path: 'home', component: HomeComponent },
   { path: 'settings', component: SettingsComponent },
   {
      path: 'burn', component: BurnPortfolioComponent, children: [

      ]
   },
   {
      path: 'merchant-account', component: MerchantAccountComponent,
   },
   { path: 'send', component: SendComponent },
   { path: 'receive', component: ReceiveComponent },
   {
      path: 'ancestors', component: AncestorsComponent
   },
   {
      path: 'swap', component: SwapComponent
   },
   {
      path: 'qr-scanner', component: QrScannerComponent
   },
   {
      path: 'settings', component: SettingsComponent
   },
   {
      path: 'account-management', component: AccountManagementComponent
   },
   {
      path: 'nodes-management', component: NodesManagementComponent, children: [
         { path: 'node-voting', component: NodeVotingComponent },
         { path: '', component: SessionOverviewComponent },
         { path: 'node-info', component: NodeInfoComponent }
      ]
   },
   { path: 'bond', component: BondComponent },
   { path: 'liquidity', component: LiquidityComponent },
   { path: 'pay-merchant', component: PayMerchantComponent },
   { path: 'merchant-qr', component: MerchantQrComponent },
   { path: 'allowance', component: AllowanceRequestComponent },
   { path: 'swap-confirmation', component: ConfirmationComponent },
   { path: 'green-account', component: GreenAccountComponent },
   { path: 'allowances', component: AllowancesComponent },

];

@NgModule({
   imports: [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
   ],
   exports: [RouterModule]
})
export class AppRoutingModule { }
