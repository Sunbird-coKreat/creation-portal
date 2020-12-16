import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { EditorRoutingModule } from './editor-routing.module';
import { FancyTreeComponent, QuestionTemplateComponent, QuestionBaseComponent,
ContentplayerPageComponent, EditorHeaderComponent,
QuestionSetComponent, EditorBaseComponent, } from './components';
import {CbseProgramModule} from '../cbse-program';
import { OptionsComponent } from './components/options/options.component';
import { AnswerComponent } from './components/answer/answer.component';

// import { PlayerHelperModule } from '@sunbird/player-helper';

@NgModule({
  declarations: [EditorHeaderComponent, QuestionSetComponent, EditorBaseComponent, FancyTreeComponent, QuestionTemplateComponent,
    QuestionBaseComponent, ContentplayerPageComponent, OptionsComponent, AnswerComponent],
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
