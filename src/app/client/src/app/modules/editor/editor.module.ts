import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { CollectionTreeComponent,  FancyTreeComponent } from './components';
import { EditorHeaderComponent } from './components/editor-header/editor-header.component';
import { ReferenceQuestionComponent } from './components/reference-question/reference-question.component';
import { MultiplechoiceQuestionComponent } from './components/multiplechoice-question/multiplechoice-question.component';
import { QuestionSetComponent } from './components/question-set/question-set.component';
import { EditorBaseComponent } from './components/editor-base/editor-base.component';
import {CbseProgramModule} from '../cbse-program';

// import { PlayerHelperModule } from '@sunbird/player-helper';

@NgModule({
  declarations: [CollectionTreeComponent, EditorHeaderComponent, ReferenceQuestionComponent,
    MultiplechoiceQuestionComponent, QuestionSetComponent, EditorBaseComponent, FancyTreeComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    // PlayerHelperModule
    CbseProgramModule
  ]
})
export class EditorModule { }
