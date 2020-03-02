import { ProgramsService } from '@sunbird/core';
import { ListAllProgramsComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './components';
import { EnrollContributorComponent } from './components/enroll-contributor/enroll-contributor.component';
import { ListAllMyProgramsComponent } from './components/list-all-my-programs/list-all-my-programs.component';
const routes: Routes = [{
  path: '', component: ListAllProgramsComponent, canActivate: [ProgramsService],
  data: {
    telemetry: {
      env: 'contribute', pageid: 'programs-list', type: 'view', subtype: 'paginate'
    }
  }
},
{
  path: 'enrollprograms', component: EnrollContributorComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  }, 
},
{
  path: 'myenrollprograms', component: ListAllMyProgramsComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  }, 
},
{
  path: 'myprogram/:programId', component: ProgramComponent, pathMatch: 'full',
    data: {
      telemetry: { env: 'myprograms', type: 'view', subtype: 'paginate' }
    },
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributeRoutingModule { }
