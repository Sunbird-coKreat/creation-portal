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
    'NCFCOPY': {
      'identifier': 'NCFCOPY',
      'code': 'NCFCOPY',
      'translations': '{"hi":"एनसीएफ कॉपी","ka":"ncf ನಕಲಿಸಿ"}',
      'name': 'AP Board',
      'description': ' NCF framework..',
      'categories': [
        {
          'identifier': 'ncfcopy_board',
          'code': 'board',
          'terms': [
            {
              'associations': [
                {
                  'identifier': 'ncfcopy_gradelevel_kindergarten',
                  'code': 'kindergarten',
                  'translations': '{"hi":"बाल विहार"}',
                  'name': 'Kindergarten',
                  'description': '',
                  'category': 'gradeLevel',
                  'status': 'Live'
                },
              ],
              'identifier': 'ncfcopy_board_ncert',
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
          'identifier': 'ncfcopy_medium',
          'code': 'medium',
          'translations': '{"hi":"मध्यम"}',
          'name': 'Medium',
          'description': '',
          'index': 2,
          'status': 'Live'
        },
        {
          'identifier': 'ncfcopy_subject',
          'code': 'subject',
          'terms': [
            {
              'identifier': 'ncfcopy_subject_mathematics',
              'code': 'mathematics',
              'children': [
                {
                  'identifier': 'ncfcopy_subject_arithmetics',
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
              'identifier': 'ncfcopy_subject_malayalam',
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
    'framework': 'NCFCOPY',
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
    'framework': 'NCFCOPY',
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
  'tcStatus': null,
  'maskedPhone': '******4412',
  'rootOrgName': 'Sunbird',
  'subject': [
    'Mathematics'
  ],
  'channel': null,
  'language': [
    'English'
  ],
  'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
  'externalIds': [],
  'registryId': null,
  'rootOrgId': 'ORG_001',
  'prevUsedEmail': '',
  'firstName': 'Creation',
  'dob': '2018-02-13',
  'grade': [
    'Grade 2'
  ],
  'currentLoginTime': null,
  'roles': [
    'public'
  ],
  'userName': 'ntptest102',
  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
  'framework': {
    'gradeLevel': [
      'KG'
    ],
    'subject': [
      'English'
    ],
    'id': [
      'NCF'
    ],
    'medium': [
      'English'
    ],
    'board': [
      'State (Uttar Pradesh)'
    ]
  },
  'rootOrgAdmin': false,
  'userRoles': [
    'PUBLIC',
    'BOOK_CREATOR',
    'CONTENT_CREATOR',
    'COURSE_MENTOR',
    'ANNOUNCEMENT_SENDER'
  ],
  'organisationIds': [
    'ORG_001'
  ],
  'hashTagIds': [
    'b00bc992ef25f1a9a8d63291e20efc8d'
  ]
};

export const programDetailsTargetCollection = {
  'target_collection_category': [
      'Question paper'
  ]
};

export const contextualHelpConfig = {
  'sourcing': {
    'reviewContributions': {
      'url': 'https://dock.preprod.ntp.net.in/help/contribute/reviewer/review-contributions/index.html',
      'header': 'This table allow you to see a list of content pending for your review.',
      'message': 'Click on any unit to proceed with the review process'
    },
    'assignUsersToProject': {
      'url': 'https://dock.preprod.ntp.net.in/help/contribute/how-to/how-to-assign-users-with-roles-to-contributor-projects.html',
      'header': 'This table allows you to see all the users available for this project and assign them relevant roles',
      'message': 'You can do so by clicking on Select Role next to a particular user and selecting their role from the dropdown.'
    }
  },
  'contribute': {
    'manageUsers': {
      'url': 'https://dock.preprod.ntp.net.in/help/contribute/administrator/manage-users/index.html',
      'header': 'Inviting users will allow you to assign them roles for projects',
      'message': 'You can invite users to your organization by clicking on Invite Users and sharing an invitation link with them'
    },
    'noUsersFound': {
      'url': 'https://dock.preprod.ntp.net.in/help/contribute/how-to/how-to-make-users-part-of-contributor.html',
      'header': 'Inviting users will allow you to assign them roles for projects',
      'message': 'You can invite users to your organization by clicking on Invite Users and sharing an invitation link with them'
    },
    'allProjectNomations': {
      'url': 'https://dock.preprod.ntp.net.in/help/contribute/how-to/how-to-nominate-for-sourcing-project.html',
      'header': 'This space allows you to upload your content samples, in order to nominate to this particular project.',
      'message': ''
    },
    'myProjectContribute': {
      'url': 'https://dock.preprod.ntp.net.in/help/contribute/how-to/how-to-nominate-for-sourcing-project.html',
      'header': 'This space allows you to see a list of content pending for your contribution in this project',
      'message': 'Click on any unit to proceed with the contribution process.'
    }
  }
};

export const programTextbooks = [
  {
      "ownershipType": [
          "createdBy"
      ],
      "copyright": "newDevSetUp2023channel",
      "year": "2011",
      "subject": [
          "Art"
      ],
      "channel": "sunbird",
      "organisation": [
          "newDevSetUp2023"
      ],
      "language": [
          "English"
      ],
      "mimeType": "application/vnd.ekstep.content-collection",
      "objectType": "Content",
      "chapterCountForContribution": 2,
      "gradeLevel": [
          "Class 4"
      ],
      "primaryCategory": "Digital Textbook",
      "contentEncoding": "gzip",
      "generateDIALCodes": "Yes",
      "contentType": "TextBook",
      "trackable": {
          "enabled": "No",
          "autoBatch": "No"
      },
      "identifier": "do_11380377932462489614",
      "audience": [
          "Student"
      ],
      "subjectIds": [
          "subject_art"
      ],
      "visibility": "Default",
      "author": "vvvv",
      "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
      "childNodes": [
          "do_11380377932617318415",
          "do_11380377932619776017",
          "do_113804118740418560112",
          "do_113804119475519488113",
          "do_11380693911669964811",
          "do_11382205541552947214",
          "do_11384133645629030415",
          "do_11384133783739596817",
          "do_11384133939566182419",
          "do_113841340665675776111",
          "do_113841342822547456113",
          "do_113841347772563456115",
          "do_113841816500215808116",
          "do_113842725425201152117"
      ],
      "discussionForum": {
          "enabled": "No"
      },
      "mediaType": "content",
      "osId": "org.ekstep.quiz.app",
      "graph_id": "domain",
      "languageCode": [
          "en"
      ],
      "nodeType": "DATA_NODE",
      "version": 2,
      "allowedContentTypes": [
          "Explanation Content"
      ],
      "license": "CC BY 4.0",
      "IL_FUNC_OBJECT_TYPE": "Collection",
      "name": "book2",
      "mediumIds": [
          "medium_english"
      ],
      "status": "Draft",
      "code": "org.sunbird.y4HMk5",
      "credentials": {
          "enabled": "No"
      },
      "origin": "do_11380219689970073616",
      "description": "Enter description for TextBook",
      "medium": [
          "English"
      ],
      "idealScreenSize": "normal",
      "createdOn": "2023-05-25T16:20:55.842+0000",
      "copyrightYear": 2022,
      "contentDisposition": "inline",
      "lastUpdatedOn": "2023-07-19T16:56:58.721+0000",
      "originData": "{\"channel\":\"01379157488516300825\"}",
      "dialcodeRequired": "No",
      "createdFor": [
          "01379157488516300825"
      ],
      "creator": "vvvv",
      "os": [
          "All"
      ],
      "IL_SYS_NODE_TYPE": "DATA_NODE",
      "chapterCount": 2,
      "versionKey": "1689785818721",
      "idealScreenDensity": "hdpi",
      "framework": "cokreat_k-12",
      "depth": 0,
      "boardIds": [
          "cokreat_k-12_board_pune"
      ],
      "createdBy": "842e2f00-16d3-487b-99c2-576667e99f22",
      "compatibilityLevel": 1,
      "userConsent": "Yes",
      "openForContribution": true,
      "gradeLevelIds": [
          "cokreat_k-12_gradelevel_class4"
      ],
      "IL_UNIQUE_ID": "do_11380377932462489614",
      "board": "Pune",
      "programId": "02df53e0-fad2-11ed-9d2c-c1818048f076",
      "resourceType": "Book",
      "node_id": 61041,
      "pendingBySourceOrg": []
  }
];

export const programTextbooksWithCounts = [
  {
      "ownershipType": [
          "createdBy"
      ],
      "copyright": "newDevSetUp2023channel",
      "year": "2011",
      "subject": [
          "Art"
      ],
      "channel": "sunbird",
      "organisation": [
          "newDevSetUp2023"
      ],
      "language": [
          "English"
      ],
      "mimeType": "application/vnd.ekstep.content-collection",
      "objectType": "Content",
      "chapterCountForContribution": 2,
      "gradeLevel": [
          "Class 4"
      ],
      "primaryCategory": "Digital Textbook",
      "contentEncoding": "gzip",
      "generateDIALCodes": "Yes",
      "contentType": "TextBook",
      "trackable": {
          "enabled": "No",
          "autoBatch": "No"
      },
      "identifier": "do_11380377932462489614",
      "audience": [
          "Student"
      ],
      "subjectIds": [
          "cokreat_k-12_subject_art"
      ],
      "visibility": "Default",
      "author": "vvvv",
      "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
      "childNodes": [
          "do_11380377932617318415",
          "do_11380377932619776017",
          "do_113804118740418560112",
          "do_113804119475519488113",
          "do_11380693911669964811",
          "do_11382205541552947214",
          "do_11384133645629030415",
          "do_11384133783739596817",
          "do_11384133939566182419",
          "do_113841340665675776111",
          "do_113841342822547456113",
          "do_113841347772563456115",
          "do_113841816500215808116",
          "do_113842725425201152117"
      ],
      "discussionForum": {
          "enabled": "No"
      },
      "mediaType": "content",
      "osId": "org.ekstep.quiz.app",
      "graph_id": "domain",
      "languageCode": [
          "en"
      ],
      "nodeType": "DATA_NODE",
      "version": 2,
      "allowedContentTypes": [
          "Explanation Content"
      ],
      "license": "CC BY 4.0",
      "IL_FUNC_OBJECT_TYPE": "Collection",
      "name": "book2",
      "mediumIds": [
          "cokreat_k-12_medium_english"
      ],
      "status": "Draft",
      "code": "org.sunbird.y4HMk5",
      "credentials": {
          "enabled": "No"
      },
      "origin": "do_11380219689970073616",
      "description": "Enter description for TextBook",
      "medium": [
          "English"
      ],
      "idealScreenSize": "normal",
      "createdOn": "2023-05-25T16:20:55.842+0000",
      "copyrightYear": 2022,
      "contentDisposition": "inline",
      "lastUpdatedOn": "2023-07-19T16:56:58.721+0000",
      "originData": "{\"channel\":\"01379157488516300825\"}",
      "dialcodeRequired": "No",
      "createdFor": [
          "01379157488516300825"
      ],
      "creator": "vvvv",
      "os": [
          "All"
      ],
      "IL_SYS_NODE_TYPE": "DATA_NODE",
      "chapterCount": 2,
      "versionKey": "1689785818721",
      "idealScreenDensity": "hdpi",
      "framework": "cokreat_k-12",
      "depth": 0,
      "boardIds": [
          "board_pune"
      ],
      "createdBy": "842e2f00-16d3-487b-99c2-576667e99f22",
      "compatibilityLevel": 1,
      "userConsent": "Yes",
      "openForContribution": true,
      "gradeLevelIds": [
          "gradelevel_class4"
      ],
      "IL_UNIQUE_ID": "do_11380377932462489614",
      "board": "Pune",
      "programId": "02df53e0-fad2-11ed-9d2c-c1818048f076",
      "resourceType": "Book",
      "node_id": 61041,
      "mvcContributionsCount": 0,
      "draftCount": 0,
      "reviewCount": 0,
      "rejectedCount": 0,
      "liveCount": 0,
      "sampleContentInReview": 0,
      "sampleContentInDraft": 0,
      "totalSampleContent": 0,
      "pendingBySourceOrg": []
  }
];
