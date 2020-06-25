import { ProgramsService, EnrollContributorService } from '@sunbird/core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './components';
import { ProgramListComponent } from '../shared-feature/components/program-list/program-list.component';
import { ListNominatedTextbooksComponent} from './components/list-nominated-textbooks/list-nominated-textbooks.component';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { OrgContriAdminComponent } from './components/org-contri-admin/org-contri-admin.component';
import { ContriDashboardComponent } from './components/dashboard/dashboard.component';
import { HelpPageComponent } from '../shared-feature/components/help-page/help-page.component';

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
      env: 'creation-portal', pageid: 'list-all-programs', type: 'view', subtype: 'paginate'
    }
  }
},
{
  path: 'myenrollprograms', component: ProgramListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'list-my-programs' }
  },
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'program' }
  },
},
{
  path: 'nominatedtextbooks/:programId', component: ListNominatedTextbooksComponent,
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'list-nominated-textbooks' }
  },
},
{
  path: 'orglist', component: OrgUserListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'list-org-users' }
  },
},
{
  path: 'contriadmin', component: OrgContriAdminComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'org-admin' }
  },
},
{
  path: 'dashboard', component: ContriDashboardComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'dashboard' }
  },
},
{
  path: 'help', component: HelpPageComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'help-page' }
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributeRoutingModule { }
