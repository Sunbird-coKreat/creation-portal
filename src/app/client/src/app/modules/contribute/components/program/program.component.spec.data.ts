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

export const roleNames = ["CONTRIBUTOR", "REVIEWER", "NONE", "BOTH"];

export const orgUser = {
	"email": "li****@yopmail.com",
	"firstName": "lily21",
	"id": "d31960d0-613f-4f5d-803d-9354a7bc056d",
	"identifier": "d31960d0-613f-4f5d-803d-9354a7bc056d",
	"lastName": null,
	"maskedEmail": "li****@yopmail.com",
	"maskedPhone": null,
	"phone": "",
	"phoneVerified": false,
	"userName": "lily21@yopmail.com",
	"newRole": "CONTRIBUTOR",
	"projectselectedRole": "CONTRIBUTOR"
};

export const updateNominationSuccessResponse = {
	"id": "api.nomination.update",
	"ts": "2020-09-08T07:33:09.364Z",
	"params": {
		"resmsgid": "8b16b341-f1a5-11ea-a9b9-b77f44b99f80",
		"msgid": "8b16b340-f1a5-11ea-a9b9-b77f44b99f80",
		"status": "successful",
		"err": null,
		"errmsg": null
	},
	"responseCode": "OK",
	"result": {
		"program_id": "14423170-ee78-11ea-a157-278232e1d499",
		"user_id": "149d152e-9192-4721-9e69-01e1e47f9b70"
	}
};

export const updateNominationErrorResponse = {
	"id": "api.nomination.update",
	"ts": "2020-09-08T07:33:09.364Z",
	"params": {
		"resmsgid": "58660230-575f-11e8-97d3-b1c7504700f9",
		"msgid": null,
		"status": "failed",
		"err": "Error in updating nomination",
		"errmsg": "Given program_id not found"
	},
	"responseCode": "CLIENT_ERROR",
	"result": {}
};