import { ConfigService, ResourceService, ToasterService, RouterNavigationService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { ProgramsService, DataService, FrameworkService } from '@sunbird/core';
import { Subscription, Subject } from 'rxjs';
import { tap, first , map } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { IProgram } from './../../../core/interfaces';
import { UserService } from '@sunbird/core';
import { programConfigObj } from './programconfig';
import { HttpClient } from '@angular/common/http';

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
        
    /**
    * To send activatedRoute.snapshot to routerNavigationService
    */
    private activatedRoute: ActivatedRoute;

    /**
    * To call resource service which helps to use language constant
    */
    public resourceService: ResourceService;

    /**
    * To show toaster(error, success etc) after any API calls
    */
    private toasterService: ToasterService;

    /**
    * To navigate back to parent component
    */
    public routerNavigationService: RouterNavigationService;

    /**
    * List of textbooks for the program by BMGC
    */
    collections;

    /**
    * List of textbooks for the program by BMGC
    */
    frameworkdetails;
    programScope = {};
    userprofile;
    programId = 0;
    showTextBookSelector = false;
    formIsInvalid = false;

    pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
    pickerMinDateForEndDate = new Date(new Date().setHours(0, 0, 0, 0));

    constructor(
        public frameworkService: FrameworkService,
        private programsService: ProgramsService,
        private userService: UserService,
        toasterService: ToasterService,
        resource: ResourceService,
        private config: ConfigService,
        activatedRoute: ActivatedRoute,
        private router: Router,
        private navigationHelperService: NavigationHelperService,
        private formBuilder: FormBuilder,
        private httpClient: HttpClient) {

        this.sbFormBuilder = formBuilder;
        this.programScope = {
            'purpose': [{
              'name': 'Resource',
              'value': 'Resource'
              }, {
                  'name': 'TeachingMethod',
                  'value': 'TeachingMethod'
              }, {
                  'name': 'PedagogyFlow',
                  'value': 'PedagogyFlow'
              }, {
                  'name': 'FocusSpot',
                  'value': 'FocusSpot'
              }, {
                'name': 'LearningOutcomeDefinition',
                'value': 'LearningOutcomeDefinition'
              }, {
                'name': 'PracticeQuestionSet',
                'value': 'PracticeQuestionSet'
              }, {
                'name': 'CuriosityQuestionSet',
                'value': 'CuriosityQuestionSet'
              }, {
                'name': 'MarkingSchemeRubric',
                'value': 'MarkingSchemeRubric'
              }, {
                'name': 'ExplanationResource',
                'value': 'ExplanationResource'
              }, {
                'name': 'ExperientialResource',
                'value': 'ExperientialResource'
              }, {
                'name': 'ConceptMap',
                'value': 'ConceptMap'
            }],
        }
    }

    ngOnInit() {
        this.userprofile = this.userService.userProfile;
        console.log(this.userprofile);
        this.initializeFormFields();
        this.fetchFrameWorkDetails(); 
        //this.showTexbooklist('dsd');
    }
    
    ngAfterViewInit() {}
      
    fetchFrameWorkDetails() {
      let instance = this;
      this.frameworkService.initialize(this.userprofile.framework.id);
      this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
        if (frameworkDetails && !frameworkDetails.err) {
          instance.frameworkdetails = frameworkDetails.frameworkdata[this.userprofile.framework.id[0]].categories; 
          this.generateProgramScopeFields(instance.frameworkdetails);
        }
      }, error => {
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching framework details failed');
      });
    }

    generateProgramScopeFields(fields) {
      fields.forEach( (element) => {
        this.programScope[element['code']] = element['terms'];
      });
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
            subject: ['', Validators.required],
            gradeLevel: ['', Validators.required],
            medium: ['', Validators.required],
        });

        this.collectionListForm = this.sbFormBuilder.group({
          pcollections: this.sbFormBuilder.array([]) 
        });
        /*this.createProgramForm.patchValue({
          rootorg_id: this.userprofile.rootOrgId
        });*/
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
            
            data['rootorg_id'] = this.userprofile.rootOrgId;
            data['createdby'] = this.userprofile.id;
            data['createdon'] = new Date();
            data['startdate'] = new Date();
            data['slug'] =  "sunbird";
            data['status'] = "Draft";
            data['type'] =  "public",
            data['default_roles'] = ["CONTRIBUTOR"];
            data['enddate'] = data.program_end_date;
            
            programConfigObj.board = this.userprofile.framework.board[0];
            programConfigObj.gradeLevel = data.gradeLevel;
            programConfigObj.medium = data.medium;
            programConfigObj.subject = data.subject;
            data['config'] = programConfigObj;
            
            delete data.gradeLevel;
            delete data.medium;
            delete data.subject;
            delete data.program_end_date;

            if (!this.programId) {
              this.programsService.createProgram(data).subscribe(
                (res) => {this.programId=res.result.program_id; this.showTexbooklist(res)},
                (err) => this.saveProgramError(err)
              );
            }
            else {
              data['program_id'] = this.programId;
              this.programsService.updateProgram(data).subscribe(
                (res) => {this.showTexbooklist(res)},
                (err) => this.saveProgramError(err)
              );
            }
        } else {
            this.formIsInvalid = true;
            this.validateAllFormFields(this.createProgramForm);
        }
    }

    showTexbooklist (res){
      console.log(this.programId);
      const formData = {
        ...this.createProgramForm.value
      };

      const option = {
        url: 'content/composite/v1/search',
        data: {
          request: {
            filters: {
              objectType: "content", 
              status: ["Draft", "Live"], 
              contentType: "Textbook", 
              framework: this.userprofile.framework.id[0], 
              board:	this.userprofile.framework.board[0],
              medium:	formData.medium  
            }
          }
        }
      };

      let instance = this;
      this.httpClient.post<any>(option.url, option.data).subscribe(
        (res) => {
                this.showTextBookSelector = true;
                this.collections = res.result.content;
              }, 
        (err) => {
          console.log(err);
          // TODO: navigate to program list page
          const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
          instance.toasterService.warning(errorMes || 'Fetching textbooks failed');
        }
      );
    }
    
    getProgramTextbooks(res) {
      const formData = {
        ...this.createProgramForm.value
      };

      const request = { };
      request['filters'] = {
        objectType: "content", 
        status: ["Draft", "Live"], 
        contentType: "Textbook", 
        framework: this.userprofile.framework.id[0], 
        board:	this.userprofile.framework.board[0],
        medium:	formData.medium 
      };

      return this.programsService.getProgramCollection(request);
   }

   onCollectionCheck(collectionId: string, isChecked: boolean) {
    const pcollectionsFormArray = <FormArray>this.collectionListForm.controls.pcollections;

    if (isChecked) {
      pcollectionsFormArray.push(new FormControl(collectionId));
    } else {
      let index = pcollectionsFormArray.controls.findIndex(x => x.value == collectionId)
      pcollectionsFormArray.removeAt(index);
    }
  }

  updateProgramCollection () {
    console.log(this.collectionListForm.value);
    const data = {};
    data['program_id'] = this.programId;
    data['collection'] = this.collectionListForm.value.pcollections;
    console.log(data);

    const option = {
      url: '/program/v1/collection/link',
      header: {
        'content-type' : 'application/json'
      },
      data: {
        request: {
          'program_id': this.programId,
          'collection': this.collectionListForm.value.pcollections
          }
      }
    };

    let instance = this;
    this.programsService.post(option).subscribe(
      (res) => {this.router.navigate(['/sourcing'])},
      (err) => { console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
      }
    );
  }
}
