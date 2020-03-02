import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ListNominationsComponent } from '../list-nominations/list-nominations.component';

import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-program-nominations',
  templateUrl: './program-nominations.component.html',
  styleUrls: ['./program-nominations.component.scss']
})
export class ProgramNominationsComponent implements OnInit, AfterViewInit {
  component = ListNominationsComponent;
  nominations = [{"contributor_id":"1234", "contributor_name": "Nitesh Kesarkar", "type": "Organisation", "textbooks": "Textbook1, Textbook2, Textbook3", "status": "Pending", "program_id":"ab9ba380-579c-11ea-b095-0583a8dc4a3e"}, {"contributor_id":"1245", "contributor_name": "Nilesh Sanap", "type": "Individual", "program_id":"ab9ba380-579c-11ea-b095-0583a8dc4a3e", "status": "Approved", "textbooks": "Textbook2"}, {"contributor_id":"hhd_898", "contributor_name": "Vaishali K", "type": "Individual", "program_id":"ab9ba380-579c-11ea-b095-0583a8dc4a3e", "status": "Rejected", "textbooks": "Textbook1, Textbook3"}];

  inputs = {
    nominations: this.nominations,
  };
  outputs = {
    onApprove: (nomination) => {
      this.tosterService.success("Nomination accepted for - " + nomination.contributor_name);
    },
    onReject: (nomination) => {
      this.tosterService.warning("Nomination rejected for - " + nomination.contributor_name);
    },
  };

  constructor(private tosterService: ToasterService, private programsService: ProgramsService, public resourceService: ResourceService,
    private config: ConfigService, private publicDataService: PublicDataService,
    private activatedRoute: ActivatedRoute, private router: Router, private navigationHelperService: NavigationHelperService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
}
