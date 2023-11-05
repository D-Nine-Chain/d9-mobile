import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FirstRunComponent } from './first-run/first-run.component';

const routes: Routes = [
   {
      path: '',
      redirectTo: 'folder/Inbox',
      pathMatch: 'full'
   },
   {
      path: 'folder/:id',
      loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
   },
   {
      path: 'first-run', component: FirstRunComponent

   }
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
   ],
   exports: [RouterModule]
})
export class AppRoutingModule { }
