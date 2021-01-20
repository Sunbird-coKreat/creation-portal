import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorRoutingModule } from './editor-routing.module';
import { FancyTreeComponent, QuestionTemplateComponent, QuestionBaseComponent,
ContentplayerPageComponent, EditorHeaderComponent,
QuestionSetComponent, EditorBaseComponent, } from './components';
import {CbseProgramModule} from '../cbse-program';
import { OptionsComponent } from './components/options/options.component';
import { AnswerComponent } from './components/answer/answer.component';
@NgModule({
  declarations: [EditorHeaderComponent, QuestionSetComponent, EditorBaseComponent, FancyTreeComponent, QuestionTemplateComponent,
    QuestionBaseComponent, ContentplayerPageComponent, OptionsComponent, AnswerComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    CbseProgramModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class EditorModule { }
