// tslint:disable:max-line-length
export let programContext = {
    'programId': 'e418dd20-5889-11ea-9029-838ad02df8ba',
    'config': {
      '_comments': '',
      'loginReqired': true,
      'framework': 'NCFCOPY',
      'roles': [
        {
          'id': 1,
          'name': 'CONTRIBUTOR',
          'default': true,
          'defaultTab': 1,
          'tabs': [
            1
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
              'onClick': 'collectionComponent',
              'visibility': true
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
      'components': [
        {
          'id': 'ng.sunbird.collection',
          'ver': '1.0',
          'compId': 'collectionComponent',
          'author': 'Venkat',
          'description': '',
          'publishedDate': '',
          'data': {},
          'config': {
            'filters': {
              'implicit': [
                {
                  'code': 'framework',
                  'defaultValue': 'NCFCOPY',
                  'label': 'Framework'
                },
                {
                  'code': 'board',
                  'defaultValue': 'NCERT',
                  'label': 'Board'
                },
                {
                  'code': 'medium',
                  'defaultValue': [
                    'English'
                  ],
                  'label': 'Medium'
                }
              ],
              'explicit': [
                {
                  'code': 'gradeLevel',
                  'range': [
                    'Kindergarten',
                    'Grade 1',
                    'Grade 2',
                    'Grade 3'
                  ],
                  'label': 'Class',
                  'multiselect': false,
                  'defaultValue': [
                    'Kindergarten',
                    'Grade 1'
                  ],
                  'visibility': true
                },
                {
                  'code': 'subject',
                  'range': [
                    'English',
                    'Mathematics',
                    'Hindi'
                  ],
                  'label': 'Subject',
                  'multiselect': false,
                  'defaultValue': [
                    'English'
                  ],
                  'visibility': true
                }
              ]
            },
            'groupBy': {
              'value': 'subject',
              'defaultValue': 'subject'
            },
            'collectionType': 'Textbook',
            'collectionList': [],
            'status': [
              'Draft',
              'Live'
            ]
          }
        },
        {
          'id': 'ng.sunbird.chapterList',
          'ver': '1.0',
          'compId': 'chapterListComponent',
          'author': 'Kartheek',
          'description': '',
          'publishedDate': '',
          'data': {},
          'config': {
            'contentTypes': {
              'value': [
                {
                  'id': 'explanationContent',
                  'label': 'Explanation',
                  'onClick': 'uploadComponent',
                  'mimeType': [
                    'application/pdf'
                  ],
                  'metadata': {
                    'name': 'Explanation Resource',
                    'description': 'ExplanationResource',
                    'resourceType': 'Read',
                    'contentType': 'ExplanationResource',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31280847585016217619710/artifact/explanation.thumb.png',
                    'marks': 5
                  },
                  'filesConfig': {
                    'accepted': 'pdf',
                    'size': '50'
                  }
                },
                {
                  'id': 'experientialContent',
                  'label': 'Experiential',
                  'onClick': 'uploadComponent',
                  'mimeType': [
                    'video/mp4'
                  ],
                  'metadata': {
                    'name': 'Experiential Resource',
                    'description': 'ExperientialResource',
                    'resourceType': 'Read',
                    'contentType': 'ExperientialResource',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31280561379920281615017/artifact/experiential.thumb.png',
                    'marks': 5
                  },
                  'filesConfig': {
                    'accepted': 'mp4',
                    'size': '50'
                  }
                },
                {
                  'id': 'focusSpotContent',
                  'label': 'FocusSpot',
                  'onClick': 'uploadComponent',
                  'mimeType': [
                    'application/pdf'
                  ],
                  'metadata': {
                    'name': 'FocusSpot Resource',
                    'description': 'FocusSpot',
                    'resourceType': 'Read',
                    'contentType': 'FocusSpot',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31291455031832576019477/artifact/3_1535000262441.thumb.png',
                    'marks': 5
                  },
                  'filesConfig': {
                    'accepted': 'pdf',
                    'size': '50'
                  }
                },
                {
                  'id': 'interactiveContent',
                  'label': 'Interactive',
                  'onClick': 'editorComponent',
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'metadata': {
                    'name': 'InteractiveResource',
                    'description': 'InteractiveResource',
                    'resourceType': 'Learn',
                    'contentType': 'Resource',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31280847585016217619710/artifact/explanation.thumb.png',
                    'marks': 5
                  },
                  'filesConfig': {
                    'accepted': 'pdf',
                    'size': '50'
                  }
                },
                {
                  'id': 'vsaPracticeQuestionContent',
                  'label': 'VSA - Practice Sets',
                  'onClick': 'questionSetComponent',
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'metadata': {
                    'name': 'Practice QuestionSet',
                    'description': 'Practice QuestionSet',
                    'resourceType': 'Learn',
                    'contentType': 'PracticeQuestionSet',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'vsa'
                  ]
                },
                {
                  'id': 'saPracticeQuestionContent',
                  'label': 'SA - Practice Sets',
                  'onClick': 'questionSetComponent',
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'metadata': {
                    'name': 'Practice QuestionSet',
                    'description': 'Practice QuestionSet',
                    'resourceType': 'Learn',
                    'contentType': 'PracticeQuestionSet',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'sa'
                  ]
                },
                {
                  'id': 'laPracticeQuestionContent',
                  'label': 'LA - Practice Sets',
                  'onClick': 'questionSetComponent',
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'metadata': {
                    'name': 'Practice QuestionSet',
                    'description': 'Practice QuestionSet',
                    'resourceType': 'Learn',
                    'contentType': 'PracticeQuestionSet',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'la'
                  ]
                },
                {
                  'id': 'mcqPracticeQuestionContent',
                  'label': 'MCQ - Practice Sets',
                  'onClick': 'questionSetComponent',
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'metadata': {
                    'name': 'Practice QuestionSet',
                    'description': 'Practice QuestionSet',
                    'resourceType': 'Learn',
                    'contentType': 'PracticeQuestionSet',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'mcq'
                  ]
                },
                {
                  'id': 'curiositySetContent',
                  'label': 'Curiosity Sets',
                  'onClick': 'curiositySetComponent',
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'metadata': {
                    'name': 'Curiosity QuestionSet',
                    'description': 'Curiosity QuestionSet',
                    'resourceType': 'Learn',
                    'contentType': 'CuriosityQuestionSet',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'curiosity'
                  ]
                }
              ],
              'defaultValue': [
                {
                  'id': 'vsaPracticeQuestionContent',
                  'label': 'Practice Sets',
                  'onClick': 'questionSetComponent',
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'metadata': {
                    'name': 'Practice QuestionSet',
                    'description': 'Practice QuestionSet',
                    'resourceType': 'Learn',
                    'contentType': 'PracticeQuestionSet',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'vsa'
                  ]
                }
              ]
            }
          }
        },
        {
          'id': 'ng.sunbird.uploadComponent',
          'ver': '1.0',
          'compId': 'uploadContentComponent',
          'author': 'Kartheek',
          'description': '',
          'publishedDate': '',
          'data': {},
          'config': {
            'filesConfig': {
              'accepted': 'pdf, mp4, webm, youtube',
              'size': '50'
            },
            'formConfiguration': [
              {
                'code': 'learningOutcome',
                'dataType': 'list',
                'description': 'Learning Outcomes For The Content',
                'editable': true,
                'inputType': 'multiselect',
                'label': 'Learning Outcome',
                'name': 'LearningOutcome',
                'placeholder': 'Select Learning Outcomes',
                'required': false,
                'visible': true
              },
              {
                'code': 'bloomslevel',
                'dataType': 'list',
                'description': 'Learning Level For The Content',
                'editable': true,
                'inputType': 'select',
                'label': 'Learning Level',
                'name': 'LearningLevel',
                'placeholder': 'Select Learning Levels',
                'required': true,
                'visible': true,
                'defaultValue': [
                  'remember',
                  'understand',
                  'apply',
                  'analyse',
                  'evaluate',
                  'create'
                ]
              },
              {
                'code': 'creator',
                'dataType': 'text',
                'description': 'Enter The Author Name',
                'editable': true,
                'inputType': 'text',
                'label': 'Author',
                'name': 'Author',
                'placeholder': 'Enter Author Name',
                'required': true,
                'visible': true
              },
              {
                'code': 'license',
                'dataType': 'list',
                'description': 'License For The Content',
                'editable': true,
                'inputType': 'select',
                'label': 'License',
                'name': 'License',
                'placeholder': 'Select License',
                'required': true,
                'visible': true
              }
            ],
            'resourceTitleLength': '200',
            'tenantName': 'SunbirdEd'
          }
        },
        {
          'id': 'ng.sunbird.practiceSetComponent',
          'ver': '1.0',
          'compId': 'practiceSetComponent',
          'author': 'Kartheek',
          'description': '',
          'publishedDate': '',
          'data': {},
          'config': {
            'No of options': 4,
            'solutionType': [
              'Video',
              'Text & image'
            ],
            'questionCategory': [
              'vsa',
              'sa',
              'ls',
              'mcq',
              'curiosity'
            ],
            'formConfiguration': [
              {
                'code': 'learningOutcome',
                'dataType': 'list',
                'description': 'Learning Outcomes For The Content',
                'editable': true,
                'inputType': 'multiselect',
                'label': 'Learning Outcome',
                'name': 'LearningOutcome',
                'placeholder': 'Select Learning Outcomes',
                'required': false,
                'visible': true
              },
              {
                'code': 'bloomsLevel',
                'dataType': 'list',
                'description': 'Learning Level For The Content',
                'editable': true,
                'inputType': 'multiselect',
                'label': 'Learning Level',
                'name': 'LearningLevel',
                'placeholder': 'Select Learning Levels',
                'required': true,
                'visible': true,
                'defaultValue': [
                  'remember',
                  'understand',
                  'apply',
                  'analyse',
                  'evaluate',
                  'create'
                ]
              },
              {
                'code': 'creator',
                'dataType': 'text',
                'description': 'Enter The Author Name',
                'editable': true,
                'inputType': 'text',
                'label': 'Author',
                'name': 'Author',
                'placeholder': 'Enter Author Name',
                'required': true,
                'visible': true
              },
              {
                'code': 'license',
                'dataType': 'list',
                'description': 'License For The Content',
                'editable': true,
                'inputType': 'select',
                'label': 'License',
                'name': 'License',
                'placeholder': 'Select License',
                'required': true,
                'visible': true
              }
            ],
            'resourceTitleLength': '200',
            'tenantName': '',
            'assetConfig': {
              'image': {
                'size': '50',
                'accepted': 'png, jpeg, jpg'
              },
              'video': {
                'size': '50',
                'accepted': 'pdf, mp4, webm, youtube'
              }
            }
          }
        },
        {
          'id': 'ng.sunbird.dashboard',
          'ver': '1.0',
          'compId': 'dashboardComp',
          'author': 'Venkanna Gouda',
          'description': '',
          'publishedDate': '',
          'data': {},
          'config': {}
        }
      ],
      'actions': {
        'showCountPanel': {
          'roles': [
            1,
            2
          ]
        },
        'showContribution': {
          'roles': [
            1
          ]
        },
        'showUpforReview': {
          'roles': [
            2
          ]
        },
        'showTotalContribution': {
          'roles': [
            1
          ]
        },
        'showMyContribution': {
          'roles': [
            1
          ]
        },
        'showRejected': {
          'roles': [
            1
          ]
        },
        'showUnderReview': {
          'roles': [
            1
          ]
        },
        'showTotalUnderReview': {
          'roles': [
            2
          ]
        },
        'showAawaitingReview': {
          'roles': [
            2
          ]
        },
        'showFilters': {
          'roles': [
            1,
            2,
            3
          ]
        },
        'showAddResource': {
          'roles': [
            1
          ]
        },
        'showEditResource': {
          'roles': [
            1
          ]
        },
        'showMoveResource': {
          'roles': [
            1
          ]
        },
        'showDeleteResource': {
          'roles': [
            1
          ]
        },
        'showPreviewResource': {
          'roles': [
            2
          ]
        },
        'showDashboard': {
          'roles': [
            3
          ]
        },
        'showCert': {
          'roles': [
            4
          ]
        },
        'showSave': {
          'roles': [
            1
          ]
        },
        'showEdit': {
          'roles': [
            1
          ]
        },
        'showChangeFile': {
          'roles': [
            1
          ]
        },
        'showRequestChanges': {
          'roles': [
            2
          ]
        },
        'showPublish': {
          'roles': [
            2
          ]
        },
        'showSubmit': {
          'roles': [
            1
          ]
        },
        'showCreatorView': {
          'roles': [
            1
          ]
        },
        'showReviewerView': {
          'roles': [
            2
          ]
        },
        'showCreateQuestion': {
          'roles': [
            1
          ]
        },
        'showDeleteQuestion': {
          'roles': [
            1
          ]
        }
      },
      'onBoardingForm': {
        'templateName': 'onBoardingForm',
        'action': 'onboard',
        'fields': [
          {
            'code': 'school',
            'dataType': 'text',
            'name': 'School',
            'label': 'School',
            'description': 'School',
            'inputType': 'select',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true,
            'range': [
              {
                'identifier': 'my_school',
                'code': 'my_school',
                'name': 'My School',
                'description': 'My School',
                'index': 1,
                'category': 'school',
                'status': 'Live'
              }
            ],
            'index': 1
          }
        ]
      },
      'sharedContext': [
        'channel',
        'framework',
        'board',
        'medium',
        'gradeLevel',
        'subject',
        'topic'
      ]
    },
    'defaultRoles': [
      'CONTRIBUTOR'
    ],
    'description': 'hello program',
    'endDate': null,
    'imagePath': null,
    'name': ' Newwww State Rajasthan Program',
    'rootOrgId': 'ORG_001',
    'rootOrgName': null,
    'slug': 'sunbird',
    'startDate': '2019-02-03T12:50:30.000Z',
    'status': null,
    'type': 'public',
    'userDetails': {
      'programId': 'e418dd20-5889-11ea-9029-838ad02df8ba',
      'userId': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
      'enrolledOn': '2020-02-26T11:22:43.473Z',
      'onBoarded': true,
      'onBoardingData': {
        'school': 'My School'
      },
      'roles': [
        'REVIEWER'
      ]
    }
  };

  export let sessionContext = {
    'framework': 'NCFCOPY',
    'currentRole': 'REVIEWER',
    'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
    'program': ' Newwww State Rajasthan Program',
    'onBoardSchool': 'My School',
    'board': 'NCERT',
    'medium': [
      'English'
    ],
    'gradeLevel': [
      'Kindergarten'
    ],
    'subject': [
      'English'
    ],
    'topic': null,
    'currentRoleId': 2,
    'collection': 'do_1129365647606415361180',
    'collectionName': 'CBSE Demo Textbook'
  };

  export let configData = {
    'id': 'ng.sunbird.chapterList',
    'ver': '1.0',
    'compId': 'chapterListComponent',
    'author': 'Kartheek',
    'description': '',
    'publishedDate': '',
    'data': {},
    'config': {
      'contentTypes': {
        'value': [
          {
            'id': 'explanationContent',
            'label': 'Explanation',
            'onClick': 'uploadComponent',
            'mimeType': [
              'application/pdf'
            ],
            'metadata': {
              'name': 'Explanation Resource',
              'description': 'ExplanationResource',
              'resourceType': 'Read',
              'contentType': 'ExplanationResource',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31280847585016217619710/artifact/explanation.thumb.png',
              'marks': 5
            },
            'filesConfig': {
              'accepted': 'pdf',
              'size': '50'
            }
          },
          {
            'id': 'experientialContent',
            'label': 'Experiential',
            'onClick': 'uploadComponent',
            'mimeType': [
              'video/mp4'
            ],
            'metadata': {
              'name': 'Experiential Resource',
              'description': 'ExperientialResource',
              'resourceType': 'Read',
              'contentType': 'ExperientialResource',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31280561379920281615017/artifact/experiential.thumb.png',
              'marks': 5
            },
            'filesConfig': {
              'accepted': 'mp4',
              'size': '50'
            }
          },
          {
            'id': 'focusSpotContent',
            'label': 'FocusSpot',
            'onClick': 'uploadComponent',
            'mimeType': [
              'application/pdf'
            ],
            'metadata': {
              'name': 'FocusSpot Resource',
              'description': 'FocusSpot',
              'resourceType': 'Read',
              'contentType': 'FocusSpot',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31291455031832576019477/artifact/3_1535000262441.thumb.png',
              'marks': 5
            },
            'filesConfig': {
              'accepted': 'pdf',
              'size': '50'
            }
          },
          {
            'id': 'interactiveContent',
            'label': 'Interactive',
            'onClick': 'editorComponent',
            'mimeType': [
              'application/vnd.ekstep.ecml-archive'
            ],
            'metadata': {
              'name': 'InteractiveResource',
              'description': 'InteractiveResource',
              'resourceType': 'Learn',
              'contentType': 'Resource',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31280847585016217619710/artifact/explanation.thumb.png',
              'marks': 5
            },
            'filesConfig': {
              'accepted': 'pdf',
              'size': '50'
            }
          },
          {
            'id': 'vsaPracticeQuestionContent',
            'label': 'VSA - Practice Sets',
            'onClick': 'questionSetComponent',
            'mimeType': [
              'application/vnd.ekstep.ecml-archive'
            ],
            'metadata': {
              'name': 'Practice QuestionSet',
              'description': 'Practice QuestionSet',
              'resourceType': 'Learn',
              'contentType': 'PracticeQuestionSet',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
              'marks': 5
            },
            'questionCategories': [
              'vsa'
            ]
          },
          {
            'id': 'saPracticeQuestionContent',
            'label': 'SA - Practice Sets',
            'onClick': 'questionSetComponent',
            'mimeType': [
              'application/vnd.ekstep.ecml-archive'
            ],
            'metadata': {
              'name': 'Practice QuestionSet',
              'description': 'Practice QuestionSet',
              'resourceType': 'Learn',
              'contentType': 'PracticeQuestionSet',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
              'marks': 5
            },
            'questionCategories': [
              'sa'
            ]
          },
          {
            'id': 'laPracticeQuestionContent',
            'label': 'LA - Practice Sets',
            'onClick': 'questionSetComponent',
            'mimeType': [
              'application/vnd.ekstep.ecml-archive'
            ],
            'metadata': {
              'name': 'Practice QuestionSet',
              'description': 'Practice QuestionSet',
              'resourceType': 'Learn',
              'contentType': 'PracticeQuestionSet',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
              'marks': 5
            },
            'questionCategories': [
              'la'
            ]
          },
          {
            'id': 'mcqPracticeQuestionContent',
            'label': 'MCQ - Practice Sets',
            'onClick': 'questionSetComponent',
            'mimeType': [
              'application/vnd.ekstep.ecml-archive'
            ],
            'metadata': {
              'name': 'Practice QuestionSet',
              'description': 'Practice QuestionSet',
              'resourceType': 'Learn',
              'contentType': 'PracticeQuestionSet',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
              'marks': 5
            },
            'questionCategories': [
              'mcq'
            ]
          },
          {
            'id': 'curiositySetContent',
            'label': 'Curiosity Sets',
            'onClick': 'curiositySetComponent',
            'mimeType': [
              'application/vnd.ekstep.ecml-archive'
            ],
            'metadata': {
              'name': 'Curiosity QuestionSet',
              'description': 'Curiosity QuestionSet',
              'resourceType': 'Learn',
              'contentType': 'CuriosityQuestionSet',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
              'marks': 5
            },
            'questionCategories': [
              'curiosity'
            ]
          }
        ],
        'defaultValue': [
          {
            'id': 'vsaPracticeQuestionContent',
            'label': 'Practice Sets',
            'onClick': 'questionSetComponent',
            'mimeType': [
              'application/vnd.ekstep.ecml-archive'
            ],
            'metadata': {
              'name': 'Practice QuestionSet',
              'description': 'Practice QuestionSet',
              'resourceType': 'Learn',
              'contentType': 'PracticeQuestionSet',
              'audience': [
                'Learner'
              ],
              'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
              'marks': 5
            },
            'questionCategories': [
              'vsa'
            ]
          }
        ]
      }
    }
  };

  export let collection = {
    'name': 'CBSE Demo Textbook',
    'description': 'Enter description for TextBook',
    'rating': '0',
    'subject': 'English',
    'medium': 'English',
    'orgDetails': {},
    'gradeLevel': 'Kindergarten',
    'contentType': 'TextBook',
    'topic': '',
    'subTopic': '',
    'metaData': {
      'identifier': 'do_1129365647606415361180',
      'mimeType': 'application/vnd.ekstep.content-collection',
      'framework': 'NCFCOPY',
      'contentType': 'TextBook'
    },
    'completionPercentage': 0,
    'mimeTypesCount': 0,
    'resourceType': 'Book',
    'organisation': [
      'Sunbird'
    ],
    'board': 'NCERT',
    'identifier': 'do_1129365647606415361180',
    'action': {
      'onImage': {
        'eventName': 'onImage'
      }
    },
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image'
      },
      'right': {
        'name': 'Book',
        'class': 'ui black right ribbon label'
      }
    }
  };

