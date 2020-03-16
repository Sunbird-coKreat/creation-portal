import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToasterService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import * as _ from 'lodash-es';
import { UserService, FrameworkService, EnrollContributorService} from '@sunbird/core';
import { tap, first , map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subscription, Subject, interval ,} from 'rxjs';
import { ServerResponse, RequestParam, HttpOptions } from '@sunbird/shared';
import { of as observableOf, throwError as observableThrowError, Observable  } from 'rxjs';

@Component({
  selector: 'app-enroll-contributor',
  templateUrl: './enroll-contributor.component.html',
  styleUrls: ['./enroll-contributor.component.scss']
})
export class EnrollContributorComponent implements OnInit {
  public enrollAsOrg = false;
  public enrollDetails = {};
  public userProfile: any;
  public programScope = {};
  frameworkdetails;
  contentType = {
    'contentType': [{
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

  options;
  disableSubmit = false;
  public contributeForm:any;
  @Output() close = new EventEmitter<any>();

  constructor(private tosterService: ToasterService, public userService: UserService, public frameworkService : FrameworkService, public toasterService : ToasterService, public formBuilder: FormBuilder, public http: HttpClient, public enrollContributorService : EnrollContributorService ) { }

  ngOnInit(): void {
    this.userProfile = this.userService.userProfile;
    console.log(this.userProfile)
    this.fetchFrameWorkDetails();
    this.initializeFormFields();
  }

  fetchFrameWorkDetails() {
    let instance = this;
    this.frameworkService.initialize(this.userProfile.framework.id);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        instance.frameworkdetails = frameworkDetails.frameworkdata[this.userProfile.framework.id[0]].categories; 
        this.generateenrollDetailsFields(instance.frameworkdetails);
      }
    }, error => {
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.warning(errorMes || 'Fetching framework details failed');
    });
  }

  generateenrollDetailsFields(fields) {
    fields.forEach( (element) => {
      this.enrollDetails[element['code']] = element['terms'];
    });
  }

  initializeFormFields(): void {
    this.contributeForm = this.formBuilder.group({
        board: ['', Validators.required],
        medium: ['', Validators.required],
        gradeLevel: ['', Validators.required],
        subject: ['', Validators.required],
        contentTypes: [],
        name: ['', Validators.required],
        description: ['', Validators.required],
    });
  }

  saveUser() {
    
   if(this.enrollAsOrg === false)
   {
      const User = {
        ...this.contributeForm.value
        
    };
      User['firstName'] =  this.userProfile.firstName;
      User['firstName'] =  this.userProfile.firstName;
      User['userId'] =  this.userProfile.identifier;
      User['certificates'] =  "";
      User['channel'] = "sunbird";
      this.enrollUser(User);
   }
   if(this.enrollAsOrg === true)
   {
      const Org = {
        ...this.contributeForm.value
        
    };

      Org['createdBy'] =  this.userProfile.identifier;
      Org['code'] = "COde";
      this.enrollAsOrganisation(Org);
   }
    //data['enrolledDate'] = "23-3-2020";
    // this.enrollUser(data).subscribe(
    //   (res) => this.saveSuccess(res),
    //   (err) => this.saveError(err),
    // );
    
  }
  enrollUser(User)
  {
    const option =
    {
      id : "open-saber.registry.create",
      ver: "1.0",
      request:
      {
        User
      }
    }
    const httpOptions: HttpOptions = {
          headers: {
            'Content-Type' : "application/json",
            'Authorization' : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhMzRmNjM3NTM4ZTg0MTc3OWVlNjMwM2FkYzExNDY0NCJ9.RpY7PL4ASDLNOU9xMCKXZtDF4vUPuMTDVO6keh4kI1M"
          }
        };
       // this.saveData(option);
        // return this.http.post("http://dock.sunbirded.org/" + "api/reg/add", option, httpOptions).pipe(
        //   ((data) => {
        //     // if (data.responseCode !== 'OK') {
        //     //   return observableThrowError(data);
        //     // }
        //     return observableOf(data);
        //   }));
        this.http.post<any>("http://dock.sunbirded.org/api/reg/add", option, httpOptions).subscribe(
          (res) => {
                  console.log(res);
                }, 
          (err) => {
            console.log(err);
            // TODO: navigate to program list page
            const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
           // instance.toasterService.warning(errorMes || 'Fetching textbooks failed');
          }
        );
     }
  enrollAsOrganisation(Org)
  {
    const option =
    {
      id : "open-saber.registry.create",
      ver: "1.0",
      ets: "11234",
      params: {
        did: "",
        key: "",
        msgid: ""    
      },
      request:
      {
        Org
      }
    }
    //this.saveData(option);
    const httpOptions: HttpOptions = {
          headers: {
            'Content-Type' : "application/json",
            'Authorization' : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhMzRmNjM3NTM4ZTg0MTc3OWVlNjMwM2FkYzExNDY0NCJ9.RpY7PL4ASDLNOU9xMCKXZtDF4vUPuMTDVO6keh4kI1M"
          }
        };
        this.http.post<any>("http://dock.sunbirded.org/api/reg/add", option, httpOptions).subscribe(
          (res) => {
                  console.log(res);
                }, 
          (err) => {
            console.log(err);
            // TODO: navigate to program list page
            const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
           // instance.toasterService.warning(errorMes || 'Fetching textbooks failed');
          }
        );
  }
  saveData(option)
  {
    this.enrollContributorService.enrollContributor(option).subscribe(
      (res) => {console.log(res)},
      (err) => { console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
      }
    );
  }
  saveSuccess(res)
  {
    console.log(res.result, "this is saved with the success");
    this.tosterService.success("You are successfully enrolled as a contributor!");
    this.closeModal();
  }

  saveError(error)
  {
    console.log(error, "this is not saved with the following error")
    this.tosterService.success("You are NOT enrolled as a contributor!");
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }

}





