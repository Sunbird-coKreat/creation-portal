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
    'userRegData': {},
  };

  export const readProgramApiSuccessRes = {
      'id': 'api.program.read',
      'ts': '2020-07-17T06:05:06.706Z',
      'params': {
          'resmsgid': '767c4f21-c7f3-11ea-92a2-0581aba2eb51',
          'msgid': '767c4f20-c7f3-11ea-92a2-0581aba2eb51',
          'status': 'successful',
          'err': null,
          'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
          'program_id': '048e6950-c7c8-11ea-92a2-0581aba2eb51',
          'name': 'default review',
          'description': 'default review',
          'type': 'public',
          'collection_ids': ['do_1130562611465256961126'],
          'content_types': ['TeachingMethod', 'PedagogyFlow'],
          'startdate': '2020-07-17T00:54:06.388Z',
          'enddate': '2020-09-28T18:30:00.000Z',
          'nomination_enddate': '2020-07-30T18:30:00.000Z',
          'shortlisting_enddate': '2020-08-07T18:30:00.000Z',
          'content_submission_enddate': '2020-09-02T18:30:00.000Z',
          'image': null,
          'status': 'Live',
          'slug': 'sunbird',
          'config': {
              'board': 'CBSE',
              'roles': [{
                  'id': 1,
                  'name': 'CONTRIBUTOR',
                  'tabs': [1],
                  'default': true,
                  'defaultTab': 1
              }, {
                  'id': 2,
                  'name': 'REVIEWER',
                  'tabs': [2],
                  'defaultTab': 2
              }],
              'header': {
                  'id': 'ng.sunbird.header',
                  'ver': '1.0',
                  'data': {},
                  'author': 'Venkat',
                  'compId': 'headerComp',
                  'config': {
                      'tabs': [{
                          'index': 1,
                          'label': 'Contribute',
                          'onClick': 'collectionComponent'
                      }, {
                          'index': 2,
                          'label': 'Review',
                          'onClick': 'collectionComponent'
                      }, {
                          'index': 3,
                          'label': 'Dashboard',
                          'onClick': 'dashboardComponent'
                      }]
                  },
                  'description': '',
                  'publishedDate': ''
              },
              'medium': ['Hindi'],
              'actions': {
                  'showCert': {
                      'roles': [4]
                  },
                  'showEdit': {
                      'roles': [1]
                  },
                  'showSave': {
                      'roles': [1]
                  },
                  'showSubmit': {
                      'roles': [1]
                  },
                  'showFilters': {
                      'roles': [1, 2, 3]
                  },
                  'showPublish': {
                      'roles': [2]
                  },
                  'showRejected': {
                      'roles': [1]
                  },
                  'showDashboard': {
                      'roles': [3]
                  },
                  'showChangeFile': {
                      'roles': [1]
                  },
                  'showCountPanel': {
                      'roles': [1, 2]
                  },
                  'showAddResource': {
                      'roles': [1]
                  },
                  'showCreatorView': {
                      'roles': [1]
                  },
                  'showUnderReview': {
                      'roles': [1]
                  },
                  'showUpforReview': {
                      'roles': [2]
                  },
                  'showContribution': {
                      'roles': [1]
                  },
                  'showEditResource': {
                      'roles': [1]
                  },
                  'showMoveResource': {
                      'roles': [1]
                  },
                  'showReviewerView': {
                      'roles': [2]
                  },
                  'showCreateQuestion': {
                      'roles': [1]
                  },
                  'showDeleteQuestion': {
                      'roles': [1]
                  },
                  'showDeleteResource': {
                      'roles': [1]
                  },
                  'showMyContribution': {
                      'roles': [1]
                  },
                  'showRequestChanges': {
                      'roles': [2]
                  },
                  'showAawaitingReview': {
                      'roles': [2]
                  },
                  'showPreviewResource': {
                      'roles': [2]
                  },
                  'showTotalUnderReview': {
                      'roles': [2]
                  },
                  'showTotalContribution': {
                      'roles': [1]
                  }
              },
              'subject': ['Hindi'],
              '_comments': '',
              'framework': 'ekstep_ncert_k-12',
              'components': [{
                  'id': 'ng.sunbird.collection',
                  'ver': '1.0',
                  'data': {},
                  'author': 'Venkat',
                  'compId': 'collectionComponent',
                  'config': {
                      'status': ['Draft', 'Live'],
                      'filters': {
                          'explicit': [{
                              'code': 'gradeLevel',
                              'label': 'Class',
                              'range': ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3'],
                              'visibility': true,
                              'multiselect': false,
                              'defaultValue': ['Kindergarten', 'Grade 1']
                          }, {
                              'code': 'subject',
                              'label': 'Subject',
                              'range': ['English', 'Mathematics', 'Hindi'],
                              'visibility': true,
                              'multiselect': false,
                              'defaultValue': ['English']
                          }],
                          'implicit': [{
                              'code': 'framework',
                              'label': 'Framework',
                              'defaultValue': 'ekstep_ncert_k-12'
                          }, {
                              'code': 'board',
                              'label': 'Board',
                              'defaultValue': 'CBSE'
                          }, {
                              'code': 'medium',
                              'label': 'Medium',
                              'defaultValue': ['English']
                          }]
                      },
                      'groupBy': {
                          'value': 'subject',
                          'defaultValue': 'subject'
                      },
                      'collectionList': [],
                      'collectionType': 'Textbook'
                  },
                  'description': '',
                  'publishedDate': ''
              }, {
                  'id': 'ng.sunbird.chapterList',
                  'ver': '1.0',
                  'data': {},
                  'author': 'Kartheek',
                  'compId': 'chapterListComponent',
                  'config': {
                      'contentTypes': {
                          'value': [{
                              'id': 'TeachingMethod',
                              'label': 'Teaching Method',
                              'onClick': 'uploadComponent',
                              'metadata': {
                                  'name': 'Teaching Method',
                                  'marks': 5,
                                  'appIcon': 'https://example.com/focus-spot_1561727473311.thumb_1576602905573.png',
                                  'audience': ['Learner'],
                                  'contentType': 'TeachingMethod',
                                  'description': 'TeachingMethod',
                                  'resourceType': 'Read'
                              },
                              'mimeType': ['application/pdf', 'application/epub'],
                              'filesConfig': {
                                  'size': '50',
                                  'accepted': 'pdf, epub'
                              }
                          }, {
                              'id': 'PedagogyFlow',
                              'label': 'Pedagogy Flow',
                              'onClick': 'uploadComponent',
                              'metadata': {
                                  'name': 'Pedagogy Flow',
                                  'marks': 5,
                                  'appIcon': 'https://example.com//focus-spot_1561727473311.thumb_1576602905573.png',
                                  'audience': ['Learner'],
                                  'contentType': 'PedagogyFlow',
                                  'description': 'PedagogyFlow',
                                  'resourceType': 'Read'
                              },
                              'mimeType': ['application/pdf', 'application/epub'],
                              'filesConfig': {
                                  'size': '50',
                                  'accepted': 'pdf, epub'
                              }
                          }],
                          'defaultValue': [{
                              'id': 'vsaPracticeQuestionContent',
                              'label': 'Practice Sets',
                              'onClick': 'questionSetComponent',
                              'metadata': {
                                  'name': 'Practice QuestionSet',
                                  'marks': 5,
                                  'appIcon': '',
                                  'audience': ['Learner'],
                                  'contentType': 'PracticeQuestionSet',
                                  'description': 'Practice QuestionSet',
                                  'resourceType': 'Learn'
                              },
                              'mimeType': ['application/vnd.ekstep.ecml-archive'],
                              'questionCategories': ['vsa']
                          }]
                      }
                  },
                  'description': '',
                  'publishedDate': ''
              }, {
                  'id': 'ng.sunbird.uploadComponent',
                  'ver': '1.0',
                  'data': {},
                  'author': 'Kartheek',
                  'compId': 'uploadContentComponent',
                  'config': {
                      'tenantName': 'SunbirdEd',
                      'filesConfig': {
                          'size': '50',
                          'accepted': 'pdf, mp4, webm, h5p, epub'
                      },
                      'formConfiguration': [{
                          'code': 'learningOutcome',
                          'name': 'LearningOutcome',
                          'label': 'Learning Outcome',
                          'visible': true,
                          'dataType': 'list',
                          'editable': true,
                          'required': false,
                          'inputType': 'multiselect',
                          'description': 'Learning Outcomes For The Content',
                          'placeholder': 'Select Learning Outcomes'
                      }, {
                          'code': 'attributions',
                          'name': 'Attributions',
                          'label': 'Attributions',
                          'visible': true,
                          'dataType': 'list',
                          'editable': true,
                          'helpText': 'If you have relied on another work to create this Content.',
                          'required': false,
                          'inputType': 'text',
                          'description': 'Enter Attributions',
                          'placeholder': 'Enter Attributions'
                      }, {
                          'code': 'copyright',
                          'name': 'Copyright',
                          'label': 'Copyright and Year',
                          'visible': true,
                          'dataType': 'text',
                          'editable': true,
                          'helpText': 'If you are an individual, creating original Content',
                          'required': true,
                          'inputType': 'text',
                          'description': 'Enter Copyright and Year',
                          'placeholder': 'Enter Copyright and Year'
                      }, {
                          'code': 'creator',
                          'name': 'Author',
                          'label': 'Author',
                          'visible': true,
                          'dataType': 'text',
                          'editable': true,
                          'helpText': 'Provide name of creator of this Content.',
                          'required': true,
                          'inputType': 'text',
                          'description': 'Enter The Author Name',
                          'placeholder': 'Enter Author Name'
                      }, {
                          'code': 'license',
                          'name': 'License',
                          'label': 'License',
                          'visible': true,
                          'dataType': 'list',
                          'editable': true,
                          'helpText': 'Choose the most appropriate Creative Commons License for this Content',
                          'required': true,
                          'inputType': 'select',
                          'description': 'License For The Content',
                          'placeholder': 'Select License'
                      }, {
                          'code': 'contentPolicyCheck',
                          'name': 'Content Policy Check',
                          'visible': true,
                          'dataType': 'boolean',
                          'editable': false,
                          'required': true,
                          'inputType': 'checkbox'
                      }],
                      'resourceTitleLength': '200'
                  },
                  'description': '',
                  'publishedDate': ''
              }, {
                  'id': 'ng.sunbird.practiceSetComponent',
                  'ver': '1.0',
                  'data': {},
                  'author': 'Kartheek',
                  'compId': 'practiceSetComponent',
                  'config': {
                      'tenantName': '',
                      'assetConfig': {
                          'image': {
                              'size': '50',
                              'accepted': 'jpeg, png, jpg'
                          },
                          'video': {
                              'size': '50',
                              'accepted': 'pdf, mp4, webm, youtube'
                          }
                      },
                      'solutionType': ['Video', 'Text & image'],
                      'No of options': 4,
                      'questionCategory': ['vsa', 'sa', 'ls', 'mcq', 'curiosity'],
                      'formConfiguration': [{
                          'code': 'learningOutcome',
                          'name': 'LearningOutcome',
                          'label': 'Learning Outcome',
                          'visible': true,
                          'dataType': 'list',
                          'editable': true,
                          'required': false,
                          'inputType': 'multiselect',
                          'description': 'Learning Outcomes For The Content',
                          'placeholder': 'Select Learning Outcomes'
                      }, {
                          'code': 'attributions',
                          'name': 'Attributions',
                          'label': 'Attributions',
                          'visible': true,
                          'dataType': 'list',
                          'editable': true,
                          'helpText': 'If you have relied on another work to create this Content',
                          'required': false,
                          'inputType': 'text',
                          'description': 'Enter Attributions',
                          'placeholder': 'Enter Attributions'
                      }, {
                          'code': 'copyright',
                          'name': 'Copyright',
                          'label': 'Copyright and Year',
                          'visible': true,
                          'dataType': 'text',
                          'editable': true,
                          'helpText': 'If you are an individual, creating original Content.',
                          'required': true,
                          'inputType': 'text',
                          'description': 'Enter Copyright and Year',
                          'placeholder': 'Enter Copyright and Year'
                      }, {
                          'code': 'creator',
                          'name': 'Author',
                          'label': 'Author',
                          'visible': true,
                          'dataType': 'text',
                          'editable': true,
                          'helpText': 'Provide name of creator of this Content.',
                          'required': true,
                          'inputType': 'text',
                          'description': 'Enter The Author Name',
                          'placeholder': 'Enter Author Name'
                      }, {
                          'code': 'license',
                          'name': 'License',
                          'label': 'License',
                          'visible': true,
                          'dataType': 'list',
                          'editable': true,
                          'helpText': 'Choose the most appropriate Creative Commons License for this Content',
                          'required': true,
                          'inputType': 'select',
                          'description': 'License For The Content',
                          'placeholder': 'Select License'
                      }, {
                          'code': 'contentPolicyCheck',
                          'name': 'Content Policy Check',
                          'visible': true,
                          'dataType': 'boolean',
                          'editable': false,
                          'required': true,
                          'inputType': 'checkbox'
                      }],
                      'resourceTitleLength': '200'
                  },
                  'description': '',
                  'publishedDate': ''
              }, {
                  'id': 'ng.sunbird.dashboard',
                  'ver': '1.0',
                  'data': {},
                  'author': 'Venkanna Gouda',
                  'compId': 'dashboardComp',
                  'config': {},
                  'description': '',
                  'publishedDate': ''
              }],
              'gradeLevel': ['Class 10'],
              'loginReqired': true,
              'sharedContext': ['channel', 'framework', 'board', 'medium', 'gradeLevel', 'subject', 'topic'],
              'defaultContributeOrgReview': false
          },
          'rolemapping': null,
          'createdby': '48dc0e70-2775-474b-9b78-def27d047836',
          'updatedby': null,
          'createdon': '2020-07-17T00:54:06.388Z',
          'updatedon': '2020-07-17T00:54:17.411Z',
          'rootorg_id': '012983850117177344161',
          'sourcing_org_name': 'Vidya2',
          'channel': 'DIKSHA',
          'template_id': 'template1',
          'guidelines_url': ''
      }
  };

  export const readProgramApiErrorRes = {
      'id': 'api.program.read',
      'ts': '2020-07-17T11:24:49.716Z',
      'params': {
          'resmsgid': '20735741-c820-11ea-92a2-0581aba2eb51',
          'msgid': '20735740-c820-11ea-92a2-0581aba2eb51',
          'status': 'successful',
          'err': null,
          'errmsg': 'Invalid program Id'
      },
      'responseCode': 'OK',
      'result': null
  };

  export const nominationListCountApiSuccessRes = {
    'id': 'api.nomination.list',
    'ts': '2020-07-21T06:51:03.711Z',
    'params': {
      'resmsgid': '8b70e2f1-cb1e-11ea-b8ce-5d743730442e',
      'msgid': '8b70e2f0-cb1e-11ea-b8ce-5d743730442e',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'nomination': {
        'count': 2,
        'fields': [{
          'name': 'organisation_id',
          'count': 2
        }, {
          'name': 'collection_ids',
          'count': 2
        }, {
          'name': 'content_types',
          'count': 2
        }, {
          'name': 'status',
          'fields': {
            'Approved': 2
          }
        }]
      }
    }
  };

  export const searchContentApiSuccessRes = {
    'id': 'api.search-service.search',
    'ver': '3.0',
    'ts': '2020-07-21T07:23:48ZZ',
    'params': {
      'resmsgid': '3d03cf88-8901-46f1-bff3-eed930d4ff72',
      'msgid': null,
      'err': null,
      'status': 'successful',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'count': 1,
      'content': [{
        'identifier': 'do_11306602332058419219935',
        'organisationId': '57c2e9ea-d038-4745-88cb-4003aa5d1270',
        'createdBy': '2754c758-047a-4baf-9d20-6f22407176cb',
        'prevStatus': 'Review',
        'name': 'Actual by lily 30',
        'mimeType': 'application/pdf',
        'contentType': 'PedagogyFlow',
        'collectionId': 'do_11306599993960038419205',
        'programId': '6d6d4640-c7fe-11ea-92a2-0581aba2eb51',
        'objectType': 'Content',
        'status': 'Draft'
      }]
    }
  };

  export const programCollectionListApiSuccessRes = {
    'id': 'api.search-service.search',
    'ver': '3.0',
    'ts': '2020-07-21T08:24:56ZZ',
    'params': {
      'resmsgid': '7b674f21-c586-4a20-af83-c932133a017e',
      'msgid': null,
      'err': null,
      'status': 'successful',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'count': 2,
      'content': [{
        'ownershipType': ['createdBy'],
        'copyright': 'Vidya2',
        'subject': 'English',
        'channel': 'sunbird',
        'organisation': ['Vidya2'],
        'language': ['English'],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'objectType': 'Content',
        'chapterCountForContribution': 2,
        'appIcon': 'https://example.com/assets-text_177_1507053098_1507053203973.png',
        'gradeLevel': ['Class 10'],
        'appId': 'dev.sunbird.portal',
        'contentEncoding': 'gzip',
        'lockKey': '474c7c8f-ea4e-4a45-95e9-af0ee6cd808e',
        'contentType': 'TextBook',
        'lastUpdatedBy': 'cca53828-8111-4d71-9c45-40e569f13bad',
        'identifier': 'do_11306599993960038419205',
        'audience': ['Learner'],
        'visibility': 'Default',
        'consumerId': 'fa13b438-8a3d-41b1-8278-33b0c50210e4',
        'childNodes': ['do_11306599994093568019377', 'do_11306599994128793619483', 'do_11306599994128793619487'],
        'mediaType': 'content',
        'osId': 'org.ekstep.quiz.app',
        'languageCode': ['en'],
        'graph_id': 'domain',
        'nodeType': 'DATA_NODE',
        'version': 2,
        'allowedContentTypes': ['TeachingMethod', 'PedagogyFlow'],
        'license': 'CC BY 4.0',
        'IL_FUNC_OBJECT_TYPE': 'Content',
        'name': 'Understanding Economic Development',
        'status': 'Draft',
        'code': 'org.sunbird.saWx9L',
        'origin': 'do_1130052480286146561170',
        'description': 'Enter description for TextBook',
        'medium': 'English',
        'idealScreenSize': 'normal',
        'createdOn': '2020-04-22T11:24:50.995+0000',
        'copyrightYear': 2020,
        'contentDisposition': 'inline',
        'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA.',
        'lastUpdatedOn': '2020-07-20T11:46:24.382+0000',
        'originData': '{"channel":"012983850117177344161"}',
        'dialcodeRequired': 'No',
        'lastStatusChangedOn': '2020-04-22T11:24:50.995+0000',
        'createdFor': ['012983850117177344161'],
        'creator': 'Kayal',
        'IL_SYS_NODE_TYPE': 'DATA_NODE',
        'os': ['All'],
        'chapterCount': 6,
        'versionKey': '1595245584382',
        'idealScreenDensity': 'hdpi',
        'framework': 'ekstep_ncert_k-12',
        'depth': 0,
        'createdBy': 'cca53828-8111-4d71-9c45-40e569f13bad',
        'compatibilityLevel': 1,
        'openForContribution': true,
        'IL_UNIQUE_ID': 'do_11306599993960038419205',
        'board': 'CBSE',
        'programId': '6d6d4640-c7fe-11ea-92a2-0581aba2eb51',
        'resourceType': 'Book',
        'node_id': 18725
      }, {
        'ownershipType': ['createdBy'],
        'copyright': 'Vidya2',
        'subject': 'Hindi',
        'channel': 'sunbird',
        'organisation': ['Vidya2'],
        'language': ['English'],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'objectType': 'Content',
        'chapterCountForContribution': 5,
        'appIcon': 'https://example.com/assets-text_177_1507053098_1507053203973.png',
        'gradeLevel': ['Class 6'],
        'appId': 'dev.sunbird.portal',
        'contentEncoding': 'gzip',
        'lockKey': 'fda11b15-0fc0-4807-9a4d-4090ad78ce5b',
        'contentType': 'TextBook',
        'lastUpdatedBy': 'cca53828-8111-4d71-9c45-40e569f13bad',
        'identifier': 'do_11306599993961676819206',
        'audience': ['Learner'],
        'visibility': 'Default',
        'consumerId': 'fa13b438-8a3d-41b1-8278-33b0c50210e4',
        'childNodes': [
          'do_11306599994087833619335', 'do_11306599994150092819623', 'do_11306599994059161619211', 'do_11306600578779545619927'],
        'mediaType': 'content',
        'osId': 'org.ekstep.quiz.app',
        'languageCode': ['en'],
        'graph_id': 'domain',
        'nodeType': 'DATA_NODE',
        'version': 2,
        'allowedContentTypes': ['TeachingMethod', 'PedagogyFlow'],
        'license': 'CC BY 4.0',
        'IL_FUNC_OBJECT_TYPE': 'Content',
        'name': 'बाल रामकथा',
        'status': 'Draft',
        'code': 'org.sunbird.Drzewu',
        'origin': 'do_1130052534014853121461',
        'description': 'Enter description for TextBook',
        'medium': 'English',
        'idealScreenSize': 'normal',
        'createdOn': '2020-04-22T11:35:46.866+0000',
        'copyrightYear': 2020,
        'contentDisposition': 'inline',
        'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA.',
        'lastUpdatedOn': '2020-07-17T07:37:29.949+0000',
        'originData': '{"channel":"012983850117177344161"}',
        'dialcodeRequired': 'No',
        'lastStatusChangedOn': '2020-04-22T11:35:46.866+0000',
        'createdFor': ['012983850117177344161'],
        'creator': 'Kayal',
        'IL_SYS_NODE_TYPE': 'DATA_NODE',
        'os': ['All'],
        'chapterCount': 13,
        'versionKey': '1594971449949',
        'idealScreenDensity': 'hdpi',
        'framework': 'ekstep_ncert_k-12',
        'depth': 0,
        'createdBy': 'cca53828-8111-4d71-9c45-40e569f13bad',
        'compatibilityLevel': 1,
        'openForContribution': true,
        'IL_UNIQUE_ID': 'do_11306599993961676819206',
        'board': 'CBSE',
        'programId': '6d6d4640-c7fe-11ea-92a2-0581aba2eb51',
        'resourceType': 'Book',
        'node_id': 18163
      }]
    }
  };

  export const approvedNominationListApiSuccessRes = {
    'id': 'api.nomination.list',
    'ts': '2020-07-21T08:24:56.724Z',
    'params': {
      'resmsgid': 'a8fa7541-cb2b-11ea-b8ce-5d743730442e',
      'msgid': 'a8fa7540-cb2b-11ea-b8ce-5d743730442e',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': [{
      'id': 12539,
      'program_id': '6d6d4640-c7fe-11ea-92a2-0581aba2eb51',
      'user_id': '48dc0e70-2775-474b-9b78-def27d047836',
      'organisation_id': '7ad82d5f-7926-4d56-80da-f07bd8bbb59f',
      'status': 'Approved',
      'content_types': ['TeachingMethod', 'PedagogyFlow'],
      'collection_ids': ['do_11306599993960038419205', 'do_11306599993961676819206'],
      'feedback': null,
      'rolemapping': null,
      'createdby': 'd27d83cd-4e20-4d1d-902a-0d148ad87afe',
      'updatedby': null,
      'createdon': '2020-07-17T07:25:05.625Z',
      'updatedon': null,
      'userData': {
        'lastName': '',
        'osUpdatedAt': '2020-07-17T00:54:17.566Z',
        'firstName': 'kayal',
        'osCreatedAt': '2020-07-17T00:54:17.566Z',
        'enrolledDate': '2020-07-17T00:54:16.773Z',
        '@type': 'User',
        'channel': '012983850117177344161',
        'osid': 'd27d83cd-4e20-4d1d-902a-0d148ad87afe',
        'userId': '48dc0e70-2775-474b-9b78-def27d047836'
      },
      'orgData': {
        'osUpdatedAt': '2020-07-17T00:54:17.694Z',
        'code': 'VIDYA2',
        'osCreatedAt': '2020-07-17T00:54:17.694Z',
        'createdBy': 'd27d83cd-4e20-4d1d-902a-0d148ad87afe',
        '@type': 'Org',
        'name': 'Vidya2',
        'description': 'Vidya2',
        'osid': '7ad82d5f-7926-4d56-80da-f07bd8bbb59f'
      }
    }, {
      'id': 12540,
      'program_id': '6d6d4640-c7fe-11ea-92a2-0581aba2eb51',
      'user_id': 'df6f82c9-72b8-4f61-9fce-5aa460f2061b',
      'organisation_id': '57c2e9ea-d038-4745-88cb-4003aa5d1270',
      'status': 'Approved',
      'content_types': ['TeachingMethod', 'PedagogyFlow'],
      'collection_ids': ['do_11306599993960038419205', 'do_11306599993961676819206'],
      'feedback': null,
      'rolemapping': {
        'CONTRIBUTOR': ['2754c758-047a-4baf-9d20-6f22407176cb']
      },
      'createdby': 'a0b19c75-e947-4181-9c63-644fbba786b3',
      'updatedby': '48dc0e70-2775-474b-9b78-def27d047836',
      'createdon': '2020-07-17T07:33:16.378Z',
      'updatedon': '2020-07-17T08:10:36.968Z',
      'userData': {
        'lastName': '',
        'osUpdatedAt': '2020-07-17T07:28:19.736Z',
        'firstName': 'lily29',
        'osCreatedAt': '2020-07-17T07:28:19.736Z',
        'enrolledDate': '2020-07-17T07:28:18.019Z',
        '@type': 'User',
        'channel': '0130659746662727680',
        'osid': 'a0b19c75-e947-4181-9c63-644fbba786b3',
        'userId': 'df6f82c9-72b8-4f61-9fce-5aa460f2061b'
      },
      'orgData': {
        'osUpdatedAt': '2020-07-17T07:28:21.923Z',
        'website': '',
        'code': 'LILY 29',
        'osCreatedAt': '2020-07-17T07:28:21.923Z',
        'createdBy': 'a0b19c75-e947-4181-9c63-644fbba786b3',
        '@type': 'Org',
        'name': 'Lily 29',
        'description': 'Lily 29',
        'osid': '57c2e9ea-d038-4745-88cb-4003aa5d1270'
      }
    }]
  };
