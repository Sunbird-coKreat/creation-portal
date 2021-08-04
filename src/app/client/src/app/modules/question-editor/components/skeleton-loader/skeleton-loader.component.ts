import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {

  @Input() height: string;
  @Input() width: string;
  @Input() mTop: string;
  skeletonStyles: object;
  constructor() { }

  ngOnInit() {
    this.skeletonStyles = {
      height : this.height ? this.height : '8px',
      width : this.width ? this.width : '100%',
      'margin-top' : this.mTop ? this.mTop : '0'
    };
  }

}
