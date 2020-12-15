import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorBaseComponent, QuestionBaseComponent, NewQuestionBaseComponent } from './components';


const routes: Routes = [
  {
    path: 'collection/:collectionId/:type', component: EditorBaseComponent, pathMatch: 'full',
    data: {
      hideHeaderNFooter: 'true'
    },
  },
  {
    path: 'questionSet/:questionSetId', component: EditorBaseComponent, pathMatch: 'full',
    data: {
      hideHeaderNFooter: 'true'
    },
  },
  {
    path: 'questionSet/:questionSetId/question', component: NewQuestionBaseComponent, pathMatch: 'full',
    data: {
      hideHeaderNFooter: 'true'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
