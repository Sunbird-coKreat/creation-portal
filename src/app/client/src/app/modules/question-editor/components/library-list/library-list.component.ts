import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
import { EditorService } from '../../services/editor/editor.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';

@Component({
  selector: 'lib-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LibraryListComponent implements OnInit {
@Input() contentList;
@Input() showAddedContent: any;
@Output() contentChangeEvent = new EventEmitter<any>();
@Output() moveEvent = new EventEmitter<any>();
@Input() selectedContent: any;
public sortContent = false;
  constructor(public editorService: EditorService, public telemetryService: EditorTelemetryService,
              public configService: ConfigService ) { }

  ngOnInit() {
  }

  onContentChange(selectedContent: any) {
    this.contentChangeEvent.emit({content: selectedContent});
  }

  changeFilter() {
    this.moveEvent.emit({
      action: 'showFilter'
    });
  }

  onShowAddedContentChange() {
   this.moveEvent.emit({
    action: 'showAddedContent',
    status: this.showAddedContent
  });
  }
  sortContentList() {
    this.sortContent = !this.sortContent;
    this.moveEvent.emit({
      action: 'sortContentList',
      status: this.sortContent
    });
  }
  addToLibrary() {
    if (this.editorService.checkIfContentsCanbeAdded()) {
      this.moveEvent.emit({
        action: 'openHierarchyPopup'
      });
    }
  }

}
