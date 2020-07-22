export const addParticipentResponseSample = {
  id: 'api.add.participants',
  params: {
    status: 'successful'
  },
  responseCode: 'OK',
  result: {
    created: 'OK',
    programId: '6835f250-1fe1-11ea-93ea-2dffbaedca40'
  },
  ts: '2019-12-17T10:10:16.555Z',
  ver: '1.0'
};

export const frameWorkData = {
  'err': null,
  'frameworkdata': {
    'ekstep_ncert_k-12': {
      'identifier': 'ekstep_ncert_k-12',
      'code': 'ekstep_ncert_k-12',
      'translations': '{"hi":"एनसीएफ कॉपी","ka":"ncf ನಕಲಿಸಿ"}',
      'name': 'AP Board',
      'description': ' NCF framework..',
      'categories': [
        {
          'identifier': 'ekstep_ncert_k-12_board',
          'code': 'board',
          'terms': [
            {
              'associations': [
                {
                  'identifier': 'ekstep_ncert_k-12_gradelevel_kindergarten',
                  'code': 'kindergarten',
                  'translations': '{"hi":"बाल विहार"}',
                  'name': 'Kindergarten',
                  'description': '',
                  'category': 'gradeLevel',
                  'status': 'Live'
                },
              ],
              'identifier': 'ekstep_ncert_k-12_board_ncert',
              'code': 'ncert',
              'translations': null,
              'name': 'NCERT',
              'description': '',
              'index': 1,
              'category': 'board',
              'status': 'Live'
            },
          ],
          'translations': null,
          'name': 'Curriculum',
          'description': '',
          'index': 1,
          'status': 'Live'
        },
        {
          'identifier': 'ekstep_ncert_k-12_medium',
          'code': 'medium',
          'translations': '{"hi":"मध्यम"}',
          'name': 'Medium',
          'description': '',
          'index': 2,
          'status': 'Live'
        },
        {
          'identifier': 'ekstep_ncert_k-12_subject',
          'code': 'subject',
          'terms': [
            {
              'identifier': 'ekstep_ncert_k-12_subject_mathematics',
              'code': 'mathematics',
              'children': [
                {
                  'identifier': 'ekstep_ncert_k-12_subject_arithmetics',
                  'code': 'arithmetics',
                  'translations': null,
                  'name': 'Arithmetics',
                  'description': 'Arithmetics',
                  'index': 1,
                  'category': 'subject',
                  'status': 'Live'
                }
              ],
              'translations': null,
              'name': 'Math',
              'description': 'Mathematics',
              'index': 1,
              'category': 'subject',
              'status': 'Live'
            },
            {
              'identifier': 'ekstep_ncert_k-12_subject_malayalam',
              'code': 'malayalam',
              'translations': null,
              'name': 'Malayalam',
              'description': '',
              'index': 22,
              'category': 'subject',
              'status': 'Live'
            }
          ],
          'translations': '{"hi":"विषय"}',
          'name': 'Subject',
          'description': '',
          'index': 4,
          'status': 'Live'
        },
      ],
      'type': 'K-12',
      'objectType': 'Framework'
    }
  }
};

const onBoardingForm =  {
  'action': 'onboard',
  'fields': [
    {
      'code': 'class',
      'dataType': 'text',
      'description': 'Class',
      'displayProperty': 'Editable',
      'index': 1,
      'inputType': 'select',
      'label': 'Class',
      'name': 'Class',
      'range': [
        {
          'category': 'class',
          'code': 'class1',
          'description': 'Class 1',
          'identifier': 'Class 1',
          'index': 1,
          'name': 'Class 1',
          'status': 'Live'
        },
        {
          'category': 'class',
          'code': 'class2',
          'description': 'Class 2',
          'identifier': 'Class 2',
          'index': 2,
          'name': 'Class 2',
          'status': 'Live'
        },
        {
          'category': 'class',
          'code': 'class3',
          'description': 'Class 3',
          'identifier': 'Class 3',
          'index': 3,
          'name': 'Class 3',
          'status': 'Live'
        }
      ],
      'required': false,
      'visible': true
    }
  ],
  'templateName': 'onBoardingForm'
};

const userDetails =  {
  'programId': '453b79e0-2d2f-11ea-a48e-338d4518b681',
  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
  'onBoarded': true,
  'onBoardingData': {
    'school': 'My School'
  },
  'roles': [
    'CONTRIBUTOR'
  ]
};

