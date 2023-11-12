import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FirstRunComponent } from './pages/first-run/first-run.component';
import { NewMnemonicComponent } from './pages/new-mnemonic/new-mnemonic.component';
import { HomeComponent } from './pages/home/home.component';
import { BurnMiningComponent } from './pages/burn-mining/burn-mining/burn-mining.component';
import { SettingsComponent } from './pages/settings/settings/settings.component';

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
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
   ],
   exports: [RouterModule]
})
export class AppRoutingModule { }
