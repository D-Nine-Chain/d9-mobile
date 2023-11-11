import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FirstRunComponent } from './first-run/first-run.component';
import { NewMnemonicComponent } from './new-mnemonic/new-mnemonic.component';
import { HomeComponent } from './home/home.component';
import { BurnMiningComponent } from './burn-mining/burn-mining/burn-mining.component';

const routes: Routes = [

   {
      path: 'first-run', component: FirstRunComponent

   },
   { path: 'new-mnemonic', component: NewMnemonicComponent },
   { path: 'home', component: HomeComponent },
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
