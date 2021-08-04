import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';

@Component({
  selector: 'lib-collection-icon',
  templateUrl: './collection-icon.component.html',
  styleUrls: ['./collection-icon.component.scss']
})
export class CollectionIconComponent implements OnInit {
  @Input() appIcon;
  @Input() appIconConfig;
  @Output() iconEmitter = new EventEmitter<any>();
  public showImagePicker = false;

  constructor(public configService: ConfigService) { }

  ngOnInit() {
  }

  initializeImagePicker() {
    if (this.appIconConfig.isAppIconEditable) {
      this.showImagePicker = true;
    } else {
      this.showImagePicker = false;
    }
  }

  collectionIconHandler(event) {
   this.iconEmitter.emit(event);
   this.appIcon = event.url;
   this.showImagePicker = false;
  }

  handleModalDismiss(event) {
    this.showImagePicker = false;
  }

}
