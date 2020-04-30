import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as _ from 'lodash-es';
import { ProgramsService, UserService, FrameworkService, EnrollContributorService} from '@sunbird/core';
import { first, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { ToasterService, ResourceService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {  IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-enroll-contributor',
  templateUrl: './enroll-contributor.component.html',
  styleUrls: ['./enroll-contributor.component.scss'],
  providers: [DatePipe]
})
export class EnrollContributorComponent implements OnInit, AfterViewInit {
  public unsubscribe = new Subject<void>();
  public enrollAsOrg = false;
  public enrollDetails: any = {};
  public enrolledDate: any;
  @ViewChild('modal') modal;
  frameworkdetails;
  formIsInvalid = false;
  telemetryImpression: any;
  options;
  disableSubmit = false;
  public contributeForm: FormGroup;
  public mapUserId: string;
  public mapOrgId: string;
  public frameworkFetched = false;
  public telemetryPageId = 'enroll-contributor';
  @Output() close = new EventEmitter<any>();
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  instance: string;

  constructor(private programsService: ProgramsService, private tosterService: ToasterService,
    public userService: UserService, private configService: ConfigService,
    public toasterService: ToasterService, public formBuilder: FormBuilder, private navigationHelperService: NavigationHelperService,
    public http: HttpClient, public enrollContributorService: EnrollContributorService, public router: Router,
    public resourceService: ResourceService, private datePipe: DatePipe, public activeRoute: ActivatedRoute  ) {
  }

  ngOnInit(): void {
    this.instance = _.upperCase(this.resourceService.instance || 'DIKSHA');
    this.initializeFormFields();
    this.enrolledDate = new Date();
    this.enrolledDate = this.datePipe.transform(this.enrolledDate, 'yyyy-MM-dd');
    this.telemetryInteractCdata = [];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: 'creation-portal',
          cdata: [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.configService.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: 'create',
          pageid: this.telemetryPageId,
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  initializeFormFields(): void {
    this.contributeForm = this.formBuilder.group({
      name: [''],
      description: [''],
      website: [''],
      tncAccepted: ['', Validators.required],
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        control.markAsTouched();
    });
  }
  saveUser() {
          const User = {};
          User['firstName'] =  this.userService.userProfile.firstName;
          User['lastName'] =  this.userService.userProfile.lastName || '';
          User['userId'] =  this.userService.userProfile.identifier;
          User['enrolledDate'] = this.enrolledDate;
          User['certificates'] =  '';
          User['channel'] = this.userService.userProfile.channel || 'sunbird';
          this.enrollContributorService.enrolment({User: User}).pipe(
            switchMap((res1: any) => {
            this.mapUserId = res1.result.User.osid;
               if (this.enrollAsOrg === true) {
                const Org = {
                  ...this.contributeForm.value
                };
                delete Org.tncAccepted;
                Org['createdBy'] = res1.result.User.osid;
                Org['code'] = this.contributeForm.controls['name'].value.toUpperCase();
                return this.enrollContributorService.enrolment({
                  Org: Org
                });
               } else {
                 return of(res1);
               }
          }), switchMap((res2: any) => {
            if (this.enrollAsOrg === true) {
              this.mapOrgId = res2.result.Org.osid;
              const User_Org = {
                        userId: this.mapUserId,
                        orgId: this.mapOrgId,
                        roles: ['admin']
                      };
              return this.enrollContributorService.enrolment({User_Org: User_Org});
             } else {
               return of(res2);
             }
          }), catchError(err => throwError(err)))
          .subscribe((res3) => {
            this.contributeForm.reset();
            this.modal.deny();
            this.userService.openSaberRegistrySearch().then((userRegData) => {
              this.userService.userProfile.userRegData = userRegData;
              this.tosterService.success(this.resourceService.messages.smsg.contributorRegister.m0001);
            });
          }, (err) => {
            this.tosterService.error(this.resourceService.messages.emsg.contributorRegister.m0002);
          });
  }

  changeEnrollStatus(status) {
    this.enrollAsOrg = status;
    this.contributeForm.controls['description'].setValidators(null);
    this.contributeForm.controls['name'].setValidators(null);
    if (this.enrollAsOrg) {
      this.contributeForm.controls['description'].setValidators([Validators.required, Validators.maxLength(1000)]);
      this.contributeForm.controls['name'].setValidators([Validators.required, Validators.maxLength(100)]);
    }
    this.contributeForm.controls['name'].updateValueAndValidity();
    this.contributeForm.controls['description'].updateValueAndValidity();
  }

  validateFields() {
    if (!this.contributeForm.valid) {
      this.formIsInvalid = true;
      this.validateAllFormFields(this.contributeForm);
    } else {
      if (this.enrollAsOrg === true) {
        const request = {
          entityType: ['Org'],
          filters: {
            code: { eq: this.contributeForm.get('name').value.toUpperCase() }
          }
        };
        this.programsService.searchRegistry(request).subscribe(
          (res) => { if (_.isEmpty(res.result.Org) || res.result.Org.length === 0) {
                    this.saveUser();
            } else {
              this.tosterService.error(this.resourceService.messages.emsg.contributorRegister.m0001);
            }
              },
          (err) => {
          }
        );
      } else {
        this.saveUser();
      }
    }
  }

  closeModal() {
    this.close.emit();
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }
}
