import { UserService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService, NavigationHelperService } from '@sunbird/shared';
import { IImpressionEventInput} from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})
export class HelpPageComponent implements OnInit, AfterViewInit {

  public telemetryImpression: IImpressionEventInput;
  @ViewChild('video1') video1: ElementRef;
  @ViewChild('video2') video2: ElementRef;
  @ViewChild('video3') video3: ElementRef;
  @ViewChild('video4') video4: ElementRef;
  @ViewChild('video5') video5: ElementRef;
  @ViewChild('video6') video6: ElementRef;
  @ViewChild('video7') video7: ElementRef;
  constructor(public userService: UserService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
              public router: Router, private navigationHelperService: NavigationHelperService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}`
          }
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: 'vidyadaan-help-page',
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  pauseVideo() {
    this.video1.nativeElement.pause();
    this.video2.nativeElement.pause();
    this.video3.nativeElement.pause();
    this.video4.nativeElement.pause();
    this.video5.nativeElement.pause();
    this.video6.nativeElement.pause();
    this.video7.nativeElement.pause();
  }
}