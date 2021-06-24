import { NgModule } from '@angular/core';
import { ErrorPageComponent, AuthGuard } from '@sunbird/core';
import { RouterModule, Routes } from '@angular/router';
const appRoutes: Routes = [
  {
    path: 'resources', loadChildren: () => import('app/modules/resource/resource.module').then(m => m.ResourceModule)
  },
  {
    path: 'search', loadChildren: () => import('app/modules/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'sourcing', loadChildren: () => import('app/modules/program/program.module').then(m => m.ProgramModule)
  },
  {
    path: 'contribute', loadChildren: () => import('app/modules/contribute/contribute.module').then(m => m.ContributeModule)
  },
  {
    path: 'dashBoard', loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'profile', loadChildren: () => import('app/plugins/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'certs', loadChildren: () => import('app/modules/certificate/certificate.module').then(m => m.CertificateModule)
  },
  {
    path: 'recover', loadChildren: () => import('app/modules/recover-account/recover-account.module').then(m => m.RecoverAccountModule)
  },
  {
    path: 'accountMerge', loadChildren: () => import('app/modules/merge-account/merge-account.module').then(m => m.MergeAccountModule)
  },
  {
    path: 'contribution-portal', loadChildren: () => import('app/modules/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'contribute/join/:orgId', loadChildren: () => import('app/modules/contribute/contribute.module').then(m => m.ContributeModule)
  },
  {
    path: '', loadChildren: () => import('app/modules/public/public.module').then(m => m.PublicModule)
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
