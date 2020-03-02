import { ResourceService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { ProgramsService, PublicDataService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-nominations',
  templateUrl: './list-nominations.component.html',
  styleUrls: ['./list-nominations.component.scss']
})
export class ListNominationsComponent implements OnInit, AfterViewInit {
	 @Input('nominations')
	 nominations: [];
	 @Output()
	 onApprove = new EventEmitter();
	 @Output()
   onReject = new EventEmitter();
   
   show = false;

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private config: ConfigService, private publicDataService: PublicDataService,
    private activatedRoute: ActivatedRoute, private router: Router, private navigationHelperService: NavigationHelperService) { }
	
  ngOnInit() {
  }

  ngAfterViewInit() {
  }
  onApproveClick(nomination) {
	this.onApprove.emit(nomination);
  }
  
  onRejectClick(nomination) {
	this.onReject.emit(nomination);
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }
}
