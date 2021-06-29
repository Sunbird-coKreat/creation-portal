import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';


@Component({
  selector: 'app-my-content',
  templateUrl: './my-content.component.html',
  styleUrls: ['./my-content.component.scss']
})
export class MyContentComponent implements OnInit {

  constructor(public resourceService: ResourceService) { }

  ngOnInit(): void {
  }

}
