import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components';
import { LandingpageGuard } from './services';

const routes: Routes = [
  {
    path: '', component: LandingPageComponent, canActivate: [LandingpageGuard],
    data: { telemetry: { env: 'public', pageid: 'landing-page', type: 'edit', subtype: 'paginate' } }
  },
  // {
  //   path: 'explore', loadChildren: () => import('./module/explore/explore.module').then(m => m.ExploreModule)
  // },
  // {
  //   path: ':slug/explore', loadChildren: () => import('./module/explore/explore.module').then(m => m.ExploreModule)
  // },
  {
    path: ':slug/signup', loadChildren: () => import('./module/signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'signup', loadChildren: () => import('./module/signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: ':slug/sign-in/sso', loadChildren: () => import('./module/sign-in/sso/sso.module').then(m => m.SsoModule)
  },
  {
    path: 'sign-in/sso', loadChildren: () => import('./module/sign-in/sso/sso.module').then(m => m.SsoModule)
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
