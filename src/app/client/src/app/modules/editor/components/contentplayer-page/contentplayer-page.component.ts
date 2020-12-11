import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentplayerPageComponent implements OnInit {
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  removeQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'removeQuestion'}});
  }

}
