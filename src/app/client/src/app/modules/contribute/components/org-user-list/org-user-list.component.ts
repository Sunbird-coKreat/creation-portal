import { Component, OnInit } from '@angular/core';
import { ToasterService, ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-org-user-list',
  templateUrl: './org-user-list.component.html',
  styleUrls: ['./org-user-list.component.scss']
})
export class OrgUserListComponent implements OnInit {
  data;
  options;
  showNormalModal;
  private orgLink = 'https://projects.invisionapp.com/d/main/default';

  constructor(private toasterService: ToasterService, public resourceService: ResourceService) { }

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

  copyLinkToClipboard(inputLink) {
    inputLink.select();
    document.execCommand('copy');
    inputLink.setSelectionRange(0, 0);
    this.toasterService.success(this.resourceService.frmelmnts.lbl.linkCopied);
  }

}
