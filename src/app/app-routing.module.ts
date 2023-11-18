import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FirstRunComponent } from './pages/first-run/first-run.component';
import { NewMnemonicComponent } from './pages/new-mnemonic/new-mnemonic.component';
import { HomeComponent } from './pages/home/home.component';
import { BurnMiningComponent } from './pages/burn-mining/burn-mining/burn-mining.component';
import { SettingsComponent } from './pages/settings/settings/settings.component';
import { MerchantMiningComponent } from './pages/merchant-mining/merchant-mining/merchant-mining.component';
import { SendComponent } from './pages/send/send/send.component';
import { ReceiveComponent } from './pages/receive/receive/receive.component';
import { AncestorsComponent } from './pages/ancestors/ancestors/ancestors.component';
import { SwapComponent } from './pages/swap/swap/swap.component';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner/qr-scanner.component';
import { AccountManagementComponent } from './pages/account-management/account-management/account-management.component';

const routes: Routes = [

   {
      path: 'first-run', component: FirstRunComponent

   },
   { path: 'new-mnemonic', component: NewMnemonicComponent },
   { path: 'home', component: HomeComponent },
   { path: 'settings', component: SettingsComponent },
   {
      path: 'burn-mining', component: BurnMiningComponent, children: [

      ]
   },
   {
      path: 'merchant-mining', component: MerchantMiningComponent
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
   }
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
   ],
   exports: [RouterModule]
})
export class AppRoutingModule { }
