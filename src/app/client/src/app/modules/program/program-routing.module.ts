import { ProgramsService } from '@sunbird/core';
import { ProgramListComponent } from '../shared-feature/components/program-list/program-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent, CreateProgramComponent, ProgramNominationsComponent, ListContributorTextbooksComponent,
   OrgUserListComponent, OrgReportsComponent } from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';

import { HelpPageComponent } from '../shared-feature/components/help-page/help-page.component';

const routes: Routes = [{
  path: '', component: ProgramListComponent, canActivate: [ProgramsService],
  data: {
    telemetry: {
      env: 'sourcing-portal', pageid: 'programs-list', type: 'view', subtype: 'paginate'
    }
  }
},
{
  path: 'join/:orgId', component: ProgramListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
},
{
  path: 'edit/:programId', component: CreateProgramComponent, canActivate: [ProgramsService, AuthGuard], pathMatch: 'full',
  data: {
    roles: 'programSourcingRole',
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'create-program', mode: 'edit',
                 object: { type: 'program', ver: '1.0'} }
  }
},
{
  path: 'create-program', component: CreateProgramComponent, canActivate: [ProgramsService, AuthGuard], pathMatch: 'full',
  data: {
    roles: 'programSourcingRole',
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'create-program', mode: 'create',
                 object: { type: 'program', ver: '1.0'} }
  }
},
{
  path: 'program/:programId', component: ProgramComponent, canActivate: [ProgramsService, AuthGuard],
  data: {
    roles: 'programSourcingRole',
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'program-details' }
  }
},
{
  path: 'nominations/:programId', component: ProgramNominationsComponent, canActivate: [ProgramsService],
  data: {
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'nomination-details' }
  }
},
{
  path: 'contributor/:programId', component: ListContributorTextbooksComponent, canActivate: [ProgramsService],
  data: {
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'contributor-details' }
  }
},
{
  path: 'orglist', component: OrgUserListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'list-org-users' }
  },
},
{
  path: 'orgreports', component: OrgReportsComponent,canActivate: [ProgramsService, AuthGuard], pathMatch: 'full',
  data: {
    roles: 'programSourcingRole',
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'list-org-reports' }
  },
},
{
  path: 'help', component: HelpPageComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'help-page' }
  },
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
