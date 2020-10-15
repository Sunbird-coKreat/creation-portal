import { ProgramsService } from '@sunbird/core';
import { ProgramListComponent } from '../shared-feature/components/program-list/program-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent, CreateProgramComponent, ProgramNominationsComponent, ListContributorTextbooksComponent,
   OrgUserListComponent, OrgReportsComponent } from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
import * as telemetryLabels from '../shared/services/config/telemetry-label.config.json';
import { HelpPageComponent } from '../shared-feature/components/help-page/help-page.component';
const telemetryPage = telemetryLabels.default;

const routes: Routes = [{
  path: '', component: ProgramListComponent, canActivate: [ProgramsService],
  data: {
    telemetry: {
      env: 'sourcing-portal', pageid: telemetryPage.pageId.sourcing.myProjects, type: telemetryPage.pageType.list,
      subtype: telemetryPage.pageSubtype.paginate
    }
  }
},
{
  path: 'join/:orgId', component: ProgramListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: telemetryPage.pageType.view, subtype: telemetryPage.pageSubtype.paginate }
  },
},
{
  path: 'edit/:programId', component: CreateProgramComponent, canActivate: [ProgramsService, AuthGuard], pathMatch: 'full',
  data: {
    roles: 'programSourcingRole',
    telemetry: { env: 'sourcing-portal', type: telemetryPage.pageType.edit, subtype: telemetryPage.pageSubtype.paginate,
    pageid: telemetryPage.pageId.sourcing.modifyProject, mode: telemetryPage.pageMode.edit, object: { type: 'program', ver: '1.0'} }
  }
},
{
  path: 'create-program', component: CreateProgramComponent, canActivate: [ProgramsService, AuthGuard], pathMatch: 'full',
  data: {
    roles: 'programSourcingRole',
    telemetry: { env: 'sourcing-portal', type: telemetryPage.pageType.workflow, subtype: telemetryPage.pageSubtype.paginate,
    pageid: telemetryPage.pageId.sourcing.createProjectDetails, mode: telemetryPage.pageMode.create, object: { type: 'program', ver: '1.0'} }
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
    telemetry: { env: 'sourcing-portal', type: telemetryPage.pageType.list, subtype: telemetryPage.pageSubtype.paginate,
    pageid: telemetryPage.pageId.sourcing.projectContributions }
  }
},
{
  path: 'contributor/:programId', component: ListContributorTextbooksComponent, canActivate: [ProgramsService],
  data: {
    telemetry: { env: 'sourcing-portal', type: telemetryPage.pageType.detail, subtype: telemetryPage.pageSubtype.paginate,
     pageid: telemetryPage.pageId.sourcing.projectNominationDetails }
  }
},
{
  path: 'orglist', component: OrgUserListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'sourcing-portal', type: telemetryPage.pageType.list, subtype: telemetryPage.pageSubtype.paginate,
    pageid: telemetryPage.pageId.sourcing.manageUsers }
  },
},
{
  path: 'orgreports', component: OrgReportsComponent, canActivate: [ProgramsService, AuthGuard], pathMatch: 'full',
  data: {
    roles: 'programSourcingRole',
    telemetry: { env: 'sourcing-portal', type: telemetryPage.pageType.report, subtype: telemetryPage.pageSubtype.paginate,
    pageid: telemetryPage.pageId.sourcing.organisationReports }
  },
},
{
  path: 'help', component: HelpPageComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'sourcing-portal', type: telemetryPage.pageType.documentation, subtype: telemetryPage.pageSubtype.paginate,
    pageid: telemetryPage.pageId.sourcing.help  }
  },
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
