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
  showNominationsComponent = false;

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
        _.forEach(data.result, (res) => {
          let name = res.userData.firstName;
          if (!_.isEmpty(res.userData.lastName)) {
            name = name + ' ' + res.userData.lastName;
          }
          this.nominations.push({
            'name': name,
            'type': res.organisation_id ? 'Organisation' : 'Individual',
            'nominationData': res
          });
        });
      }
      this.inputs = {
        nominations: this.nominations
      };
      this.showNominationsComponent = true;
    }, error => {
      this.tosterService.error('User onboarding failed');
    });
  }
}
