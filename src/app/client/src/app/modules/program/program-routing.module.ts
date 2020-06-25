import { ProgramsService } from '@sunbird/core';
import { ProgramListComponent } from '../shared-feature/components/program-list/program-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent, CreateProgramComponent, ProgramNominationsComponent, ListContributorTextbooksComponent,
  EditProgramComponent } from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
import { HelpPageComponent } from '../shared-feature/components/help-page/help-page.component';

const routes: Routes = [{
  path: '', component: ProgramListComponent, canActivate: [ProgramsService, AuthGuard],
  data: {
    roles: 'programSourcingRole',
    telemetry: {
      env: 'sourcing-portal', pageid: 'programs-list', type: 'view', subtype: 'paginate'
    }
  }
},
{
  path: 'create-program/:programId', component: CreateProgramComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'create-program', mode: 'edit',
                 object: { type: 'program', ver: '1.0'} }
  }
},
{
  path: 'create-program', component: CreateProgramComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'create-program', mode: 'create',
                 object: { type: 'program', ver: '1.0'} }
  }
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'program-details' }
  }
},
{
  path: 'nominations/:programId', component: ProgramNominationsComponent,
  data: {
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'nomination-details' }
  }
},
{
  path: 'contributor/:programId', component: ListContributorTextbooksComponent,
  data: {
    telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'contributor-details' }
  }
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
