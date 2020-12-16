import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentplayerPageComponent implements OnInit {
  @Input() questionMetaData: any;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  removeQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'removeQuestion'}});
  }

  editQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'editQuestion'}});
  }

}
