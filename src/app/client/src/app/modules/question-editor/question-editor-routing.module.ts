import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionComponent } from './components';

const routes: Routes = [
  {
    path: ':uuid', component: QuestionComponent,
    data: {
      telemetry: {
        env: 'certs', pageid: 'certificate-details', type: 'view'
      }
    }
  }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class QuestionEditorRoutingModule { }
