import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash-es';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { ConfigService } from '../../services/config/config.service';
@Component({
  selector: 'lib-qumlplayer-page',
  templateUrl: './qumlplayer-page.component.html',
  styleUrls: ['./qumlplayer-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QumlplayerPageComponent implements OnChanges {
  qumlPlayerConfig: any;
  @Input() questionMetaData: any;
  @Input() questionSetHierarchy: any;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  prevQuestionId: string;
  showPlayerPreview = false;
  showPotrait = false;
  hierarchy: any;

  constructor(public telemetryService: EditorTelemetryService, public configService: ConfigService, public editorService: EditorService) { }

  ngOnChanges() {
    this.initQumlPlayer();
  }

  initQumlPlayer() {
    this.showPlayerPreview = false;
    this.questionMetaData = _.get(this.questionMetaData, 'data.metadata');
    const newQuestionId = _.get(this.questionMetaData, 'identifier');
    if (newQuestionId && this.prevQuestionId !== newQuestionId) {
      this.hierarchy = _.cloneDeep(this.questionSetHierarchy);
      this.hierarchy.children = _.filter(this.hierarchy.children, (question) => question.identifier === newQuestionId);
      this.hierarchy.childNodes = [newQuestionId];
      this.prevQuestionId = newQuestionId;
      setTimeout(() => {
        this.showPlayerPreview = true;
      }, 0);
    }
  }

  switchToPotraitMode() {
    this.showPotrait = true;
  }
  switchToLandscapeMode() {
    this.showPotrait = false;
  }
  
  removeQuestion() {
    this.toolbarEmitter.emit({button: 'removeContent'});
  }

  editQuestion() {
    this.toolbarEmitter.emit({button : 'editContent'});
  }
}
