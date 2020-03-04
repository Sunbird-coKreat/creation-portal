import { ResourceService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { HttpClient } from '@angular/common/http';
import { ProgramsService, PublicDataService, DataService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { IProgram } from './../../../core/interfaces';
import { UserService } from '@sunbird/core';

@Component({
    selector: 'app-create-program',
    templateUrl: './create-program.component.html',
    styleUrls: ['./create-program.component.scss']
})

export class CreateProgramComponent implements OnInit, AfterViewInit {
    /**
     * Program creation form name
     */
    createProgramForm: FormGroup;
    sbFormBuilder: FormBuilder;

    /**
     * Contains Program form data
     */
    programDetails: IProgram;

    /*
     * Contains resource service ref
     */
    public resource: ResourceService;

    showTextBookSelector = false;
    formIsInvalid = false;
    collections;
    data;
    public categoryList: {};
    pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
    pickerMinDateForEndDate = new Date(new Date().setHours(0, 0, 0, 0));

    constructor(private programsService: ProgramsService, private user: UserService, resource: ResourceService,
        private config: ConfigService, private publicDataService: PublicDataService,
        private activatedRoute: ActivatedRoute, private router: Router, private navigationHelperService: NavigationHelperService, private formBuilder: FormBuilder, private httpClient: HttpClient, ) {

        this.sbFormBuilder = formBuilder;
        this.resource = resource;
        this.user = user;
    }

    ngOnInit() {
        this.initializeFormFields();
        this.data = {
            'board': [{
                'name': 'NCERT',
                'value': 'NCERT'
            }, {
                'name': 'CBSE',
                'value': 'CBSE'
            }, {
                'name': 'ICSE',
                'value': 'ICSE'
            }, {
                'name': 'UP',
                'value': 'UP'
            }],
            'medium': [{
                'name': 'English',
                'value': 'english'
            }, {
                'name': 'Marathi',
                'value': 'Marathi'
            }, {
                'name': 'Hindi',
                'value': 'Hindi'
            }, {
                'name': 'Oriya',
                'value': 'Oriya'
            }],
            'contenttypes': [{
                'name': 'Explanation',
                'value': 'Explanation'
            }, {
                'name': 'Experiential',
                'value': 'Experiential'
            }, {
                'name': 'FocusSpot',
                'value': 'Hindi'
            }, {
                'name': 'Curiosity Sets',
                'value': 'Curiosity Sets'
            }]
        }
    }

    ngAfterViewInit() {}

    /**
     * Executed when user come from any other page or directly hit the url
     *
     * It helps to initialize form fields and apply field level validation
     */
    initializeFormFields(): void {
        this.createProgramForm = this.sbFormBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', Validators.maxLength(1000)]
        });
    }

	getProgramTextbooks(res) {		
		 const option = {
		  url: 'content/composite/v1/search',
		   data: {
			request: {
				 filters: {
					objectType: "content", 
					programId: "31ab2990-7892-11e9-8a02-93c5c62c03f1",
					status: ["Draft", "Live"], 
					contentType: "Textbook", 
					framework: "NCFCOPY", 
					board:	"NCERT",
					medium:	["English"] 
				}
			}
		  }
		};
		
		this.httpClient.post<any>(option.url, option.data).subscribe(
		  (res) => this.showTexbooklist(res), 
		  (err) => console.log(err)
		);
	}
	
	showTexbooklist (res){
		this.showTextBookSelector = true;
		this.collections = res.result.content;
	}
	
	
	saveProgramError(err) {
		console.log(err)
	}
	
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            console.log("control", control);
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

            const option = {
                url: "plugin/program/v1/create",
                data: {
                    request: {
                        name: data.name,
                        description: data.description,
                        rootOrgId: this.user.rootOrgId,
                        imagePath: null,
                        rootOrgName: null,
                        slug: "sunbird",
                        startDate: "2020-02-27T12:50:30.000Z",
                        type: "public",
                        defaultRoles: [
                            "CONTRIBUTOR"
                        ],
                         "config": {
      "_comments": "",
      "loginReqired": true,
      "framework": "NCFCOPY",
      "roles": [
        {
          "id": 1,
          "name": "CONTRIBUTOR",
          "default": true,
          "defaultTab": 1,
          "tabs": [
            1
          ]
        },
        {
          "id": 2,
          "name": "REVIEWER",
          "defaultTab": 2,
          "tabs": [
            2
          ]
        }
      ],
      "header": {
        "id": "ng.sunbird.header",
        "ver": "1.0",
        "compId": "headerComp",
        "author": "Venkat",
        "description": "",
        "publishedDate": "",
        "data": {},
        "config": {
          "tabs": [
            {
              "index": 1,
              "label": "Contribute",
              "onClick": "collectionComponent"
            },
            {
              "index": 2,
              "label": "Review",
              "onClick": "collectionComponent"
            },
            {
              "index": 3,
              "label": "Dashboard",
              "onClick": "dashboardComponent"
            }
          ]
        }
      },
      "components": [
        {
          "id": "ng.sunbird.collection",
          "ver": "1.0",
          "compId": "collectionComponent",
          "author": "Venkat",
          "description": "",
          "publishedDate": "",
          "data": {},
          "config": {
            "filters": {
              "implicit": [
                {
                  "code": "framework",
                  "defaultValue": "NCFCOPY",
                  "label": "Framework"
                },
                {
                  "code": "board",
                  "defaultValue": "NCERT",
                  "label": "Board"
                },
                {
                  "code": "medium",
				  "defaultValue": ["English"],                  
				  "label": "Medium"
                }
              ],
              "explicit": [
                {
                  "code": "gradeLevel",
                  "range": [
                    "Class 6",
                    "Class 7",
                    "Class 8"
                  ],
                  "label": "Class",
                  "multiselect": false,
                  "defaultValue": [
                    "Class 6"
                  ],
                  "visibility": true
                },
                {
                  "code": "subject",
                  "range": [
                    "English",
                    "Maths"
                  ],
                  "label": "Subject",
                  "multiselect": false,
                  "defaultValue": [
                    "English"
                  ],
                  "visibility": true
                }
              ]
            },
            "groupBy": {
              "value": "subject",
              "defaultValue": "subject"
            },
            "collectionType": "Textbook",
            "collectionList": [],
            "status": [
              "Draft",
              "Live"
            ]
          }
        },
        {
          "id": "ng.sunbird.chapterList",
          "ver": "1.0",
          "compId": "chapterListComponent",
          "author": "Kartheek",
          "description": "",
          "publishedDate": "",
          "data": {},
          "config": {
            "contentTypes": {
              "value": [
                {
                  "id": "explanationContent",
                  "label": "Explanation",
                  "onClick": "uploadComponent",
                  "mimeType": [
                    "application/pdf"
                  ],
                  "metadata": {
                    "name": "Explanation Resource",
                    "description": "ExplanationResource",
                    "resourceType": "Read",
                    "contentType": "ExplanationResource",
                    "audience": [
                      "Learner"
                    ],
                    "appIcon": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png",
                    "marks": 5
                  },
                  "filesConfig": {
                    "accepted": "pdf",
                    "size": "50"
                  }
                },
                {
                  "id": "experientialContent",
                  "label": "Experiential",
                  "onClick": "uploadComponent",
                  "mimeType": [
                    "video/mp4"
                  ],
                  "metadata": {
                    "name": "Experiential Resource",
                    "description": "ExperientialResource",
                    "resourceType": "Read",
                    "contentType": "ExperientialResource",
                    "audience": [
                      "Learner"
                    ],
                    "appIcon": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png",
                    "marks": 5
                  },
                  "filesConfig": {
                    "accepted": "mp4",
                    "size": "50"
                  }
                },
                {
                  "id": "focusSpotContent",
                  "label": "FocusSpot",
                  "onClick": "uploadComponent",
                  "mimeType": [
                    "application/pdf"
                  ],
                  "metadata": {
                    "name": "FocusSpot Resoirce",
                    "description": "FocusSpot",
                    "resourceType": "Read",
                    "contentType": "FocusSpot",
                    "audience": [
                      "Learner"
                    ],
                    "appIcon": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png",
                    "marks": 5
                  },
                  "filesConfig": {
                    "accepted": "pdf",
                    "size": "50"
                  }
                },
                {
                  "id": "vsaPracticeQuestionContent",
                  "label": "VSA - Practice Sets",
                  "onClick": "questionSetComponent",
                  "mimeType": [
                    "application/vnd.ekstep.ecml-archive"
                  ],
                  "metadata": {
                    "name": "Practice QuestionSet",
                    "description": "Practice QuestionSet",
                    "resourceType": "Learn",
                    "contentType": "PracticeQuestionSet",
                    "audience": [
                      "Learner"
                    ],
                    "appIcon": "",
                    "marks": 5
                  },
                  "questionCategories": [
                    "vsa"
                  ]
                },
                {
                  "id": "saPracticeQuestionContent",
                  "label": "SA - Practice Sets",
                  "onClick": "questionSetComponent",
                  "mimeType": [
                    "application/vnd.ekstep.ecml-archive"
                  ],
                  "metadata": {
                    "name": "Practice QuestionSet",
                    "description": "Practice QuestionSet",
                    "resourceType": "Learn",
                    "contentType": "PracticeQuestionSet",
                    "audience": [
                      "Learner"
                    ],
                    "appIcon": "",
                    "marks": 5
                  },
                  "questionCategories": [
                    "sa"
                  ]
                },
                {
                  "id": "laPracticeQuestionContent",
                  "label": "LA - Practice Sets",
                  "onClick": "questionSetComponent",
                  "mimeType": [
                    "application/vnd.ekstep.ecml-archive"
                  ],
                  "metadata": {
                    "name": "Practice QuestionSet",
                    "description": "Practice QuestionSet",
                    "resourceType": "Learn",
                    "contentType": "PracticeQuestionSet",
                    "audience": [
                      "Learner"
                    ],
                    "appIcon": "",
                    "marks": 5
                  },
                  "questionCategories": [
                    "la"
                  ]
                },
                {
                  "id": "mcqPracticeQuestionContent",
                  "label": "MCQ - Practice Sets",
                  "onClick": "questionSetComponent",
                  "mimeType": [
                    "application/vnd.ekstep.ecml-archive"
                  ],
                  "metadata": {
                    "name": "Practice QuestionSet",
                    "description": "Practice QuestionSet",
                    "resourceType": "Learn",
                    "contentType": "PracticeQuestionSet",
                    "audience": [
                      "Learner"
                    ],
                    "appIcon": "",
                    "marks": 5
                  },
                  "questionCategories": [
                    "mcq"
                  ]
                },
                {
                  "id": "curiositySetContent",
                  "label": "Curiosity Sets",
                  "onClick": "curiositySetComponent",
                  "mimeType": [
                    "application/vnd.ekstep.ecml-archive"
                  ],
                  "metadata": {
                    "name": "Curiosity QuestionSet",
                    "description": "Curiosity QuestionSet",
                    "resourceType": "Learn",
                    "contentType": "CuriosityQuestionSet",
                    "audience": [
                      "Learner"
                    ],
                    "appIcon": "",
                    "marks": 5
                  },
                  "questionCategories": [
                    "Curiosity"
                  ]
                }
              ],
              "defaultValue": [
                {
                  "id": "vsaPracticeQuestionContent",
                  "label": "Practice Sets",
                  "onClick": "questionSetComponent",
                  "mimeType": [
                    "application/vnd.ekstep.ecml-archive"
                  ],
                  "metadata": {
                    "name": "Practice QuestionSet",
                    "description": "Practice QuestionSet",
                    "resourceType": "Learn",
                    "contentType": "PracticeQuestionSet",
                    "audience": [
                      "Learner"
                    ],
                    "appIcon": "",
                    "marks": 5
                  },
                  "questionCategories": [
                    "vsa"
                  ]
                }
              ]
            }
          }
        },
        {
          "id": "ng.sunbird.uploadComponent",
          "ver": "1.0",
          "compId": "uploadContentComponent",
          "author": "Kartheek",
          "description": "",
          "publishedDate": "",
          "data": {},
          "config": {
            "filesConfig": {
              "accepted": "pdf, mp4, webm, youtube",
              "size": "50"
            },
            "formConfiguration": [
              {
                "code": "learningOutcome",
                "dataType": "list",
                "description": "Learning Outcomes For The Content",
                "editable": true,
                "inputType": "multiselect",
                "label": "Learning Outcome",
                "name": "LearningOutcome",
                "placeholder": "Select Learning Outcomes",
                "required": false,
                "visible": true
              },
              {
                "code": "bloomslevel",
                "dataType": "list",
                "description": "Learning Level For The Content",
                "editable": true,
                "inputType": "select",
                "label": "Learning Level",
                "name": "LearningLevel",
                "placeholder": "Select Learning Levels",
                "required": true,
                "visible": true,
                "deafultValue": [
                  "remember",
                  "understand",
                  "apply",
                  "analyse",
                  "evaluate",
                  "create"
                ]
              },
              {
                "code": "creator",
                "dataType": "text",
                "description": "Enter The Author Name",
                "editable": true,
                "inputType": "text",
                "label": "Author",
                "name": "Author",
                "placeholder": "Enter Author Name",
                "required": true,
                "visible": true
              },
              {
                "code": "license",
                "dataType": "list",
                "description": "License For The Content",
                "editable": true,
                "inputType": "select",
                "label": "License",
                "name": "License",
                "placeholder": "Select License",
                "required": true,
                "visible": true
              }
            ]
          }
        },
        {
          "id": "ng.sunbird.practiceSetComponent",
          "ver": "1.0",
          "compId": "practiceSetComponent",
          "author": "Kartheek",
          "description": "",
          "publishedDate": "",
          "data": {},
          "config": {
            "No of options": 4,
            "solutionType": [
              "Video",
              "Text & image"
            ],
            "questionCategory": [
              "vsa",
              "sa",
              "ls",
              "mcq",
              "curiosity"
            ],
            "formConfiguration": [
              {
                "code": "LearningOutcome",
                "range": [],
                "label": "Learning Outcome",
                "multiselect": false
              },
              {
                "code": "bloomslevel",
                "range": [],
                "label": "Learning Level",
                "multiselect": true
              }
            ]
          }
        },
        {
          "id": "ng.sunbird.dashboard",
          "ver": "1.0",
          "compId": "dashboardComp",
          "author": "Venkanna Gouda",
          "description": "",
          "publishedDate": "",
          "data": {},
          "config": {}
        }
      ],
      "actions": {
        "showTotalContribution": {
          "roles": [
            1,
            2
          ]
        },
        "showMyContribution": {
          "roles": [
            1
          ]
        },
        "showRejected": {
          "roles": [
            1
          ]
        },
        "showUnderReview": {
          "roles": [
            1
          ]
        },
        "showTotalUnderReview": {
          "roles": [
            2
          ]
        },
        "showAcceptedByMe": {
          "roles": [
            2
          ]
        },
        "showRejectedByMe": {
          "roles": [
            2
          ]
        },
        "showFilters": {
          "roles": [
            1,
            2,
            3
          ]
        },
        "addresource": {
          "roles": [
            1
          ]
        },
        "showDashboard": {
          "roles": [
            3
          ]
        },
        "showCert": {
          "roles": [
            4
          ]
        },
        "showSave": {
          "roles": [
            1
          ]
        },
        "showChangeFile": {
          "roles": [
            1
          ]
        },
        "showRequestChanges": {
          "roles": [
            2
          ]
        },
        "showPublish": {
          "roles": [
            2
          ]
        },
        "showSubmit": {
          "roles": [
            1
          ]
        }
      },
      "onBoardingForm": {
        "templateName": "onBoardingForm",
        "action": "onboard",
        "fields": [
          {
            "code": "school",
            "dataType": "text",
            "name": "School",
            "label": "School",
            "description": "School",
            "inputType": "select",
            "required": false,
            "displayProperty": "Editable",
            "visible": true,
            "range": [
              {
                "identifier": "my_school",
                "code": "my_school",
                "name": "My School",
                "description": "My School",
                "index": 1,
                "category": "school",
                "status": "Live"
              }
            ],
            "index": 1
          }
        ]
      },
      "sharedContext": [
        "channel",
        "framework",
        "board",
        "medium",
        "gradeLevel",
        "subject",
        "topic"
      ]
    }
                    }
                }
            };
           
            this.httpClient.post<any>(option.url, option.data).subscribe(
			  (res) => this.getProgramTextbooks(res),
			  (err) => this.saveProgramError(err)
			);
        } else {
            this.formIsInvalid = true;
            this.validateAllFormFields(this.createProgramForm);
        }
    }
}
