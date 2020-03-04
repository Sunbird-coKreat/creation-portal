import { IImpressionEventInput} from '@sunbird/telemetry';
import { ResourceService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { ProgramsService, PublicDataService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list-contributor-textbooks',
  templateUrl: './list-contributor-textbooks.component.html',
  styleUrls: ['./list-contributor-textbooks.component.scss']
})
export class ListContributorTextbooksComponent implements OnInit, AfterViewInit {

  public contributor;
  public contributorTextbooks;
  public noResultFound;
  public telemetryImpression: IImpressionEventInput;

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private config: ConfigService, private publicDataService: PublicDataService,
    private activatedRoute: ActivatedRoute, private router: Router, private navigationHelperService: NavigationHelperService,  private httpClient: HttpClient) { }

  ngOnInit() {
	this.contributor = {"name": "Pratham", "type": "Organisation", "nominationStatus": "Pending"};
	this.getProgramTextbooks();
  }

  getProgramTextbooks() {		
		 const option = {
		  url: 'content/composite/v1/search',
		   data: {
			request: {
				 filters: {
					objectType: "content", 
					programId: "31ab2990-7892-11e9-8a02-93c5c62c03f1",
					status: ["Draft", "Live"], 
					contentType: "Textbook", 
					framework: "NCFCOPY", 
					board:	"NCERT",
					medium:	["English"] 
				}
			}
		  }
		};
		
		this.httpClient.post<any>(option.url, option.data).subscribe(
		  (res) => this.showTexbooklist(res), 
		  (err) => console.log(err)
		);
	}
	
	showTexbooklist (res){
		this.contributorTextbooks = res.result.content;
	}
  
  ngAfterViewInit() {
    
  }
}
