import { ProgramsService, EnrollContributorService } from '@sunbird/core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './components';
import { ProgramListComponent } from '../shared-feature/components/program-list/program-list.component';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { HelpPageComponent } from '../shared-feature/components/help-page/help-page.component';
import { MyContentComponent } from './components/my-content/my-content.component';

const routes: Routes = [
{
  path: 'join/:orgId', component: ProgramListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
},
{
  path: '', component: ProgramListComponent, canActivate: [ProgramsService],
  data: {
    telemetry: {
      env: 'creation-portal', pageid: 'list-all-programs', type: 'list', subtype: 'paginate'
    }
  }
},
{
  path: 'myenrollprograms', component: ProgramListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'list', subtype: 'paginate', pageid: 'list-my-programs' }
  },
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'program' }
  },
},
{
  path: 'orglist', component: OrgUserListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'list-org-users' }
  },
},
{
  path: 'help', component: HelpPageComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'help-page' }
  },
},
{
  path: 'mycontent', component: MyContentComponent, pathMatch: 'full',
  // data: {
  //   telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'mycontent' }
  // },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributeRoutingModule { }
