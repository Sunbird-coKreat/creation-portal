import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import * as _ from 'lodash-es';
import { ProgramsService, UserService, FrameworkService, EnrollContributorService} from '@sunbird/core';
import { tap, first , map, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subscription, Subject, interval , } from 'rxjs';
import { ServerResponse, RequestParam, HttpOptions } from '@sunbird/shared';
import { of as observableOf, throwError as observableThrowError, Observable  } from 'rxjs';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enroll-contributor',
  templateUrl: './enroll-contributor.component.html',
  styleUrls: ['./enroll-contributor.component.scss'],
  providers: [DatePipe]
})
export class EnrollContributorComponent implements OnInit {
  public unsubscribe = new Subject<void>();
  public enrollAsOrg = false;
  public enrollDetails: any = {};
  public userProfile: any;
  public programScope = {};
  public enrolledDate: any;
  @ViewChild('modal') modal;
  frameworkdetails;
  formIsInvalid = false;
  contentType = { };

  options;
  disableSubmit = false;
  public contributeForm: FormGroup;
  public mapUserId: string;
  public mapOrgId: string;
  public frameworkFetched = false;
  @Output() close = new EventEmitter<any>();

  constructor(private programsService: ProgramsService, private tosterService: ToasterService,
    public userService: UserService, public frameworkService: FrameworkService,
    public toasterService: ToasterService, public formBuilder: FormBuilder,
    public http: HttpClient, public enrollContributorService: EnrollContributorService, public router: Router,
    public resourceService: ResourceService, private datePipe: DatePipe  ) {
    this.userProfile = this.userService.userProfile;
  }

  ngOnInit(): void {
      this.userProfile = this.userService.userProfile;
      this.fetchFrameWorkDetails();
      this.initializeFormFields();
      this.getProgramContentTypes();
      this.enrolledDate = new Date();
      this.enrolledDate = this.datePipe.transform(this.enrolledDate, 'yyyy-MM-dd');
  }

  fetchFrameWorkDetails() {
   const frameworkId = _.get(this.userProfile.framework, 'id') ? _.get(this.userProfile.framework, 'id')[0] : null;
   if (frameworkId) {
    this.frameworkService.getFrameworkCategories(frameworkId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data && _.get(data, 'result.framework.categories')) {
          this.frameworkdetails = _.get(data, 'result.framework.categories');

          this.frameworkdetails.forEach((element) => {
            this.enrollDetails[element['code']] = element['terms'];
          });
          this.frameworkFetched = true;
        }
      }, error => {
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching framework details failed');
        this.router.navigate(['']);
      });
   } else {
    this.frameworkService.initialize();
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkInfo: any) => {
      if (frameworkInfo && !frameworkInfo.err) {
        this.frameworkdetails  = frameworkInfo.frameworkdata.defaultFramework.categories;
        this.frameworkdetails.forEach((element) => {
          this.enrollDetails[element['code']] = element['terms'];
        });
        this.frameworkFetched = true;
      }
    });
   }
  }

  getProgramContentTypes () {
    const option = {
      url: 'program/v1/contenttypes/list',
    };

    this.programsService.get(option).subscribe(
      (res) => {
        this.contentType['contentType'] = res.result.contentType;
        },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching content types failed');
      }
    );
  }

  initializeFormFields(): void {
    this.contributeForm = this.formBuilder.group({
        board: ['', Validators.required],
        medium: ['', Validators.required],
        gradeLevel: ['', Validators.required],
        subject: ['', Validators.required],
        contentTypes: ['', Validators.required],
        name: [''],
        description: [''],
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        control.markAsTouched();
    });
}
  saveUser() {
    this.formIsInvalid = false;
    if (this.contributeForm.dirty && this.contributeForm.valid) {
      if (this.enrollAsOrg === false) {
          const User = {
            ...this.contributeForm.value

        };
          User['firstName'] =  this.userProfile.firstName;
          User['lastName'] =  this.userProfile.lastName || '';
          User['userId'] =  this.userProfile.identifier;
          User['enrolledDate'] = this.enrolledDate;
          User['certificates'] =  '';
          User['channel'] = 'sunbird';
          this.enrollUser(User);
      }
      if (this.enrollAsOrg === true) {

        const User = {
          ...this.contributeForm.value
        };
          User['firstName'] =  this.userProfile.firstName;
          User['lastName'] =  this.userProfile.lastName || '';
          User['userId'] =  this.userProfile.identifier;
          User['certificates'] =  '';
          User['channel'] = 'sunbird';
          this.enrollUser(User);
        }
    } else {
            this.formIsInvalid = true;
            this.validateAllFormFields(this.contributeForm);
    }
  }
  enrollUser(User) {
    const option = {
      url: 'reg/add',
      data:
      {
        id : 'open-saber.registry.create',
        request:
        {
          User
        }
      }
    };
   // this.saveData(option);
    this.enrollContributorService.saveData(option).subscribe(
      (res) => {
        if (res.result.User.osid) {
          const Org = {
            ...this.contributeForm.value
         };
          Org['createdBy'] =  res.result.User.osid;
          Org['code'] = this.contributeForm.controls['name'].value.toUpperCase();
          this.mapUserId = res.result.User.osid;
          if (this.enrollAsOrg  === false) {
            this.contributeForm.reset();
            this.tosterService.success('You are successfully enrolled as a contributor');
            this.modal.deny();
          }
          this.enrollAsOrganisation(Org);
        } else {
          this.contributeForm.reset();
          this.tosterService.error('Enrollment unsuccessfully');
        }
      },
      (err) => console.log(err)
    );
  }

  enrollAsOrganisation(Org) {
    const option = {
      url: 'reg/add',
      data:
      {
        id : 'open-saber.registry.create',
        request:
        {
          Org
        }
      }
    };

    this.enrollContributorService.saveData(option).subscribe(
      (res) => {this.mapOrgId = res.result.Org.osid; this.mapUserToOrg(); },
      (err) => console.log(err)
    );
  }

  mapUserToOrg() {
    const option = {
      url: 'reg/add',
      data:
      {
        id: 'open-saber.registry.create',
        request: {
          User_Org: {
          userId: this.mapUserId,
          orgId: this.mapOrgId,
          roles: ['admin']
        }
      }
    }
    };
    this.enrollContributorService.saveData(option).subscribe(
      (res) => {
      this.contributeForm.reset();
      this.tosterService.success('You are successfully enrolled as a contributor!');
      this.modal.deny();
    },
      (err) => console.log(err)
    );
  }
  chnageEnrollStatus(status) {
    this.enrollAsOrg = status;
    if (this.enrollAsOrg === true) {
      // const name = this.contributeForm.get('name');
      // const description = this.contributeForm.get('description');
      // name.setValidators([Validators.required]);
      // description.setValidators([Validators.required]);
    }
    if (this.enrollAsOrg === false) {
      // const name = this.contributeForm.get('name');
      // const description = this.contributeForm.get('description');
      // name.setValidators(null);
      // description.setValidators(null);
    }
  }

  closeModal() {
    this.close.emit();
  }

}
