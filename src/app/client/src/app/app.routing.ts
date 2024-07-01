import { NgModule } from '@angular/core';
import { ErrorPageComponent, AuthGuard } from '@sunbird/core';
import { RouterModule, Routes } from '@angular/router';
const appRoutes: Routes = [
  {
    path: 'sourcing', loadChildren: () => import('./modules/program/program.module').then(m => m.ProgramModule)
  },
  {
    path: 'contribute', loadChildren: () => import('./modules/contribute/contribute.module').then(m => m.ContributeModule)
  },
  {
    path: 'dashBoard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'profile', loadChildren: () => import('./plugins/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'recover', loadChildren: () => import('./modules/recover-account/recover-account.module').then(m => m.RecoverAccountModule)
  },
  {
    path: 'contribution-portal', loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'contribute/join/:orgId', loadChildren: () => import('./modules/contribute/contribute.module').then(m => m.ContributeModule)
  },
  {
    path: '', loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'error', component: ErrorPageComponent
  },
  {
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
