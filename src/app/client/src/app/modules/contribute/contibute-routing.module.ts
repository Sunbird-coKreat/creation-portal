import { ProgramsService, EnrollContributorService } from '@sunbird/core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent, MyContentComponent } from './components';
import { ProgramListComponent } from '../shared-feature/components/program-list/program-list.component';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { HelpPageComponent } from '../shared-feature/components/help-page/help-page.component';
import * as telemetryLabels from '../shared/services/config/telemetry-label.config.json';
const telemetryPage = telemetryLabels.default;

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
      env: 'creation-portal', pageid: telemetryPage.pageId.contribute.allProjects, type: telemetryPage.pageType.list,
      subtype: telemetryPage.pageSubtype.paginate
    }
  }
},
{
  path: 'myenrollprograms', component: ProgramListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', pageid: telemetryPage.pageId.contribute.adminMyProjects, type: telemetryPage.pageType.list,
    subtype: telemetryPage.pageSubtype.paginate}
  },
},
{
  path: 'mycontent', component: MyContentComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', pageid: telemetryPage.pageId.contribute.adminMyProjects, type: telemetryPage.pageType.list,
    subtype: telemetryPage.pageSubtype.paginate}
  },
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'creation-portal', pageid: telemetryPage.pageId.contribute.projectContributions, type: telemetryPage.pageType.list,
    subtype: telemetryPage.pageSubtype.paginate}
  },
},
{
  path: 'orglist', component: OrgUserListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', pageid: telemetryPage.pageId.contribute.manageUsers, type: telemetryPage.pageType.list,
    subtype: telemetryPage.pageSubtype.paginate }
  },
},
{
  path: 'help', component: HelpPageComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', pageid: telemetryPage.pageId.contribute.help, type: telemetryPage.pageType.documentation,
    subtype: telemetryPage.pageSubtype.paginate }
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributeRoutingModule { }
