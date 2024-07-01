import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import * as _ from 'lodash-es';
import { ProgramsService, UserService, RegistryService, EnrollContributorService } from '@sunbird/core';
import { first, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { ToasterService, ResourceService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';

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
  @ViewChild('modal') modal;
  frameworkdetails;
  formIsInvalid = false;
  telemetryImpression: any;
  options;
  disableSubmit = false;
  public contributeForm: UntypedFormGroup;
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
    public toasterService: ToasterService, public formBuilder: UntypedFormBuilder, private navigationHelperService: NavigationHelperService,
    public http: HttpClient, public enrollContributorService: EnrollContributorService, public router: Router,
    public resourceService: ResourceService, private datePipe: DatePipe, public activeRoute: ActivatedRoute,
    private registryService: RegistryService) {
  }

  ngOnInit(): void {
    this.initializeFormFields();
    this.telemetryInteractCdata = [];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
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

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched();
    });
  }

  saveUser() {
    const userId = this.userService.userProfile.identifier;
    const userRegSearch = this.registryService.openSaberRegistrySearch(userId);
    userRegSearch.then((userProfile) => {
      if (_.get(userProfile, 'error') === false) {
        if (_.isEmpty(_.get(userProfile, 'user'))) {
          this.createSaberUserOrgMapping().subscribe((res) => {
            this.contributeForm.reset();
            this.modal.deny();
            this.userService.openSaberRegistrySearch().then((userRegData) => {
              this.userService.userProfile.userRegData = userRegData;
              this.tosterService.success(this.resourceService.messages.smsg.contributorRegister.m0001);
            });
          }, (err) => {
            console.log(err);
            this.disableSubmit = false;
            this.tosterService.error(this.resourceService.messages.emsg.contributorRegister.m0002);
          });
        } else {
          const userOsId = _.get(userProfile, 'user.osid');
          if (this.enrollAsOrg === false) {
            this.tosterService.error(this.resourceService.messages.emsg.contributorRegister.m0003);
          } else {
            if (_.isEmpty(_.get(userProfile, 'org'))) {
              this.createSaberOrgMapping(userOsId).subscribe((res) => {
                this.contributeForm.reset();
                this.modal.deny();
                this.userService.openSaberRegistrySearch().then((userRegData) => {
                  this.userService.userProfile.userRegData = userRegData;
                  this.tosterService.success(this.resourceService.messages.smsg.contributorRegister.m0001);
                });
              }, (err) => {
                console.log(err);
                this.disableSubmit = false;
                this.tosterService.error(this.resourceService.messages.emsg.contributorRegister.m0002);
              });
            } else {
              this.tosterService.error(this.resourceService.messages.emsg.contributorRegister.m0004);
            }
          }
        }
      }
    }).catch((err) => {
      this.disableSubmit = false;
      console.log(err);
      this.tosterService.error(this.resourceService.messages.emsg.contributorRegister.m0002);
    });
  }

  private createSaberUserOrgMapping() {
     // Add user to the registry
     const userAdd = {
      User: {
        firstName: this.userService.userProfile.firstName,
        lastName: this.userService.userProfile.lastName || '',
        userId: this.userService.userProfile.identifier,
        enrolledDate: new Date().toISOString(),
        channel: this.userService.userProfile.rootOrgId,
        roles: (this.enrollAsOrg === true) ? ['admin'] : ['individual']
      }
    };

    return this.programsService.addToRegistry(userAdd).pipe(
      switchMap((res1: any) => {
        this.mapUserId = res1.result.User.osid;
        if (this.enrollAsOrg === true) {
          const Org = {
            ...this.contributeForm.value
          };
          delete Org.tncAccepted;
          Org['createdBy'] = res1.result.User.osid;
          Org['code'] = this.contributeForm.controls['name'].value.toUpperCase();

          const orgAdd = {
            Org: Org
          };
          return this.programsService.addToRegistry(orgAdd);
        } else {
          return of(res1);
        }
      }), switchMap((res2: any) => {
        if (this.enrollAsOrg === true) {
          this.mapOrgId = res2.result.Org.osid;
            const userOrgAdd = {
              User_Org: {
                userId: this.mapUserId,
                orgId: this.mapOrgId,
                roles: ['admin']
              }
            };
            return this.programsService.addToRegistry(userOrgAdd);
        } else {
          return of(res2);
        }
      }), catchError(err => throwError(err)));
  }

  private createSaberOrgMapping(userOsId) {
    const Org = {
      ...this.contributeForm.value
    };
    delete Org.tncAccepted;
    Org['createdBy'] = userOsId;
    Org['code'] = this.contributeForm.controls['name'].value.toUpperCase();
    const orgAdd = {
      Org: Org
    };
    return this.programsService.addToRegistry(orgAdd).pipe(
      switchMap((res1: any) => {
        const OrgOsId = res1.result.Org.osid;
        const userOrgAdd = {
          User_Org: {
            userId: userOsId,
            orgId: OrgOsId,
            roles: ['admin']
          }
        };
        return this.programsService.addToRegistry(userOrgAdd);
      }), catchError(err => throwError(err)));
  }

  changeEnrollStatus(status) {
    this.disableSubmit = false;
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
      this.disableSubmit = true;
      if (this.enrollAsOrg === true) {
        const request = {
          entityType: ['Org'],
          filters: {
            code: { eq: this.contributeForm.get('name').value.toUpperCase() }
          }
        };
        this.programsService.searchRegistry(request).subscribe(
          (res) => {
            if (_.isEmpty(res.result.Org) || res.result.Org.length === 0) {
              this.saveUser();
            } else {
              this.disableSubmit = false;
              this.tosterService.error(this.resourceService.messages.emsg.contributorRegister.m0001);
            }
          },
          (err) => {
          });
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