// without user details
export const programDetailsWithOutUserDetails = {
  'config': {
    'framework': 'ekstep_ncert_k-12',
    'roles': [
      {
        'role': 'CONTRIBUTOR'
      },
      {
        'role': 'REVIEWER'
      }
    ],
    'header': {
      'id': 'ng.sunbird.header',
      'ver': '1.0',
      'compId': 'headerComp',
      'author': 'Venkat',
      'description': '',
      'publishedDate': '',
      'data': {},
      'config': {
        'tabs': [
          {
            'index': 1,
            'label': 'Contribute',
            'onClick': 'collectionComponent'
          },
          {
            'index': 2,
            'label': 'Review',
            'onClick': 'collectionComponent'
          },
          {
            'index': 3,
            'label': 'Dashboard',
            'onClick': 'dashboardComponent'
          }
        ]
      }
    },
    'sharedContext': [
      'channel',
      'framework',
      'board',
      'medium',
      'gradeLevel',
      'subject'
    ],
    'onBoardingForm': {...onBoardingForm},
  },
  'defaultRoles': [
    'CONTRIBUTOR'
  ],
  'description': 'hello program',
  'endDate': null,
  'name': 'CBSE',
  'programId': '6835f250-1fe1-11ea-93ea-2dffbaedca40',
  'slug': 'sunbird',
  'startDate': '2019-02-03T07:20:30.000Z',
  'status': null,
  'type': 'private'
};

export const programDetailsWithOutUserAndForm = {
  'config': {
    'framework': 'ekstep_ncert_k-12',
    'roles': [
      {
        'id': 1,
        'name': 'CONTRIBUTOR',
        'default': true,
        'defaultTab': 1,
        'tabs': [
          1,
          2
        ]
      },
      {
        'id': 2,
        'name': 'REVIEWER',
        'defaultTab': 2,
        'tabs': [
          2
        ]
      }
    ],
    'header': {
      'id': 'ng.sunbird.header',
      'ver': '1.0',
      'compId': 'headerComp',
      'author': 'Venkat',
      'description': '',
      'publishedDate': '',
      'data': {},
      'config': {
        'tabs': [
          {
            'index': 1,
            'label': 'Contribute',
            'onClick': 'collectionComponent'
          },
          {
            'index': 2,
            'label': 'Review',
            'onClick': 'collectionComponent'
          },
          {
            'index': 3,
            'label': 'Dashboard',
            'onClick': 'dashboardComponent'
          }
        ]
      }
    },
    'sharedContext': [
      'channel',
      'framework',
      'board',
      'medium',
      'gradeLevel',
      'subject'
    ]
  },
  'defaultRoles': [
    'CONTRIBUTOR'
  ],
  'description': 'hello program',
  'endDate': null,
  'name': 'CBSE',
  'programId': '6835f250-1fe1-11ea-93ea-2dffbaedca40',
  'slug': 'sunbird',
  'startDate': '2019-02-03T07:20:30.000Z',
  'status': null,
  'type': 'private'
};

export const programDetailsWithUserDetails = {
  'programId': '453b79e0-2d2f-11ea-a48e-338d4518b681',
  'config': {...programDetailsWithOutUserAndForm.config},
  'defaultRoles': [
    'CONTRIBUTOR'
  ],
  'userDetails': {...userDetails}
};

export const extFrameWorkPostData = {
  'id': 'api.add.participants',
  'responseCode': 'OK',
  'result': {
    'created': 'OK',
    'programId': '852203a0-329b-11ea-896e-e55dcdd2e76a'
  },
  'ts': '2020-01-09T04:50:45.171Z',
  'ver': '1.0'
};

export const userProfile = {
  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
  "userRegData": {},
};

export const individualUserRegData = {
  "userId": "6f2c7e13-3e0f-435e-8065-a84d481e8d92"
};

export const orgUserRegData = {
  "roles": ["user"]
};

export const orgAdminUserRegData = {
  "roles": ["admin"]
};

export const nominationByOrg = {
	"id": 12549,
	"program_id": "2ce766a0-ca92-11ea-b8ce-5d743730442e",
	"user_id": "48dc0e70-2775-474b-9b78-def27d047836",
	"organisation_id": "7ad82d5f-7926-4d56-80da-f07bd8bbb59f",
	"status": "Approved",
	"content_types": ["TeachingMethod", "PedagogyFlow", "FocusSpot", "LearningOutcomeDefinition", "PracticeQuestionSet", "MarkingSchemeRubric", "ExplanationResource", "ExperientialResource", "ClassroomTeachingVideo"],
	"collection_ids": ["do_113068320954605568110288"],
	"feedback": null,
	"rolemapping": null,
	"createdby": "d27d83cd-4e20-4d1d-902a-0d148ad87afe",
	"updatedby": null,
	"createdon": "2020-07-20T14:07:04.813Z",
	"updatedon": null,
	"userData": {
		"lastName": "",
		"osUpdatedAt": "2020-07-17T00:54:17.566Z",
		"firstName": "kayal",
		"osCreatedAt": "2020-07-17T00:54:17.566Z",
		"enrolledDate": "2020-07-17T00:54:16.773Z",
		"@type": "User",
		"channel": "012983850117177344161",
		"osid": "d27d83cd-4e20-4d1d-902a-0d148ad87afe",
		"userId": "48dc0e70-2775-474b-9b78-def27d047836"
	},
	"orgData": {
		"osUpdatedAt": "2020-07-17T00:54:17.694Z",
		"code": "VIDYA2",
		"osCreatedAt": "2020-07-17T00:54:17.694Z",
		"createdBy": "d27d83cd-4e20-4d1d-902a-0d148ad87afe",
		"@type": "Org",
		"name": "Vidya2",
		"description": "Vidya2",
		"osid": "7ad82d5f-7926-4d56-80da-f07bd8bbb59f"
	}
};

export const nominationByIndividual = {
	"id": 1620,
	"program_id": "eda2f330-ca5d-11ea-9ab7-437812f2d87e",
	"user_id": "6b054b57-f034-4add-93e2-71ade8bfc848",
	"organisation_id": null,
	"status": "Approved",
	"content_types": ["TeachingMethod", "PedagogyFlow", "FocusSpot", "LearningOutcomeDefinition", "PracticeQuestionSet", "CuriosityQuestionSet", "MarkingSchemeRubric", "ExplanationResource", "ExperientialResource", "ConceptMap", "SelfAssess", "ExplanationVideo", "ClassroomTeachingVideo", "ExplanationReadingMaterial", "PreviousBoardExamPapers", "LessonPlanResource", "LearningActivity"],
	"collection_ids": ["do_21306813691554201614005"],
	"feedback": null,
	"rolemapping": null,
	"createdby": "7377c918-ee85-425a-8548-fe746881294f",
	"updatedby": "d5b80a8b-8592-46fe-a880-3a17b194f151",
	"createdon": "2020-07-20T07:56:06.322Z",
	"updatedon": "2020-07-20T08:10:35.172Z",
	"userData": {
		"lastName": "",
		"osUpdatedAt": "2020-07-20T07:55:45.582Z",
		"firstName": "AnushaRegister",
		"osCreatedAt": "2020-07-20T07:55:45.582Z",
		"enrolledDate": "2020-07-20T07:55:45.488Z",
		"@type": "User",
		"channel": "0126796199493140480",
		"osid": "7377c918-ee85-425a-8548-fe746881294f",
		"userId": "6b054b57-f034-4add-93e2-71ade8bfc848"
	}
};

export const readProgramApiSuccessRes = {
	"id": "api.program.read",
	"ts": "2020-07-17T06:05:06.706Z",
	"params": {
		"resmsgid": "767c4f21-c7f3-11ea-92a2-0581aba2eb51",
		"msgid": "767c4f20-c7f3-11ea-92a2-0581aba2eb51",
		"status": "successful",
		"err": null,
		"errmsg": null
	},
	"responseCode": "OK",
	"result": {
		"program_id": "048e6950-c7c8-11ea-92a2-0581aba2eb51",
		"name": "default review",
		"description": "default review",
		"type": "public",
		"collection_ids": ["do_1130562611465256961126"],
		"content_types": ["TeachingMethod", "PedagogyFlow"],
		"startdate": "2020-07-17T00:54:06.388Z",
		"enddate": "2020-09-28T18:30:00.000Z",
		"nomination_enddate": "2020-07-30T18:30:00.000Z",
		"shortlisting_enddate": "2020-08-07T18:30:00.000Z",
		"content_submission_enddate": "2020-09-02T18:30:00.000Z",
		"image": null,
		"status": "Live",
		"slug": "sunbird",
		"config": {
			"board": "CBSE",
			"roles": [{
				"id": 1,
				"name": "CONTRIBUTOR",
				"tabs": [1],
				"default": true,
				"defaultTab": 1
			}, {
				"id": 2,
				"name": "REVIEWER",
				"tabs": [2],
				"defaultTab": 2
			}],
			"header": {
				"id": "ng.sunbird.header",
				"ver": "1.0",
				"data": {},
				"author": "Venkat",
				"compId": "headerComp",
				"config": {
					"tabs": [{
						"index": 1,
						"label": "Contribute",
						"onClick": "collectionComponent"
					}, {
						"index": 2,
						"label": "Review",
						"onClick": "collectionComponent"
					}, {
						"index": 3,
						"label": "Dashboard",
						"onClick": "dashboardComponent"
					}]
				},
				"description": "",
				"publishedDate": ""
			},
			"medium": ["Hindi"],
			"actions": {
				"showCert": {
					"roles": [4]
				},
				"showEdit": {
					"roles": [1]
				},
				"showSave": {
					"roles": [1]
				},
				"showSubmit": {
					"roles": [1]
				},
				"showFilters": {
					"roles": [1, 2, 3]
				},
				"showPublish": {
					"roles": [2]
				},
				"showRejected": {
					"roles": [1]
				},
				"showDashboard": {
					"roles": [3]
				},
				"showChangeFile": {
					"roles": [1]
				},
				"showCountPanel": {
					"roles": [1, 2]
				},
				"showAddResource": {
					"roles": [1]
				},
				"showCreatorView": {
					"roles": [1]
				},
				"showUnderReview": {
					"roles": [1]
				},
				"showUpforReview": {
					"roles": [2]
				},
				"showContribution": {
					"roles": [1]
				},
				"showEditResource": {
					"roles": [1]
				},
				"showMoveResource": {
					"roles": [1]
				},
				"showReviewerView": {
					"roles": [2]
				},
				"showCreateQuestion": {
					"roles": [1]
				},
				"showDeleteQuestion": {
					"roles": [1]
				},
				"showDeleteResource": {
					"roles": [1]
				},
				"showMyContribution": {
					"roles": [1]
				},
				"showRequestChanges": {
					"roles": [2]
				},
				"showAawaitingReview": {
					"roles": [2]
				},
				"showPreviewResource": {
					"roles": [2]
				},
				"showTotalUnderReview": {
					"roles": [2]
				},
				"showTotalContribution": {
					"roles": [1]
				}
			},
			"subject": ["Hindi"],
			"_comments": "",
			"framework": "ekstep_ncert_k-12",
			"components": [{
				"id": "ng.sunbird.collection",
				"ver": "1.0",
				"data": {},
				"author": "Venkat",
				"compId": "collectionComponent",
				"config": {
					"status": ["Draft", "Live"],
					"filters": {
						"explicit": [{
							"code": "gradeLevel",
							"label": "Class",
							"range": ["Kindergarten", "Grade 1", "Grade 2", "Grade 3"],
							"visibility": true,
							"multiselect": false,
							"defaultValue": ["Kindergarten", "Grade 1"]
						}, {
							"code": "subject",
							"label": "Subject",
							"range": ["English", "Mathematics", "Hindi"],
							"visibility": true,
							"multiselect": false,
							"defaultValue": ["English"]
						}],
						"implicit": [{
							"code": "framework",
							"label": "Framework",
							"defaultValue": "ekstep_ncert_k-12"
						}, {
							"code": "board",
							"label": "Board",
							"defaultValue": "CBSE"
						}, {
							"code": "medium",
							"label": "Medium",
							"defaultValue": ["English"]
						}]
					},
					"groupBy": {
						"value": "subject",
						"defaultValue": "subject"
					},
					"collectionList": [],
					"collectionType": "Textbook"
				},
				"description": "",
				"publishedDate": ""
			}, {
				"id": "ng.sunbird.chapterList",
				"ver": "1.0",
				"data": {},
				"author": "Kartheek",
				"compId": "chapterListComponent",
				"config": {
					"contentTypes": {
						"value": [{
							"id": "TeachingMethod",
							"label": "Teaching Method",
							"onClick": "uploadComponent",
							"metadata": {
								"name": "Teaching Method",
								"marks": 5,
								"appIcon": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png",
								"audience": ["Learner"],
								"contentType": "TeachingMethod",
								"description": "TeachingMethod",
								"resourceType": "Read"
							},
							"mimeType": ["application/pdf", "application/epub"],
							"filesConfig": {
								"size": "50",
								"accepted": "pdf, epub"
							}
						}, {
							"id": "PedagogyFlow",
							"label": "Pedagogy Flow",
							"onClick": "uploadComponent",
							"metadata": {
								"name": "Pedagogy Flow",
								"marks": 5,
								"appIcon": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png",
								"audience": ["Learner"],
								"contentType": "PedagogyFlow",
								"description": "PedagogyFlow",
								"resourceType": "Read"
							},
							"mimeType": ["application/pdf", "application/epub"],
							"filesConfig": {
								"size": "50",
								"accepted": "pdf, epub"
							}
						}],
						"defaultValue": [{
							"id": "vsaPracticeQuestionContent",
							"label": "Practice Sets",
							"onClick": "questionSetComponent",
							"metadata": {
								"name": "Practice QuestionSet",
								"marks": 5,
								"appIcon": "",
								"audience": ["Learner"],
								"contentType": "PracticeQuestionSet",
								"description": "Practice QuestionSet",
								"resourceType": "Learn"
							},
							"mimeType": ["application/vnd.ekstep.ecml-archive"],
							"questionCategories": ["vsa"]
						}]
					}
				},
				"description": "",
				"publishedDate": ""
			}, {
				"id": "ng.sunbird.uploadComponent",
				"ver": "1.0",
				"data": {},
				"author": "Kartheek",
				"compId": "uploadContentComponent",
				"config": {
					"tenantName": "SunbirdEd",
					"filesConfig": {
						"size": "50",
						"accepted": "pdf, mp4, webm, h5p, epub"
					},
					"formConfiguration": [{
						"code": "learningOutcome",
						"name": "LearningOutcome",
						"label": "Learning Outcome",
						"visible": true,
						"dataType": "list",
						"editable": true,
						"required": false,
						"inputType": "multiselect",
						"description": "Learning Outcomes For The Content",
						"placeholder": "Select Learning Outcomes"
					}, {
						"code": "attributions",
						"name": "Attributions",
						"label": "Attributions",
						"visible": true,
						"dataType": "list",
						"editable": true,
						"helpText": "If you have relied on another work to create this Content, provide the name of that creator and the source of that work.",
						"required": false,
						"inputType": "text",
						"description": "Enter Attributions",
						"placeholder": "Enter Attributions"
					}, {
						"code": "copyright",
						"name": "Copyright",
						"label": "Copyright and Year",
						"visible": true,
						"dataType": "text",
						"editable": true,
						"helpText": "If you are an individual, creating original Content, you are the copyright holder. If you are creating Content on behalf of an organisation, the organisation may be the copyright holder. Please fill as <Name of copyright holder>, <Year of publication>",
						"required": true,
						"inputType": "text",
						"description": "Enter Copyright and Year",
						"placeholder": "Enter Copyright and Year"
					}, {
						"code": "creator",
						"name": "Author",
						"label": "Author",
						"visible": true,
						"dataType": "text",
						"editable": true,
						"helpText": "Provide name of creator of this Content.",
						"required": true,
						"inputType": "text",
						"description": "Enter The Author Name",
						"placeholder": "Enter Author Name"
					}, {
						"code": "license",
						"name": "License",
						"label": "License",
						"visible": true,
						"dataType": "list",
						"editable": true,
						"helpText": "Choose the most appropriate Creative Commons License for this Content",
						"required": true,
						"inputType": "select",
						"description": "License For The Content",
						"placeholder": "Select License"
					}, {
						"code": "contentPolicyCheck",
						"name": "Content Policy Check",
						"visible": true,
						"dataType": "boolean",
						"editable": false,
						"required": true,
						"inputType": "checkbox"
					}],
					"resourceTitleLength": "200"
				},
				"description": "",
				"publishedDate": ""
			}, {
				"id": "ng.sunbird.practiceSetComponent",
				"ver": "1.0",
				"data": {},
				"author": "Kartheek",
				"compId": "practiceSetComponent",
				"config": {
					"tenantName": "",
					"assetConfig": {
						"image": {
							"size": "50",
							"accepted": "jpeg, png, jpg"
						},
						"video": {
							"size": "50",
							"accepted": "pdf, mp4, webm, youtube"
						}
					},
					"solutionType": ["Video", "Text & image"],
					"No of options": 4,
					"questionCategory": ["vsa", "sa", "ls", "mcq", "curiosity"],
					"formConfiguration": [{
						"code": "learningOutcome",
						"name": "LearningOutcome",
						"label": "Learning Outcome",
						"visible": true,
						"dataType": "list",
						"editable": true,
						"required": false,
						"inputType": "multiselect",
						"description": "Learning Outcomes For The Content",
						"placeholder": "Select Learning Outcomes"
					}, {
						"code": "attributions",
						"name": "Attributions",
						"label": "Attributions",
						"visible": true,
						"dataType": "list",
						"editable": true,
						"helpText": "If you have relied on another work to create this Content, provide the name of that creator and the source of that work.",
						"required": false,
						"inputType": "text",
						"description": "Enter Attributions",
						"placeholder": "Enter Attributions"
					}, {
						"code": "copyright",
						"name": "Copyright",
						"label": "Copyright and Year",
						"visible": true,
						"dataType": "text",
						"editable": true,
						"helpText": "If you are an individual, creating original Content, you are the copyright holder. If you are creating Content on behalf of an organisation, the organisation may be the copyright holder. Please fill as <Name of copyright holder>, <Year of publication>",
						"required": true,
						"inputType": "text",
						"description": "Enter Copyright and Year",
						"placeholder": "Enter Copyright and Year"
					}, {
						"code": "creator",
						"name": "Author",
						"label": "Author",
						"visible": true,
						"dataType": "text",
						"editable": true,
						"helpText": "Provide name of creator of this Content.",
						"required": true,
						"inputType": "text",
						"description": "Enter The Author Name",
						"placeholder": "Enter Author Name"
					}, {
						"code": "license",
						"name": "License",
						"label": "License",
						"visible": true,
						"dataType": "list",
						"editable": true,
						"helpText": "Choose the most appropriate Creative Commons License for this Content",
						"required": true,
						"inputType": "select",
						"description": "License For The Content",
						"placeholder": "Select License"
					}, {
						"code": "contentPolicyCheck",
						"name": "Content Policy Check",
						"visible": true,
						"dataType": "boolean",
						"editable": false,
						"required": true,
						"inputType": "checkbox"
					}],
					"resourceTitleLength": "200"
				},
				"description": "",
				"publishedDate": ""
			}, {
				"id": "ng.sunbird.dashboard",
				"ver": "1.0",
				"data": {},
				"author": "Venkanna Gouda",
				"compId": "dashboardComp",
				"config": {},
				"description": "",
				"publishedDate": ""
			}],
			"gradeLevel": ["Class 10"],
			"loginReqired": true,
			"sharedContext": ["channel", "framework", "board", "medium", "gradeLevel", "subject", "topic"],
			"defaultContributeOrgReview": false
		},
		"rolemapping": null,
		"createdby": "48dc0e70-2775-474b-9b78-def27d047836",
		"updatedby": null,
		"createdon": "2020-07-17T00:54:06.388Z",
		"updatedon": "2020-07-17T00:54:17.411Z",
		"rootorg_id": "012983850117177344161",
		"sourcing_org_name": "Vidya2",
		"channel": "DIKSHA",
		"template_id": "template1",
		"guidelines_url": ""
	}
};

export const readProgramApiErrorRes = {
	"id": "api.program.read",
	"ts": "2020-07-17T11:24:49.716Z",
	"params": {
		"resmsgid": "20735741-c820-11ea-92a2-0581aba2eb51",
		"msgid": "20735740-c820-11ea-92a2-0581aba2eb51",
		"status": "successful",
		"err": null,
		"errmsg": "Invalid program Id"
	},
	"responseCode": "OK",
	"result": null
};

export const preferenceApiSuccessRes = {
	"id": "api.preference.create",
	"ver": "1.0",
	"ts": "2020-07-22T11:48:37.951Z",
	"params": {
		"resmsgid": "47cf74f0-cc11-11ea-b8ce-5d743730442e",
		"msgid": "49dadf80-d9fa-bbf7-a68c-023b056dd4de",
		"status": "successful",
		"err": null,
		"errmsg": null
	},
	"responseCode": "OK",
	"result": {
		"user_id": "48dc0e70-2775-474b-9b78-def27d047836",
		"program_id": "509f4fc0-cbf7-11ea-b8ce-5d743730442e",
		"type": "contributor",
		"sourcing_preference": {},
		"contributor_preference": {
			"medium": ["English"],
			"subject": ["Hindi"],
			"gradeLevel": ["Class 10"]
		}
	}
};

export const preferenceApiErrorRes = {
	"id": "api.preference.create",
	"ver": "1.0",
	"ts": "2020-07-22T11:48:37.951Z",
	"params": {
		"resmsgid": "47cf74f0-cc11-11ea-b8ce-5d743730442e",
		"msgid": "49dadf80-d9fa-bbf7-a68c-023b056dd4de",
		"status": "successful",
		"err": null,
		"errmsg": "Failed to create the user preferences"
	},
	"responseCode": "OK",
	"result": null
};
