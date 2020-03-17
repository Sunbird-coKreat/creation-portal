import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-org-user-list',
  templateUrl: './org-user-list.component.html',
  styleUrls: ['./org-user-list.component.scss']
})
export class OrgUserListComponent implements OnInit {
  data;
  options;
  showNormalModal;
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.data = {
      'board': [{
          'name': 'admin',
          'value': 'Admin'
      }, {
          'name': 'reviewer',
          'value': 'Reviewer'
      }]
    }
  }

}
