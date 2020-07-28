import { NgModule } from '@angular/core';
import { ErrorPageComponent, AuthGuard } from '@sunbird/core';
import { RouterModule, Routes } from '@angular/router';
const appRoutes: Routes = [
  {
    path: 'sourcing', loadChildren: 'app/modules/program/program.module#ProgramModule'
  },
  {
    path: 'contribute', loadChildren: 'app/modules/contribute/contribute.module#ContributeModule'
  },
  {
    path: 'recover', loadChildren: 'app/modules/recover-account/recover-account.module#RecoverAccountModule'
  },
  {
    path: 'accountMerge', loadChildren: 'app/modules/merge-account/merge-account.module#MergeAccountModule'
  },
  {
    path: 'contribution-portal', loadChildren: 'app/modules/public/public.module#PublicModule'
  },
  {
    path: 'contribute/join/:orgId', loadChildren: 'app/modules/contribute/contribute.module#ContributeModule'
  },
  {
    path: '', loadChildren: 'app/modules/public/public.module#PublicModule'
  },
  {
    path: 'error', component: ErrorPageComponent
  },
  {
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
