import { ConfigService, ResourceService, ToasterService, RouterNavigationService,
   ServerResponse } from '@sunbird/shared';
import { ProgramsService, DataService, FrameworkService } from '@sunbird/core';
import { Subscription, Subject } from 'rxjs';
import { tap, first, map, takeUntil } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { IProgram } from './../../../core/interfaces';
import { UserService } from '@sunbird/core';
import { programConfigObj } from './programconfig';
import { HttpClient } from '@angular/common/http';
import { IStartEventInput, IEndEventInput } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ProgramTelemetryService } from '../../services/program-telemetry/program-telemetry.service';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss']
})

export class CreateProgramComponent implements OnInit, AfterViewInit {
  public unsubscribe = new Subject<void>();

  /**
   * Program creation form name
   */
  createProgramForm: FormGroup;
  collectionListForm: FormGroup;

  sbFormBuilder: FormBuilder;

  /**
   * Contains Program form data
   */
  programDetails: IProgram;
  public telemetryStart: IStartEventInput;
  public telemetryEnd: IEndEventInput;

  /**
  * To send activatedRoute.snapshot to routerNavigationService
  */
  // private activatedRoute: ActivatedRoute;

  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;

  /**
  * To navigate back to parent component
  */
  public routerNavigationService: RouterNavigationService;

  /**
  * List of textbooks for the program by BMGC
  */
  collections;
  tempCollections = [];
  /**
  * List of textbooks for the program by BMGC
  */
  frameworkdetails;
  frameworkCategories;
  programScope: any = {};
  userprofile;
  programId: string;
  showTextBookSelector = false;
  formIsInvalid = false;
  subjectsOption = [];
  mediumOption = [];
  gradeLevelOption = [];
  pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
  pickerMinDateForEndDate = new Date(new Date().setHours(0, 0, 0, 0));
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;

  constructor(
    public frameworkService: FrameworkService,
    private programsService: ProgramsService,
    private userService: UserService,
    public toasterService: ToasterService,
    public resource: ResourceService,
    private config: ConfigService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private deviceDetectorService: DeviceDetectorService,
    public programTelemetryService: ProgramTelemetryService,
    public configService: ConfigService) {

    this.sbFormBuilder = formBuilder;

  }

  ngOnInit() {
    this.userprofile = this.userService.userProfile;
    console.log(this.userprofile);
    this.initializeFormFields();
    this.fetchFrameWorkDetails();
    this.getProgramContentTypes();
<<<<<<< HEAD
    // this.showTexbooklist('dsd');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.programId || '', 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID);
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.programId || '', 'Program', '1.0');
=======
    //this.showTexbooklist();
>>>>>>> upstream/creation_portal
  }

  ngAfterViewInit() {
  }

  fetchFrameWorkDetails() {
    this.programScope['medium'] = [];
    this.programScope['gradeLevel'] = [];
    this.programScope['subject'] = [];

    this.collectionListForm.controls['medium'].setValue('');
    this.collectionListForm.controls['gradeLevel'].setValue('');
    this.collectionListForm.controls['subject'].setValue('');

    this.frameworkService.getFrameworkCategories(_.get(this.userprofile.framework, 'id')[0])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {

        if (data && _.get(data, 'result.framework.categories')) {
          this.frameworkCategories = _.get(data, 'result.framework.categories');
          const board = _.find(this.frameworkCategories, (element) => {
            return element.code === 'board';
          });

          this.frameworkCategories.forEach((element) => {
            this.programScope[element['code']] = _.sortBy(element['terms'], ['name']);;
          });

          const mediumOption = this.programsService.getAssociationData(board.terms, 'medium', this.frameworkCategories);

          if (mediumOption.length) {
            this.programScope['medium'] = mediumOption;
          }
        }
      }, error => {
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching framework details failed');
      });
  }

  onMediumChange() {
    //const thisClassOption = this.createProgramForm.value.gradeLevel;

    /*this.programScope['gradeLevel'] = [];
    this.programScope['subject'] = [];*/
    this.collectionListForm.controls['gradeLevel'].setValue('');
    this.collectionListForm.controls['subject'].setValue('');

    if (!_.isEmpty(this.collectionListForm.value.medium)) {
      // tslint:disable-next-line: max-line-length
      const classOption = this.programsService.getAssociationData(this.collectionListForm.value.medium, 'gradeLevel', this.frameworkCategories);

      if (classOption.length) {
        this.programScope['gradeLevel'] = classOption;
      }

      this.onClassChange();
    }
  }

  onClassChange() {
    // const thisSubjectOption = this.createProgramForm.value.subject;
    // this.programScope['subject'] = [];
    this.collectionListForm.controls['subject'].setValue('');

    if (!_.isEmpty(this.collectionListForm.value.gradeLevel)) {

      // tslint:disable-next-line: max-line-length
      const subjectOption = this.programsService.getAssociationData(this.collectionListForm.value.gradeLevel, 'subject', this.frameworkCategories);

      if (subjectOption.length) {
        this.programScope['subject'] = subjectOption;
      }
    }
  }

  /**
   * Executed when user come from any other page or directly hit the url
   *
   * It helps to initialize form fields and apply field level validation
   */
  initializeFormFields(): void {
    this.createProgramForm = this.sbFormBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(1000)],
      nomination_enddate: ['', Validators.required],
      shortlisting_enddate: [''],
      program_end_date: ['', Validators.required],
      content_submission_enddate: ['', Validators.required],
      content_types: [],
      rewards: [],
      /*medium: ['', Validators.required],
      gradeLevel: ['', Validators.required],
      subject: ['', Validators.required],*/
    });

    this.collectionListForm = this.sbFormBuilder.group({
      pcollections: this.sbFormBuilder.array([]),
      medium: [],
      gradeLevel: [],
      subject: [],
    });
    /*this.createProgramForm.patchValue({
      rootorg_id: this.userprofile.rootOrgId
    });*/
  }

  getProgramContentTypes () {
    const option = {
      url: 'program/v1/contenttypes/list',
    };

    this.programsService.get(option).subscribe(
      (res) => {
          this.programScope['purpose'] = res.result.contentType;
          console.log(this.programScope['purpose']);
        },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching content types failed');
      }
    );

  }

  saveProgramError(err) {
    console.log(err)
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched();
    });
  }

  navigateTo(stepNo) {
    this.showTextBookSelector = false;
  }

  saveProgram() {
    this.formIsInvalid = false;

    if (this.createProgramForm.dirty && this.createProgramForm.valid) {
      const data = {
        ...this.createProgramForm.value
      };
      data['sourcing_org_name'] = this.userprofile.rootOrgName;
      data['rootorg_id'] = this.userprofile.rootOrgId;
      data['createdby'] = this.userprofile.id;
      data['createdon'] = new Date();
      data['startdate'] = new Date();
      data['slug'] = "sunbird";
      data['type'] = "public",

      data['default_roles'] = ["CONTRIBUTOR"];
      data['enddate'] = data.program_end_date;
      data['config'] = programConfigObj;
      delete data.gradeLevel;
      delete data.medium;
      delete data.subject;
      delete data.program_end_date;

      if (!this.programId) {
        data['status'] = "Draft";
        this.programsService.createProgram(data).subscribe(
          (res) => { this.programId = res.result.program_id; this.showTexbooklist(); this.generateTelemetryEvent('START'); },
          (err) => this.saveProgramError(err)
        );
      } else {
        data['program_id'] = this.programId;
        this.programsService.updateProgram(data).subscribe(
          (res) => { this.showTexbooklist(); },
          (err) => this.saveProgramError(err)
        );
      }
    } else {
      this.formIsInvalid = true;
      this.validateAllFormFields(this.createProgramForm);
    }
  }

  showTexbooklist() {

    const requestData =  {
      request: {
        filters: {
          objectType: "content",
          status: ["Draft"],
          contentType: "Textbook",
          framework: this.userprofile.framework.id[0],
          board: this.userprofile.framework.board[0],
        },
        not_exists: ["programId"]
      }
    };

    if (!_.isEmpty(this.collectionListForm.value.medium)) {
      requestData.request.filters['medium'] = [];
      _.forEach(this.collectionListForm.value.medium, (medium) => {
        requestData.request.filters['medium'].push(medium.name);
      });
    }

    if (!_.isEmpty(this.collectionListForm.value.gradeLevel)) {
      requestData.request.filters['gradeLevel'] = [];
      _.forEach(this.collectionListForm.value.gradeLevel, (gradeLevel) => {
        requestData.request.filters['gradeLevel'].push(gradeLevel.name);
      });
    }

    if (!_.isEmpty(this.collectionListForm.value.subject)) {
      requestData.request.filters['subject'] = this.collectionListForm.value.subject;
    }

    return this.programsService.getCollectionList(requestData).subscribe(
      (res) => {
        this.showTextBookSelector = true;
        this.collections = res.result.content;
      },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
      }
    );
  }

  onCollectionCheck(collection, isChecked: boolean) {
    const pcollectionsFormArray = <FormArray>this.collectionListForm.controls.pcollections;
    const collectionId = collection.identifier;

    if (isChecked) {
      pcollectionsFormArray.push(new FormControl(collectionId));
      this.tempCollections.push(collection);
    } else {
      const index = pcollectionsFormArray.controls.findIndex(x => x.value == collectionId)
      pcollectionsFormArray.removeAt(index);

      const cindex = this.tempCollections.findIndex(x => x.identifier == collectionId);
      this.tempCollections.splice(cindex, 1);
    }
  }

  updateProgramCollection() {
    if (_.isEmpty(this.collectionListForm.value.pcollections)) {
      this.toasterService.warning('Please select at least a textbook');
      return false;
    }

    const requsetData = {
      'program_id': this.programId,
      'collection': this.collectionListForm.value.pcollections
    };

    this.programsService.updateProgramCollection(requsetData).subscribe(
      (res) => { this.addCollectionsToProgram(); },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
      }
    );
  }

  addCollectionsToProgram() {
    _.forEach(this.tempCollections, (collection) => {

      if (this.mediumOption.indexOf(collection.medium) === -1) {
        this.mediumOption.push(collection.medium);
      }
      if (this.subjectsOption.indexOf(collection.subject) === -1) {
        this.subjectsOption.push(collection.subject);
      }

      _.forEach(collection.gradeLevel, (single) => {
        if (this.gradeLevelOption.indexOf(single) === -1) {
          this.gradeLevelOption.push(single);
        }
      });
    });

    let data = {};
    data['program_id'] = this.programId;
    data['collection_ids'] = this.collectionListForm.value.pcollections;

    programConfigObj.board = this.userprofile.framework.board[0];
    programConfigObj.gradeLevel = this.gradeLevelOption;
    programConfigObj.medium = this.mediumOption;
    programConfigObj.subject = this.subjectsOption;
    data['config'] = programConfigObj;
    data['status'] = "Live";

    this.programsService.updateProgram(data).subscribe(
      (res) => { this.router.navigate(['/sourcing']); this.generateTelemetryEvent('END'); },
      (err) => this.saveProgramError(err)
    );
  }

  generateTelemetryEvent(event) {
   switch (event) {
     case 'START':
      const deviceInfo = this.deviceDetectorService.getDeviceInfo();
      this.telemetryStart = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        object: {
          id: this.programId || '',
          type: this.activatedRoute.snapshot.data.telemetry.object.type,
          ver: this.activatedRoute.snapshot.data.telemetry.object.ver
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type || '',
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid || '',
          mode: this.activatedRoute.snapshot.data.telemetry.mode || '',
          uaspec: {
            agent: deviceInfo.browser,
            ver: deviceInfo.browser_version,
            system: deviceInfo.os_version,
            platform: deviceInfo.os,
            raw: deviceInfo.userAgent
          }
        }
      };
       break;
     case 'END':
      this.telemetryEnd = {
        object: {
          id: this.programId || '',
          type: this.activatedRoute.snapshot.data.telemetry.object.type,
          ver: this.activatedRoute.snapshot.data.telemetry.object.ver
        },
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          mode: 'create'
        }
      };
       break;
     default:
       break;
   }
  }
}
