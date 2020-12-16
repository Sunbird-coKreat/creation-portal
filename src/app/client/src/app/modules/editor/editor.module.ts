import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { EditorRoutingModule } from './editor-routing.module';
import { FancyTreeComponent, QuestionTemplateComponent, QuestionBaseComponent,
ContentplayerPageComponent, EditorHeaderComponent, ReferenceQuestionComponent, MultiplechoiceQuestionComponent,
QuestionSetComponent, EditorBaseComponent, } from './components';
import {CbseProgramModule} from '../cbse-program';

// import { PlayerHelperModule } from '@sunbird/player-helper';

@NgModule({
  declarations: [EditorHeaderComponent, ReferenceQuestionComponent,
    MultiplechoiceQuestionComponent, QuestionSetComponent, EditorBaseComponent, FancyTreeComponent, QuestionTemplateComponent, 
    QuestionBaseComponent, ContentplayerPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    SuiModule,
    ReactiveFormsModule,
    EditorRoutingModule,
    SharedModule,
    // PlayerHelperModule
    CbseProgramModule
  ]
})
export class EditorModule { }
