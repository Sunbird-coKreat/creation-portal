// tslint:disable:max-line-length
var programConfig = {
  'defaultContributeOrgReview' : true,
  '_comments': '',
  'loginReqired': true,
  'framework': [],
  'board': [],
  'gradeLevel': [],
  'medium': [],
  'subject': [],
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
    'compId': 'collectionComponent',
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
        'resourceTitleLength': '200'
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
        'resourceTitleLength': '200',
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
  'sharedContext': [
    'channel',
    'framework',
    'board',
    'medium',
    'gradeLevel',
    'subject',
    'boardIds',
    'mediumIds',
    'gradeLevelIds',
    'subjectIds',
    'topic'
  ]
};

export let programConfigObj = programConfig;
