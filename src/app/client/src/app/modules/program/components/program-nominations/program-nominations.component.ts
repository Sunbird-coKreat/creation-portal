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
  programId = '';
  nominations = [];
  nominations_count = 0;

  inputs = {};
  outputs = {
    onApprove: (nomination) => {
      this.tosterService.success("Nomination accepted for - " + nomination.contributor_name);
    },
    onReject: (nomination) => {
      this.tosterService.warning("Nomination rejected for - " + nomination.contributor_name);
    },
  };

  constructor(private tosterService: ToasterService, private programsService: ProgramsService,
    public resourceService: ResourceService, private config: ConfigService,
    private publicDataService: PublicDataService, private activatedRoute: ActivatedRoute, private router: Router,
    private navigationHelperService: NavigationHelperService) {
      this.programId = this.activatedRoute.snapshot.params.programId;
    }

  ngOnInit() {
    this.getNominationList();
  }

  ngAfterViewInit() {
  }

  getNominationList() {
    const req = {
      url: `/program/v1/nomination/list`,
      data: {
        request: {
          program_id: this.activatedRoute.snapshot.params.programId
        }
      }
    };
    this.programsService.post(req).subscribe((data) => {
      if (data.result.length > 0) {
        this.nominations_count = data.result.length;
        _.forEach(data.result, (res) => {
          let name = res.userData.firstName;
          if (!_.isEmpty(res.userData.lastName)) {
            name = name + ' ' + res.userData.lastName;
          }
          this.nominations.push({
            'name': name,
            'program_id': res.program_id,
            'user_id': res.user_id,
            'type': res.organisation_id ? 'Organisation': 'Individual',
            'status': res.status,
            'textbook_count': res.collection_ids ? res.collection_ids.length : 0
          });
        });
      }
      this.inputs = {
        nominations: this.nominations,
        nominationsCount: this.nominations_count
      };
      console.log('getNominationList ', data, this.nominations);
    }, error => {
      this.tosterService.error('User onboarding failed');
    });
  }
}
