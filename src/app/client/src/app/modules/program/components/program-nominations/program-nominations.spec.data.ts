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
    'rootOrgId': '12345',
    "userRegData": {},
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

  export const nominationListCountApiSuccessRes = {
    "id": "api.nomination.list",
    "ts": "2020-07-21T06:51:03.711Z",
    "params": {
      "resmsgid": "8b70e2f1-cb1e-11ea-b8ce-5d743730442e",
      "msgid": "8b70e2f0-cb1e-11ea-b8ce-5d743730442e",
      "status": "successful",
      "err": null,
      "errmsg": null
    },
    "responseCode": "OK",
    "result": {
      "nomination": {
        "count": 2,
        "fields": [{
          "name": "organisation_id",
          "count": 2
        }, {
          "name": "collection_ids",
          "count": 2
        }, {
          "name": "content_types",
          "count": 2
        }, {
          "name": "status",
          "fields": {
            "Approved": 2
          }
        }]
      }
    }
  };
  
  export const searchContentApiSuccessRes = {
    "id": "api.search-service.search",
    "ver": "3.0",
    "ts": "2020-07-21T07:23:48ZZ",
    "params": {
      "resmsgid": "3d03cf88-8901-46f1-bff3-eed930d4ff72",
      "msgid": null,
      "err": null,
      "status": "successful",
      "errmsg": null
    },
    "responseCode": "OK",
    "result": {
      "count": 1,
      "content": [{
        "identifier": "do_11306602332058419219935",
        "organisationId": "57c2e9ea-d038-4745-88cb-4003aa5d1270",
        "createdBy": "2754c758-047a-4baf-9d20-6f22407176cb",
        "prevStatus": "Review",
        "name": "Actual by lily 30",
        "mimeType": "application/pdf",
        "contentType": "PedagogyFlow",
        "collectionId": "do_11306599993960038419205",
        "programId": "6d6d4640-c7fe-11ea-92a2-0581aba2eb51",
        "objectType": "Content",
        "status": "Draft"
      }]
    }
  };

  export const programCollectionListApiSuccessRes = {
    "id": "api.search-service.search",
    "ver": "3.0",
    "ts": "2020-07-21T08:24:56ZZ",
    "params": {
      "resmsgid": "7b674f21-c586-4a20-af83-c932133a017e",
      "msgid": null,
      "err": null,
      "status": "successful",
      "errmsg": null
    },
    "responseCode": "OK",
    "result": {
      "count": 2,
      "content": [{
        "ownershipType": ["createdBy"],
        "copyright": "Vidya2",
        "subject": "English",
        "channel": "sunbird",
        "organisation": ["Vidya2"],
        "language": ["English"],
        "mimeType": "application/vnd.ekstep.content-collection",
        "objectType": "Content",
        "chapterCountForContribution": 2,
        "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_11234577983855001618/artifact/assets-text_177_1507053098_1507053203973.png",
        "gradeLevel": ["Class 10"],
        "appId": "dev.sunbird.portal",
        "contentEncoding": "gzip",
        "lockKey": "474c7c8f-ea4e-4a45-95e9-af0ee6cd808e",
        "contentType": "TextBook",
        "lastUpdatedBy": "cca53828-8111-4d71-9c45-40e569f13bad",
        "identifier": "do_11306599993960038419205",
        "audience": ["Learner"],
        "visibility": "Default",
        "consumerId": "fa13b438-8a3d-41b1-8278-33b0c50210e4",
        "childNodes": ["do_11306599994093568019377", "do_11306599994128793619483", "do_11306599994128793619487", "do_11306599994131251219503", "do_11306599994149273619619", "do_11306599994152550419640", "do_11306599994090291219355", "do_11306599994141081619559", "do_11306599994091110419361", "do_11306599994133708819519", "do_11306599994094387219381", "do_11306599994077184019263", "do_11306599994144358419583", "do_11306599994096025619397", "do_11306599994147635219608", "do_11306599994087014419329", "do_11306599994105036819433", "do_11306599994074726419245", "do_11306599994111590419473", "do_11306599994082099219295", "do_11306599994088652819343", "do_11306599994073088019233", "do_11306599994143539219575", "do_11306599994075545619251", "do_11306599994112409619481", "do_11306599994071449619223", "do_11306599994103398419421", "do_11306599994108313619455", "do_11306599994141900819567", "do_11306599994140262419555", "do_11306599994082918419303", "do_11306599994091929619366", "do_11306599994137804819540", "do_11306599994095206419389", "do_11306599994094387219385", "do_11306599994073907219241", "do_11306599994107494419447", "do_11306599994075545619247", "do_11306599994105856019435", "do_11306599994090291219359", "do_11306599994150912019629", "do_11306599994135347219528", "do_11306599994132889619512", "do_11306599994096025619393", "do_11306599994130432019495", "do_11306599994143539219579", "do_11306599994141900819565", "do_11306599994109132819462", "do_11306599994138624019544", "do_11306599994136985619535", "do_11306599994107494419451", "do_11306599994142720019571", "do_11306599994082099219297", "do_11306599994151731219631", "do_11306599994138624019548", "do_11306599994089472019347", "do_11306599994134528019523", "do_11306599994104217619427", "do_11306599994109132819459", "do_11306599994078003219269", "do_11306599994080460819287", "do_11306599994105856019440", "do_11306599994077184019259", "do_11306599994096844819401", "do_11306599994109952019465", "do_11306599994145996819597", "do_11306599994110771219469", "do_11306599994145996819593", "do_11306599994131251219499", "do_11306599994087833619333", "do_11306599994150092819624", "do_11306599994080460819281", "do_11306599994082918419305", "do_11306599994145177619587", "do_11306599994104217619425", "do_11306599994146816019601", "do_11306599994089472019351", "do_11306599994087833619337", "do_11306599994072268819229", "do_11306599994091929619369", "do_11306599994151731219636", "do_11306599994084556819313", "do_11306599994101760019409", "do_11306599994132070419507", "do_11306599994103398419417", "do_11306599994073907219237", "do_11306599994072268819227", "do_11306599994149273619615", "do_11306599994132889619516", "do_11306599994076364819255", "do_11306599994106675219443", "do_11306599994101760019405", "do_11306599994092748819373", "do_11306599994083737619310", "do_11306599994086195219323", "do_11306599994079641619277", "do_11306599994139443219551", "do_11306599994136166419531", "do_11306599994084556819317", "do_11306599994078822419273", "do_11306599994102579219413", "do_11306599994112409619477", "do_11306599994081280019289", "do_11306599994129612819492", "do_11306599994147635219605", "do_11306599994148454419611", "do_11306600411356364819925", "do_11306600487503462419926", "do_11306602332058419219935"],
        "mediaType": "content",
        "osId": "org.ekstep.quiz.app",
        "languageCode": ["en"],
        "graph_id": "domain",
        "nodeType": "DATA_NODE",
        "version": 2,
        "allowedContentTypes": ["TeachingMethod", "PedagogyFlow"],
        "license": "CC BY 4.0",
        "IL_FUNC_OBJECT_TYPE": "Content",
        "name": "Understanding Economic Development",
        "status": "Draft",
        "code": "org.sunbird.saWx9L",
        "origin": "do_1130052480286146561170",
        "description": "Enter description for TextBook",
        "medium": "English",
        "idealScreenSize": "normal",
        "createdOn": "2020-04-22T11:24:50.995+0000",
        "copyrightYear": 2020,
        "contentDisposition": "inline",
        "licenseterms": "By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.",
        "lastUpdatedOn": "2020-07-20T11:46:24.382+0000",
        "originData": "{\"channel\":\"012983850117177344161\"}",
        "dialcodeRequired": "No",
        "lastStatusChangedOn": "2020-04-22T11:24:50.995+0000",
        "createdFor": ["012983850117177344161"],
        "creator": "Kayal",
        "IL_SYS_NODE_TYPE": "DATA_NODE",
        "os": ["All"],
        "chapterCount": 6,
        "versionKey": "1595245584382",
        "idealScreenDensity": "hdpi",
        "framework": "ekstep_ncert_k-12",
        "depth": 0,
        "createdBy": "cca53828-8111-4d71-9c45-40e569f13bad",
        "compatibilityLevel": 1,
        "openForContribution": true,
        "IL_UNIQUE_ID": "do_11306599993960038419205",
        "board": "CBSE",
        "programId": "6d6d4640-c7fe-11ea-92a2-0581aba2eb51",
        "resourceType": "Book",
        "node_id": 18725
      }, {
        "ownershipType": ["createdBy"],
        "copyright": "Vidya2",
        "subject": "Hindi",
        "channel": "sunbird",
        "organisation": ["Vidya2"],
        "language": ["English"],
        "mimeType": "application/vnd.ekstep.content-collection",
        "objectType": "Content",
        "chapterCountForContribution": 5,
        "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_11234577983855001618/artifact/assets-text_177_1507053098_1507053203973.png",
        "gradeLevel": ["Class 6"],
        "appId": "dev.sunbird.portal",
        "contentEncoding": "gzip",
        "lockKey": "fda11b15-0fc0-4807-9a4d-4090ad78ce5b",
        "contentType": "TextBook",
        "lastUpdatedBy": "cca53828-8111-4d71-9c45-40e569f13bad",
        "identifier": "do_11306599993961676819206",
        "audience": ["Learner"],
        "visibility": "Default",
        "consumerId": "fa13b438-8a3d-41b1-8278-33b0c50210e4",
        "childNodes": ["do_11306599994087833619335", "do_11306599994150092819623", "do_11306599994059161619211", "do_11306599994228736019773", "do_11306599994236108819793", "do_11306599994149273619620", "do_11306599994163200019677", "do_11306599994172211219707", "do_11306599994231193619779", "do_11306599994301644819871", "do_11306599994106675219445", "do_11306599994164019219679", "do_11306599994299187219863", "do_11306599994304921619879", "do_11306599994073907219239", "do_11306599994140262419557", "do_11306599994229555219775", "do_11306599994307379219889", "do_11306599994082099219299", "do_11306599994087833619339", "do_11306599994147635219607", "do_11306599994223820819759", "do_11306599994159923219663", "do_11306599994163200019675", "do_11306599994304102419877", "do_11306599994241843219807", "do_11306599994089472019349", "do_11306599994211532819717", "do_11306599994073088019235", "do_11306599994219724819743", "do_11306599994309017619893", "do_11306599994303283219875", "do_11306599994165657619685", "do_11306599994300825619867", "do_11306599994301644819869", "do_11306599994241024019805", "do_11306599994172211219705", "do_11306599994235289619791", "do_11306599994147635219603", "do_11306599994080460819283", "do_11306599994128793619488", "do_11306599994104217619423", "do_11306599994223820819757", "do_11306599994294272019849", "do_11306599994075545619253", "do_11306599994094387219387", "do_11306599994132070419509", "do_11306599994160742419667", "do_11306599994071449619224", "do_11306599994107494419449", "do_11306599994078003219267", "do_11306599994148454419613", "do_11306599994128793619484", "do_11306599994138624019543", "do_11306599994079641619279", "do_11306599994242662419809", "do_11306599994093568019378", "do_11306599994223001619755", "do_11306599994167296019689", "do_11306599994149273619616", "do_11306599994240204819803", "do_11306599994131251219505", "do_11306599994250854419837", "do_11306599994102579219415", "do_11306599994141900819569", "do_11306599994310656019899", "do_11306599994130432019496", "do_11306599994143539219577", "do_11306599994157465619657", "do_11306599994173849619711", "do_11306599994232012819781", "do_11306599994076364819257", "do_11306599994085376019321", "do_11306599994210713619715", "do_11306599994164838419681", "do_11306599994232832019783", "do_11306599994236928019795", "do_11306599994165657619683", "do_11306599994058342419209", "do_11306599994298368019861", "do_11306599994091929619365", "do_11306599994305740819883", "do_11306599994131251219500", "do_11306599994295091219853", "do_11306599994105856019436", "do_11306599994150912019627", "do_11306599994151731219632", "do_11306599994170572819701", "do_11306599994100940819403", "do_11306599994111590419474", "do_11306599994132889619511", "do_11306599994078822419271", "do_11306599994078003219265", "do_11306599994173030419709", "do_11306599994220544019747", "do_11306599994312294419905", "do_11306599994329497619923", "do_11306599994109132819457", "do_11306599994096025619395", "do_11306599994218086419737", "do_11306599994088652819341", "do_11306599994057523219207", "do_11306599994096844819399", "do_11306599994218905619741", "do_11306599994225459219763", "do_11306599994077184019261", "do_11306599994129612819491", "do_11306599994244300819817", "do_11306599994224640019761", "do_11306599994239385619801", "do_11306599994059980819213", "do_11306599994166476819687", "do_11306599994246758419823", "do_11306599994247577619827", "do_11306599994138624019547", "do_11306599994215628819729", "do_11306599994251673619841", "do_11306599994294272019847", "do_11306599994110771219470", "do_11306599994078822419275", "do_11306599994227916819769", "do_11306599994091110419362", "do_11306599994152550419639", "do_11306599994242662419811", "do_11306599994155827219651", "do_11306599994109952019467", "do_11306599994216448019733", "do_11306599994073088019231", "do_11306599994069811219219", "do_11306599994326220819915", "do_11306599994169753619697", "do_11306599994087014419331", "do_11306599994095206419390", "do_11306599994297548819859", "do_11306599994244300819815", "do_11306599994094387219382", "do_11306599994250035219833", "do_11306599994103398419419", "do_11306599994243481619813", "do_11306599994162380819673", "do_11306599994227097619767", "do_11306599994136166419532", "do_11306599994161561619669", "do_11306599994143539219580", "do_11306599994145996819591", "do_11306599994221363219749", "do_11306599994159104019661", "do_11306599994308198419891", "do_11306599994233651219785", "do_11306599994311475219903", "do_11306599994218905619739", "do_11306599994089472019345", "do_11306599994249216019831", "do_11306599994112409619478", "do_11306599994074726419243", "do_11306599994220544019745", "do_11306599994081280019293", "do_11306599994300006419865", "do_11306599994213990419723", "do_11306599994313113619907", "do_11306599994296729619857", "do_11306599994146816019599", "do_11306599994324582419911", "do_11306599994174668819713", "do_11306599994212352019721", "do_11306599994092748819374", "do_11306599994295910419855", "do_11306599994217267219735", "do_11306599994245120019819", "do_11306599994295091219851", "do_11306599994068992019215", "do_11306599994108313619453", "do_11306599994084556819319", "do_11306599994168115219693", "do_11306599994233651219787", "do_11306599994082918419306", "do_11306599994293452819845", "do_11306599994083737619309", "do_11306599994327040019917", "do_11306599994159923219665", "do_11306599994167296019691", "do_11306599994155008019649", "do_11306599994136985619536", "do_11306599994153369619643", "do_11306599994328678419921", "do_11306599994151731219635", "do_11306599994222182419753", "do_11306599994154188819645", "do_11306599994091929619370", "do_11306599994161561619671", "do_11306599994237747219797", "do_11306599994251673619839", "do_11306599994155008019647", "do_11306599994145177619589", "do_11306599994080460819285", "do_11306599994141081619560", "do_11306599994090291219353", "do_11306599994309836819897", "do_11306599994081280019291", "do_11306599994248396819829", "do_11306599994230374419777", "do_11306599994109132819461", "do_11306599994135347219527", "do_11306599994142720019572", "do_11306599994325401619913", "do_11306599994169753619699", "do_11306599994082918419301", "do_11306599994069811219217", "do_11306599994139443219553", "do_11306599994304921619881", "do_11306599994101760019407", "do_11306599994086195219325", "do_11306599994310656019901", "do_11306599994090291219357", "do_11306599994171392019703", "do_11306599994327859219919", "do_11306599994141900819563", "do_11306599994212352019719", "do_11306599994228736019771", "do_11306599994144358419584", "do_11306599994306560019887", "do_11306599994309017619895", "do_11306599994133708819520", "do_11306599994292633619843", "do_11306599994226278419765", "do_11306599994087014419327", "do_11306599994250035219835", "do_11306599994132889619515", "do_11306599994237747219799", "do_11306599994134528019524", "do_11306599994145996819595", "do_11306599994156646419655", "do_11306599994084556819315", "do_11306599994105856019439", "do_11306599994156646419653", "do_11306599994234470419789", "do_11306599994302464019873", "do_11306599994075545619249", "do_11306599994305740819885", "do_11306599994070630419221", "do_11306599994102579219411", "do_11306599994247577619825", "do_11306599994158284819659", "do_11306599994245939219821", "do_11306599994214809619725", "do_11306599994168934419695", "do_11306599994137804819539", "do_11306599994216448019731", "do_11306599994105036819431", "do_11306599994214809619727", "do_11306599994222182419751", "do_11306599994324582419909", "do_11306599994104217619428", "do_11306600578779545619927"],
        "mediaType": "content",
        "osId": "org.ekstep.quiz.app",
        "languageCode": ["en"],
        "graph_id": "domain",
        "nodeType": "DATA_NODE",
        "version": 2,
        "allowedContentTypes": ["TeachingMethod", "PedagogyFlow"],
        "license": "CC BY 4.0",
        "IL_FUNC_OBJECT_TYPE": "Content",
        "name": "बाल रामकथा",
        "status": "Draft",
        "code": "org.sunbird.Drzewu",
        "origin": "do_1130052534014853121461",
        "description": "Enter description for TextBook",
        "medium": "English",
        "idealScreenSize": "normal",
        "createdOn": "2020-04-22T11:35:46.866+0000",
        "copyrightYear": 2020,
        "contentDisposition": "inline",
        "licenseterms": "By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.",
        "lastUpdatedOn": "2020-07-17T07:37:29.949+0000",
        "originData": "{\"channel\":\"012983850117177344161\"}",
        "dialcodeRequired": "No",
        "lastStatusChangedOn": "2020-04-22T11:35:46.866+0000",
        "createdFor": ["012983850117177344161"],
        "creator": "Kayal",
        "IL_SYS_NODE_TYPE": "DATA_NODE",
        "os": ["All"],
        "chapterCount": 13,
        "versionKey": "1594971449949",
        "idealScreenDensity": "hdpi",
        "framework": "ekstep_ncert_k-12",
        "depth": 0,
        "createdBy": "cca53828-8111-4d71-9c45-40e569f13bad",
        "compatibilityLevel": 1,
        "openForContribution": true,
        "IL_UNIQUE_ID": "do_11306599993961676819206",
        "board": "CBSE",
        "programId": "6d6d4640-c7fe-11ea-92a2-0581aba2eb51",
        "resourceType": "Book",
        "node_id": 18163
      }]
    }
  };

  export const approvedNominationListApiSuccessRes = {
    "id": "api.nomination.list",
    "ts": "2020-07-21T08:24:56.724Z",
    "params": {
      "resmsgid": "a8fa7541-cb2b-11ea-b8ce-5d743730442e",
      "msgid": "a8fa7540-cb2b-11ea-b8ce-5d743730442e",
      "status": "successful",
      "err": null,
      "errmsg": null
    },
    "responseCode": "OK",
    "result": [{
      "id": 12539,
      "program_id": "6d6d4640-c7fe-11ea-92a2-0581aba2eb51",
      "user_id": "48dc0e70-2775-474b-9b78-def27d047836",
      "organisation_id": "7ad82d5f-7926-4d56-80da-f07bd8bbb59f",
      "status": "Approved",
      "content_types": ["TeachingMethod", "PedagogyFlow"],
      "collection_ids": ["do_11306599993960038419205", "do_11306599993961676819206"],
      "feedback": null,
      "rolemapping": null,
      "createdby": "d27d83cd-4e20-4d1d-902a-0d148ad87afe",
      "updatedby": null,
      "createdon": "2020-07-17T07:25:05.625Z",
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
    }, {
      "id": 12540,
      "program_id": "6d6d4640-c7fe-11ea-92a2-0581aba2eb51",
      "user_id": "df6f82c9-72b8-4f61-9fce-5aa460f2061b",
      "organisation_id": "57c2e9ea-d038-4745-88cb-4003aa5d1270",
      "status": "Approved",
      "content_types": ["TeachingMethod", "PedagogyFlow"],
      "collection_ids": ["do_11306599993960038419205", "do_11306599993961676819206"],
      "feedback": null,
      "rolemapping": {
        "CONTRIBUTOR": ["2754c758-047a-4baf-9d20-6f22407176cb"]
      },
      "createdby": "a0b19c75-e947-4181-9c63-644fbba786b3",
      "updatedby": "48dc0e70-2775-474b-9b78-def27d047836",
      "createdon": "2020-07-17T07:33:16.378Z",
      "updatedon": "2020-07-17T08:10:36.968Z",
      "userData": {
        "lastName": "",
        "osUpdatedAt": "2020-07-17T07:28:19.736Z",
        "firstName": "lily29",
        "osCreatedAt": "2020-07-17T07:28:19.736Z",
        "enrolledDate": "2020-07-17T07:28:18.019Z",
        "@type": "User",
        "channel": "0130659746662727680",
        "osid": "a0b19c75-e947-4181-9c63-644fbba786b3",
        "userId": "df6f82c9-72b8-4f61-9fce-5aa460f2061b"
      },
      "orgData": {
        "osUpdatedAt": "2020-07-17T07:28:21.923Z",
        "website": "",
        "code": "LILY 29",
        "osCreatedAt": "2020-07-17T07:28:21.923Z",
        "createdBy": "a0b19c75-e947-4181-9c63-644fbba786b3",
        "@type": "Org",
        "name": "Lily 29",
        "description": "Lily 29",
        "osid": "57c2e9ea-d038-4745-88cb-4003aa5d1270"
      }
    }]
  };

  export const programDetailsTargetCollection = {
    'target_collection_category': [
        'Question paper'
    ]
  };

  export const objectCategoryDefinition = {
    'result': {
        'objectCategoryDefinition': {
            'identifier': 'obj-cat:course_collection_01309282781705830427',
            'objectMetadata': {
                'config': {
                    'frameworkMetadata': {
                        'orgFWType': [
                            'K-12',
                            'TPD'
                        ],
                        'targetFWType': [
                            'K-12'
                        ]
                    },
                    'sourcingSettings': {
                        'collection': {
                            'maxDepth': 4,
                            'objectType': 'Collection',
                            'primaryCategory': 'Course',
                            'isRoot': true,
                            'iconClass': 'fa fa-book',
                            'children': {},
                            'hierarchy': {
                                'level1': {
                                    'name': 'Course Unit',
                                    'type': 'Unit',
                                    'mimeType': 'application/vnd.ekstep.content-collection',
                                    'contentType': 'CourseUnit',
                                    'primaryCategory': 'Course Unit',
                                    'iconClass': 'fa fa-folder-o',
                                    'children': {}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  };
