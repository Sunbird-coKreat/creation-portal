import { ProgramsService } from '@sunbird/core';
import { ListAllProgramsComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './components';
import { ListAllMyProgramsComponent } from './components/list-all-my-programs/list-all-my-programs.component';
import { ListNominatedTextbooksComponent} from './components/list-nominated-textbooks/list-nominated-textbooks.component';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { OrgContriAdminComponent } from './components/org-contri-admin/org-contri-admin.component';
import { ContriDashboardComponent } from './components/dashboard/dashboard.component';
const routes: Routes = [{
  path: '', component: ListAllProgramsComponent, canActivate: [ProgramsService],
  data: {
    telemetry: {
      env: 'contribute', pageid: 'programs-list', type: 'view', subtype: 'paginate'
    }
  }
},
{
  path: 'myenrollprograms', component: ListAllMyProgramsComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
},
{
  path: 'nominatedtextbooks/:programId', component: ListNominatedTextbooksComponent,
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
},
{
  path: 'orglist', component: OrgUserListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
},
{
  path: 'contriadmin', component: OrgContriAdminComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
},
{
  path: 'dashboard', component: ContriDashboardComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributeRoutingModule { }
