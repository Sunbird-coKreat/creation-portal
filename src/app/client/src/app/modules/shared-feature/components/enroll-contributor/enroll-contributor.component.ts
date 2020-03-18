import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    public http: HttpClient, public enrollContributorService: EnrollContributorService,
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

    this.frameworkService.getFrameworkCategories(_.get(this.userProfile.framework, 'id')[0])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {

        if (data && _.get(data, 'result.framework.categories')) {
          this.frameworkdetails = _.get(data, 'result.framework.categories');

          this.frameworkdetails.forEach((element) => {
            this.enrollDetails[element['code']] = element['terms'];
          });
        }
      }, error => {
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching framework details failed');
      });
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
          User['lastName'] =  this.userProfile.lastName;
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
          User['lastName'] =  this.userProfile.lastName;
          User['userId'] =  this.userProfile.identifier;
          User['certificates'] =  '';
          User['channel'] = 'sunbird';
          this.enrollUser(User);
            const Org = {
              ...this.contributeForm.value
          };
            Org['createdBy'] =  this.userProfile.identifier;
            Org['code'] = this.contributeForm.controls['name'].value.toUpperCase();
            this.enrollAsOrganisation(Org);
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
      (res) => {this.mapUserId = res.result.User.osid;
        if (this.enrollAsOrg  === false) {
          this.contributeForm.reset();
          this.tosterService.success('You are successfully enrolled as a contributor');
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
