import { Component, OnInit} from '@angular/core';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { PublicDataService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';

@Component({
  selector: 'app-mvc-library',
  templateUrl: './mvc-library.component.html',
  styleUrls: ['./mvc-library.component.scss']
})
export class MvcLibraryComponent implements OnInit {

  public selectedContent: string;
  constructor(
    private programStageService: ProgramStageService, public programTelemetryService: ProgramTelemetryService,
    private publicDataService: PublicDataService, private configService: ConfigService
  ) { }

  ngOnInit() {
    this.selectedContent = 'do_1130454074902364161152';
    this.fetchContentList();
  }

  fetchContentList() {
    const option = {
      url: this.configService.urlConFig.URLS.DOCKCONTENT_MVC.SEARCH,
      data: {
        request: {
          'filters': {
                'contentType': 'TextBook',
                'medium': [
                    'Telegu'
                ],
                'status': [
                    'live'
                ]
            }
        }
      }
    };
    this.publicDataService.post(option).subscribe((response: any) => {
      console.log(response);
    });
  }

  handleBack() {
    this.programStageService.removeLastStage();
  }

}
