import { ProgramsService } from '@sunbird/core';
import { ProgramListComponent } from '../shared-feature/components/program-list/program-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent, CreateProgramComponent, ProgramNominationsComponent, ListContributorTextbooksComponent,
   OrgUserListComponent, OrgReportsComponent } from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
import * as telemetryConfig from '../shared/services/config/telemetry.config.json';
import { HelpPageComponent } from '../shared-feature/components/help-page/help-page.component';
const telemetryPage = telemetryConfig.default;

const routes: Routes = [{
  path: '', component: ProgramListComponent, canActivate: [ProgramsService],
  data: {
    telemetry: {
      env: 'sourcing-portal', pageid: telemetryPage.sourcing_my_projects, type: 'list', subtype: 'paginate'
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
    telemetry: { env: 'sourcing-portal', type: 'edit', subtype: 'paginate', pageid: telemetryPage.sourcing_modify_project, mode: 'edit',
                 object: { type: 'program', ver: '1.0'} }
  }
},
{
  path: 'create-program', component: CreateProgramComponent, canActivate: [ProgramsService, AuthGuard], pathMatch: 'full',
  data: {
    roles: 'programSourcingRole',
    telemetry: { env: 'sourcing-portal', type: 'workflow', subtype: 'paginate', pageid: telemetryPage.sourcing_create_project_details,
     mode: 'create', object: { type: 'program', ver: '1.0'} }
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
    telemetry: { env: 'sourcing-portal', type: 'list', subtype: 'paginate', pageid: telemetryPage.sourcing_project_contributions }
  }
},
{
  path: 'contributor/:programId', component: ListContributorTextbooksComponent, canActivate: [ProgramsService],
  data: {
    telemetry: { env: 'sourcing-portal', type: 'detail', subtype: 'paginate', pageid: telemetryPage.sourcing_project_nomination_details }
  }
},
{
  path: 'orglist', component: OrgUserListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'sourcing-portal', type: 'list', subtype: 'paginate', pageid: telemetryPage.sourcing_manage_users }
  },
},
{
  path: 'orgreports', component: OrgReportsComponent, canActivate: [ProgramsService, AuthGuard], pathMatch: 'full',
  data: {
    roles: 'programSourcingRole',
    telemetry: { env: 'sourcing-portal', type: 'report', subtype: 'paginate', pageid: telemetryPage.sourcing_organisation_reports }
  },
},
{
  path: 'help', component: HelpPageComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'sourcing-portal', type: 'documentation', subtype: 'paginate', pageid: telemetryPage.sourcing_help  }
  },
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
