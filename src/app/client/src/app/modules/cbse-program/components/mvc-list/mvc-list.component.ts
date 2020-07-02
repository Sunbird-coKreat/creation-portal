import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-mvc-list',
  templateUrl: './mvc-list.component.html',
  styleUrls: ['./mvc-list.component.scss']
})
export class MvcListComponent implements OnInit {
  @Input() contentList: any;
  @Input() selectedContentId: any;
  @Output() contentChangeEvent = new EventEmitter<any>();
  @Output() moveEvent = new EventEmitter<any>();
  public addToLibraryBtnVisibility: Boolean = false;
  public width: any;
  public height: any;

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.addToLibraryBtnVisibility = true;
  }

  // showAddToLibraryButton() {
  //   this.addToLibraryBtnVisibility = !this.addToLibraryBtnVisibility;
  // }

  onContentChange(identifier: any) {
    this.addToLibraryBtnVisibility = true;
    this.contentChangeEvent.emit({contentId: identifier});
  }

  addToLibrary() {
    this.moveEvent.emit({
      action: 'beforeMove'
    });
  }

  changeFilter() {
    this.moveEvent.emit({
      action: 'showFilter'
    });
  }

}
