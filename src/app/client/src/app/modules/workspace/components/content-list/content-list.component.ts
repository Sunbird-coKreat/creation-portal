import { Component, Input, OnInit, Output, SimpleChange, EventEmitter } from '@angular/core';
import { IPagination} from '../../../sourcing/interfaces';
import { ToasterService, ResourceService, NavigationHelperService, ConfigService, PaginationService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { UserService, RegistryService, ProgramsService } from '@sunbird/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {

  @Input() data: any;
  @Output() getContents = new EventEmitter<any>();
  list: any;
  showLoader = true;
  pager: IPagination;
  pageNumber = 1;
  pageLimit = 200;
  offset = 200;
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryPageId: string;

  constructor(private paginationService: PaginationService,
    public userService: UserService,
    public configService: ConfigService,
    private telemetryService: TelemetryService) { }

  ngOnInit(): void {
    this.telemetryInteractCdata = [{id: this.userService.channel, type: 'content_list'}];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
    this.showLoader = false;
  }

  ngOnChanges(changes: SimpleChange): void {
    if (this.data) {
      this.list = _.get(this.data, 'content');
      this.pager = this.paginationService.getPager(this.data.count, this.pageNumber, this.pageLimit);
    }
  }

  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.getContents.emit((this.pageNumber - 1) * this.pageLimit);
  }
}
