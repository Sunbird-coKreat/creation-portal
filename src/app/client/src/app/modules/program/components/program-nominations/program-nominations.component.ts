import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { ListNominationsComponent } from '../list-nominations/list-nominations.component';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-program-nominations',
  templateUrl: './program-nominations.component.html',
  styleUrls: ['./program-nominations.component.scss']
})
export class ProgramNominationsComponent implements OnInit {
  component = ListNominationsComponent;
  programId = '';
  nominations = [];
  showNominationsComponent = false;

  inputs = {};
  outputs = {
    approve: (nomination) => {
      this.tosterService.success('Nomination accepted for - ' + nomination.contributor_name);
    },
    reject: (nomination) => {
      this.tosterService.warning('Nomination rejected for - ' + nomination.contributor_name);
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

  getNominationList() {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.activatedRoute.snapshot.params.programId
          }
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
        nominations: this.nominations,
        nominationsCount: this.nominations.length
      };
      this.showNominationsComponent = true;
    }, error => {
      this.tosterService.error('User onboarding failed');
    });
  }
}
