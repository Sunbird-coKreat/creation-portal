import { HttpOptions, ConfigService, ResourceService, ToasterService, RouterNavigationService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { ProgramsService, DataService, FrameworkService } from '@sunbird/core';
import { Subscription, Subject } from 'rxjs';
import { tap, first , map, takeUntil } from 'rxjs/operators';
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
    tempCollections = [];
    /**
    * List of textbooks for the program by BMGC
    */
    frameworkdetails;
    frameworkCategories;
    programScope = {};
    userprofile;
    programId = 0;
    showTextBookSelector = false;
    formIsInvalid = false;
    subjectsOption = [];
    mediumOption = [];
    gradeLevelOption = [];
    pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
    pickerMinDateForEndDate = new Date(new Date().setHours(0, 0, 0, 0));

    httpOptions: HttpOptions = {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8',
        'X-Authenticated-User-Token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1WXhXdE4tZzRfMld5MG5PS1ZoaE5hU0gtM2lSSjdXU25ibFlwVVU0TFRrIn0.eyJqdGkiOiI1YTcyYzcwYi1hYzdlLTQxYmItYTVhMi1lZmRiZWU3ZDBkYmUiLCJleHAiOjE1ODQ1MzQxNDEsIm5iZiI6MCwiaWF0IjoxNTg0MzYxMzQxLCJpc3MiOiJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJzdWIiOiJmOjVhOGEzZjJiLTM0MDktNDJlMC05MDAxLWY5MTNiYzBmZGUzMTo4NDU0Y2IyMS0zY2U5LTRlMzAtODViNS1mYWRlMDk3ODgwZDgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI3NjNjZmEyMi01NzQyLTQyZmMtYTk1ZC0yNzA0ZDUxZjc2ZjQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2LmNlbnRyYWxpbmRpYS5jbG91ZGFwcC5henVyZS5jb20vIiwiaHR0cDovL2Rldi5jZW50cmFsaW5kaWEuY2xvdWRhcHAuYXp1cmUuY29tLyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwic2NvcGUiOiIiLCJuYW1lIjoiTWVudG9yIEZpcnN0IFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJudHB0ZXN0MTA0IiwiZ2l2ZW5fbmFtZSI6Ik1lbnRvciBGaXJzdCIsImZhbWlseV9uYW1lIjoiVXNlciIsImVtYWlsIjoidXMqKioqKioqKkB0ZXN0c3MuY29tIn0.O4qydQ3K2Rm0dhE-GlzlA_D9eQVeu702K7blBzRKmu6I7ockmQxCM9Vh60ubJy2F3leCTjlD2_7fFxo_Ct_X6YWrkil2RkTiqj1sBuuMXNTpql407u1hIAcAbyLhphs3_wEGDH9kp7GHQn7oxIkGD5SatL4CVcl_K55gkBSdO-IsddPF01z17xPj5v0YofJ2YTXkB4h6g2eFSwtJ7g9vWse7-CZtQm7FG01nqTjb7-4PXAL7bNxkI2a3B6N6z1QtZDWOsohYPVVyeagjk3lhfhyodG2nvHI2Ohw8-F6jD_eMGRjD41PhGHOuF1irjapV8rU4BsS2eWlf0ERWEREp1A',
        'observe': 'response'
      }
    };

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
      this.programScope['medium'] = [];
      this.programScope['gradeLevel'] = [];
      this.programScope['subject'] = [];

      this.createProgramForm.controls['medium'].setValue('');
      this.createProgramForm.controls['gradeLevel'].setValue('');
      this.createProgramForm.controls['subject'].setValue('');

      this.frameworkService.getFrameworkCategories(_.get(this.userprofile.framework, 'id')[0])
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {

          if (data && _.get(data, 'result.framework.categories')) {
            this.frameworkCategories = _.get(data, 'result.framework.categories');
            const board = _.find(this.frameworkCategories, (element) => {
              return element.code === 'board';
            });

            this.frameworkCategories.forEach( (element) => {
              this.programScope[element['code']] = element['terms'];
            });

            const mediumOption  = this.programsService.getAssociationData(board.terms, 'medium', this.frameworkCategories);

            if (mediumOption.length) {
              this.programScope['medium'] = mediumOption;
            }
          }
        }, err => {
        });
    }

    onMediumChange() {
      //const thisClassOption = this.createProgramForm.value.gradeLevel;

      /*this.programScope['gradeLevel'] = [];
      this.programScope['subject'] = [];*/
      this.createProgramForm.controls['gradeLevel'].setValue('');
      this.createProgramForm.controls['subject'].setValue('');

      if (!_.isEmpty(this.createProgramForm.value.medium)) {
          // tslint:disable-next-line: max-line-length
        const classOption = this.programsService.getAssociationData(this.createProgramForm.value.medium, 'gradeLevel', this.frameworkCategories);

        if (classOption.length) {
          this.programScope['gradeLevel'] = classOption;
        }

        this.onClassChange();
      }
    }

    onClassChange() {
      // const thisSubjectOption = this.createProgramForm.value.subject;
      // this.programScope['subject'] = [];
      this.createProgramForm.controls['subject'].setValue('');

      if (!_.isEmpty(this.createProgramForm.value.gradeLevel)) {

        // tslint:disable-next-line: max-line-length
        const subjectOption = this.programsService.getAssociationData(this.createProgramForm.value.gradeLevel, 'subject', this.frameworkCategories);

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
            medium: ['', Validators.required],
            gradeLevel: ['', Validators.required],
            subject: ['', Validators.required],
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

            // Getting only names from medium
            /*_.forEach(this.createProgramForm.value.medium, (medium) => {
              this.mediumOption.push(medium.name);
            });

            _.forEach(this.createProgramForm.value.gradeLevel, (gradeLevel) => {
              this.gradeLevelOption.push(gradeLevel.name);
            });*/

            data['rootorg_id'] = this.userprofile.rootOrgId;
            data['createdby'] = this.userprofile.id;
            data['createdon'] = new Date();
            data['startdate'] = new Date();
            data['slug'] =  "sunbird";
            data['type'] =  "public",

            data['default_roles'] = ["CONTRIBUTOR"];
            data['enddate'] = data.program_end_date;

            programConfigObj.board = this.userprofile.framework.board[0];
            programConfigObj.gradeLevel = this.gradeLevelOption;
            programConfigObj.medium = this.mediumOption;
            programConfigObj.subject = data.subject;
            data['config'] = programConfigObj;

            delete data.gradeLevel;
            delete data.medium;
            delete data.subject;
            delete data.program_end_date;

            if (!this.programId) {
              data['status'] = "Draft";
              this.programsService.createProgram(data).subscribe(
                (res) => {this.programId = res.result.program_id; this.showTexbooklist(res)},
                (err) => this.saveProgramError(err)
              );
            } else {
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
              medium:	this.mediumOption,
              gradeLevel:	this.gradeLevelOption,
              subject:	this.createProgramForm.value.subject,
            }
          }
        }
      };

      this.httpClient.post<any>(option.url, option.data, this.httpOptions).subscribe(
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
      tempCollections[collectionId] = collection;
      /*this.mediumOption = _.concat(this.mediumOption, collection.medium);
      this.gradeLevelOption = _.concat(this.gradeLevelOption, collection.gradeLevel);
      this.subjectsOption = _.concat(this.subjectsOption, collection.subject);*/
    } else {
      let index = pcollectionsFormArray.controls.findIndex(x => x.value == collectionId)
      pcollectionsFormArray.removeAt(index);

      delete tempCollections[collectionId];
    }

    console.log(tempCollections);
  }

  updateProgramCollection () {
    const option = {
      url: '/program/v1/collection/link',
      header: {
        'content-type' : 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8',
        'X-Authenticated-User-Token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1WXhXdE4tZzRfMld5MG5PS1ZoaE5hU0gtM2lSSjdXU25ibFlwVVU0TFRrIn0.eyJqdGkiOiI1YTcyYzcwYi1hYzdlLTQxYmItYTVhMi1lZmRiZWU3ZDBkYmUiLCJleHAiOjE1ODQ1MzQxNDEsIm5iZiI6MCwiaWF0IjoxNTg0MzYxMzQxLCJpc3MiOiJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJzdWIiOiJmOjVhOGEzZjJiLTM0MDktNDJlMC05MDAxLWY5MTNiYzBmZGUzMTo4NDU0Y2IyMS0zY2U5LTRlMzAtODViNS1mYWRlMDk3ODgwZDgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI3NjNjZmEyMi01NzQyLTQyZmMtYTk1ZC0yNzA0ZDUxZjc2ZjQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2LmNlbnRyYWxpbmRpYS5jbG91ZGFwcC5henVyZS5jb20vIiwiaHR0cDovL2Rldi5jZW50cmFsaW5kaWEuY2xvdWRhcHAuYXp1cmUuY29tLyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwic2NvcGUiOiIiLCJuYW1lIjoiTWVudG9yIEZpcnN0IFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJudHB0ZXN0MTA0IiwiZ2l2ZW5fbmFtZSI6Ik1lbnRvciBGaXJzdCIsImZhbWlseV9uYW1lIjoiVXNlciIsImVtYWlsIjoidXMqKioqKioqKkB0ZXN0c3MuY29tIn0.O4qydQ3K2Rm0dhE-GlzlA_D9eQVeu702K7blBzRKmu6I7ockmQxCM9Vh60ubJy2F3leCTjlD2_7fFxo_Ct_X6YWrkil2RkTiqj1sBuuMXNTpql407u1hIAcAbyLhphs3_wEGDH9kp7GHQn7oxIkGD5SatL4CVcl_K55gkBSdO-IsddPF01z17xPj5v0YofJ2YTXkB4h6g2eFSwtJ7g9vWse7-CZtQm7FG01nqTjb7-4PXAL7bNxkI2a3B6N6z1QtZDWOsohYPVVyeagjk3lhfhyodG2nvHI2Ohw8-F6jD_eMGRjD41PhGHOuF1irjapV8rU4BsS2eWlf0ERWEREp1A',
        'observe': 'response'
      },
      data: {
        request: {
          'program_id': this.programId,
          'collection_ids': this.collectionListForm.value.pcollections
          }
      }
    };

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
