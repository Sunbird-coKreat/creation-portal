import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';

@Component({
  selector: 'app-mvc-list',
  templateUrl: './mvc-list.component.html',
  styleUrls: ['./mvc-list.component.scss']
})
export class MvcListComponent implements OnInit {
  @Input() sessionContext: any;
  @Input() showAddedContent: Boolean;
  @Input() contentList: any;
  @Input() selectedContentId: any;
  @Output() contentChangeEvent = new EventEmitter<any>();
  @Output() moveEvent = new EventEmitter<any>();
  public width: any;
  public height: any;

  constructor(public resourceService: ResourceService, public programTelemetryService: ProgramTelemetryService) { }

  ngOnInit() {}

  onContentChange(selectedContent: any) {
    this.contentChangeEvent.emit({content: selectedContent});
  }

  addToLibrary() {
    this.moveEvent.emit({
      action: 'beforeMove'
    });
  }

  changeFilter() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.moveEvent.emit({
      action: 'showFilter'
    });
  }

}
