export const toolbarConfig = {
  headerName: 'Create Question Set',
  title: 'Question Collection',
  buttons: [{
    name: 'Save as draft',
    type: 'saveContent',
    buttonType: 'button',
    style: 'sb-btn sb-btn-normal sb-btn-outline-primary mr-10',
  },
  {
    name: 'Submit',
    type: 'submitContent',
    buttonType: 'button',
    style: 'sb-btn sb-btn-normal sb-btn-primary',
    slot: `<i class="trash alternate outline icon"></i>`
  }
  ]
};

export const questionToolbarConfig = {
  headerName: 'Edit Question',
  title: 'Q1 | MCQ',
  buttons: [{
    name: 'Preview',
    type: 'previewContent',
    buttonType: 'button',
    style: 'sb-btn sb-btn-normal sb-btn-outline-primary mr-10',
    slot: `icon eye`
  }, {
    name: 'Cancel',
    type: 'cancelContent',
    buttonType: 'button',
    style: 'sb-btn sb-btn-normal sb-btn-outline-primary mr-10',
  },
  {
    name: 'Save',
    type: 'saveContent',
    buttonType: 'button',
    style: 'sb-btn sb-btn-normal sb-btn-primary'
  }
  ]
};


export const templateList = [
    { questionCategory : 'VSA', type: 'reference' },
    { questionCategory : 'SA', type: 'reference' },
    { questionCategory : 'LA', type: 'reference' },
    { questionCategory : 'MCQ' , type: 'mcq'},
    { questionCategory : 'CuriosityQuestion', type: 'reference' }
];

export const editorConfig = {
    'nodeDisplayCriteria': {
      'contentType': ['QuestionSet', 'Question']
    },
    'keywordsLimit': 500,
    'editorConfig': {
      'rules': {
        'levels': 2,
        'objectTypes': [
          {
            'type': 'QuestionSet',
            'label': 'QuestionSet',
            'isRoot': true,
            'editable': true,
            'childrenTypes': [
              'QuestionSet', 'Question'
            ],
            'addType': 'Editor',
            'iconClass': 'fa fa-book'
          },
          {
            'type': 'Question',
            'label': 'Question',
            'isRoot': false,
            'editable': true,
            'childrenTypes': [],
            'addType': 'Editor',
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'Course',
            'label': 'Course',
            'isRoot': true,
            'editable': true,
            'childrenTypes': [
                'CourseUnit'
            ],
            'addType': 'Editor',
            'iconClass': 'fa fa-book'
          },
          {
              'type': 'CourseUnit',
              'label': 'Course Unit',
              'isRoot': false,
              'editable': true,
              'childrenTypes': [
                  'CourseUnit',
                  'Collection',
                  'Resource',
                  'SelfAssess',
                  'FocusSpot',
                  'LearningOutcomeDefinition',
                  'PracticeQuestionSet',
                  'CuriosityQuestions',
                  'MarkingSchemeRubric',
                  'ExplanationResource',
                  'ExperientialResource'
              ],
              'addType': 'Editor',
              'iconClass': 'fa fa-folder-o'
          },
          {
              'type': 'Collection',
              'label': 'Collection',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          },
          {
              'type': 'Resource',
              'label': 'Resource',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          },
          {
              'type': 'SelfAssess',
              'label': 'SelfAssess',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          },
          {
              'type': 'FocusSpot',
              'label': 'FocusSpot',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          },
          {
              'type': 'LearningOutcomeDefinition',
              'label': 'LearningOutcomeDefinition',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          },
          {
              'type': 'PracticeQuestionSet',
              'label': 'PracticeQuestionSet',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          },
          {
              'type': 'CuriosityQuestions',
              'label': 'CuriosityQuestions',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          },
          {
              'type': 'MarkingSchemeRubric',
              'label': 'MarkingSchemeRubric',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          },
          {
              'type': 'ExplanationResource',
              'label': 'ExplanationResource',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          },
          {
              'type': 'ExperientialResource',
              'label': 'ExperientialResource',
              'isRoot': false,
              'editable': false,
              'childrenTypes': [],
              'addType': 'Browser',
              'iconClass': 'fa fa-file-o'
          }
        ]
      },
      'mode': 'Edit'
    }
};

export const questionEditorConfig = {
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
      'solutionType': [
        'Video',
        'Text & image'
      ],
      'No of options': 4,
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
          'name': 'LearningOutcome',
          'label': 'Learning Outcome',
          'visible': true,
          'dataType': 'list',
          'editable': true,
          'required': false,
          'inputType': 'multiselect',
          'description': 'Learning Outcomes For The Content',
          'placeholder': 'Select Learning Outcomes'
        },
        {
          'code': 'attributions',
          'name': 'Attributions',
          'label': 'Attributions',
          'visible': true,
          'dataType': 'list',
          'editable': true,
          'helpText': 'If you have relied on another work to create this Content, provide the name of that creator and the source of that work.',
          'required': false,
          'inputType': 'text',
          'description': 'Enter Attributions',
          'placeholder': 'Enter Attributions'
        },
        {
          'code': 'copyright',
          'name': 'Copyright',
          'label': 'Copyright and Year',
          'visible': true,
          'dataType': 'text',
          'editable': true,
          'helpText': 'If you are an individual, creating original Content, you are the copyright holder. If you are creating Content on behalf of an organisation, the organisation may be the copyright holder. Please fill as <Name of copyright holder>, <Year of publication>',
          'required': true,
          'inputType': 'text',
          'description': 'Enter Copyright and Year',
          'placeholder': 'Enter Copyright and Year'
        },
        {
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
        },
        {
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
        },
        {
          'code': 'contentPolicyCheck',
          'name': 'Content Policy Check',
          'visible': true,
          'dataType': 'boolean',
          'editable': false,
          'required': true,
          'inputType': 'checkbox'
        }
      ],
      'resourceTitleLength': '200'
    },
    'channel': 'sunbird'
};

export const collectionTreeNodes = {
    'data': {
      "ownershipType": [
          "createdBy"
      ],
      "code": "org.sunbird.V8QDJp",
      "credentials": {
          "enabled": "Yes"
      },
      "channel": "b00bc992ef25f1a9a8d63291e20efc8d",
      "organisation": [
          "Sunbird"
      ],
      "description": "Enter description for Course",
      "language": [
          "English"
      ],
      "mimeType": "application/vnd.ekstep.content-collection",
      "idealScreenSize": "normal",
      "createdOn": "2020-12-04T04:17:29.685+0000",
      "objectType": "Content",
      "primaryCategory": "Course",
      "children": [
          {
              "ownershipType": [
                  "createdBy"
              ],
              "parent": "do_11316499824380313611371",
              "copyright": "Sunbird",
              "code": "do_11316499915048550411372",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "b00bc992ef25f1a9a8d63291e20efc8d",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2020-12-04T04:19:20.362+0000",
              "objectType": "Content",
              "primaryCategory": "Course Unit",
              "children": [
                  {
                      "parent": "do_11316499915048550411372",
                      "copyright": "",
                      "previewUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/ecml/domain_57438-latest",
                      "keywords": [
                          "mela3",
                          "mela 3",
                          "pratham"
                      ],
                      "channel": "in.ekstep",
                      "downloadUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/gnnit-abhyaas-kmaal_1472797284900_domain_57438.ecar",
                      "language": [
                          "Hindi"
                      ],
                      "source": "EkStep and Pratham",
                      "mimeType": "application/vnd.ekstep.ecml-archive",
                      "objectType": "Content",
                      "apoc_text": "APOC",
                      "gradeLevel": [
                          "Kindergarten",
                          "Grade 1",
                          "Grade 2",
                          "Grade 3"
                      ],
                      "appIcon": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/camal_1464848896830.thumb.png",
                      "me_totalTimespent": 2067.06,
                      "primaryCategory": "Learning Resource",
                      "me_averageTimespentPerSession": 258.38,
                      "appId": "dev.ekstep.in",
                      "me_totalRatings": 0,
                      "contentEncoding": "gzip",
                      "artifactUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/1466057703517_domain_57438_1472797208970.zip",
                      "collaborators": [
                          "129",
                          "141",
                          "356"
                      ],
                      "sYS_INTERNAL_LAST_UPDATED_ON": "2017-06-09T07:00:17.786+0000",
                      "contentType": "Resource",
                      "apoc_num": 1,
                      "identifier": "domain_57438",
                      "lastUpdatedBy": "239",
                      "audience": [
                          "Student"
                      ],
                      "visibility": "Default",
                      "author": "EkStep and Pratham",
                      "consumerId": "f6878ac4-e9c9-4bc4-80be-298c5a73b447",
                      "portalOwner": "239",
                      "index": 1,
                      "mediaType": "content",
                      "ageGroup": [
                          "<5",
                          "5-6",
                          "6-7"
                      ],
                      "osId": "org.ekstep.quiz.app",
                      "languageCode": [
                          "hi"
                      ],
                      "license": "CC BY 4.0",
                      "size": 3522541.0,
                      "lastPublishedOn": "2016-09-02T06:21:26.426+0000",
                      "domain": [
                          "numeracy"
                      ],
                      "name": "गणित अभ्यास (कमाल)",
                      "me_averageSessionsPerDevice": 2.67,
                      "publisher": "EkStep",
                      "status": "Live",
                      "me_averageInteractionsPerMin": 2.87,
                      "code": "org.ekstep.Array.worksheet.2484",
                      "me_totalSessionsCount": 8,
                      "apoc_json": "{\"batch\": true}",
                      "description": "जोड़ने  घटाने के कुछ सवाल ",
                      "streamingUrl": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/ecml/domain_57438-latest",
                      "posterImage": "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/language_assets/camal_1464848896830.png",
                      "idealScreenSize": "normal",
                      "createdOn": "2016-09-02T06:18:39.199+0000",
                      "me_totalSideloads": 1,
                      "me_totalComments": 0,
                      "popularity": 2067.06,
                      "contentDisposition": "inline",
                      "lastUpdatedOn": "2017-05-30T05:18:54.415+0000",
                      "me_totalDevices": 3,
                      "me_totalDownloads": 9,
                      "owner": "239",
                      "os": [
                          "All"
                      ],
                      "me_totalInteractions": 99,
                      "pkgVersion": 4.0,
                      "versionKey": "1496991617786",
                      "idealScreenDensity": "hdpi",
                      "depth": 2,
                      "s3Key": "ecar_files/gnnit-abhyaas-kmaal_1472797284900_domain_57438.ecar",
                      "me_averageRating": 0.0,
                      "lastSubmittedOn": "2016-06-16T06:12:58.302+0000",
                      "createdBy": "239",
                      "compatibilityLevel": 1,
                      "developer": "EkStep",
                      "resourceType": [
                          "Worksheet"
                      ]
                  }
              ],
              "contentDisposition": "inline",
              "lastUpdatedOn": "2020-12-04T05:06:32.643+0000",
              "contentEncoding": "gzip",
              "contentType": "CourseUnit",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11316499915048550411372",
              "lastStatusChangedOn": "2020-12-04T04:19:20.362+0000",
              "audience": [
                  "Student"
              ],
              "os": [
                  "All"
              ],
              "visibility": "Parent",
              "index": 1,
              "mediaType": "content",
              "osId": "org.ekstep.launcher",
              "languageCode": [
                  "en"
              ],
              "version": 2,
              "versionKey": "1607055560362",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "NCFCOPY",
              "depth": 1,
              "compatibilityLevel": 1,
              "name": "course_level_01",
              "status": "Draft"
          }
      ],
      "appId": "dev.sunbird.portal",
      "contentDisposition": "inline",
      "lastUpdatedOn": "2020-12-04T04:17:29.685+0000",
      "contentEncoding": "gzip",
      "collaborators": [
          "95e4942d-cbe8-477d-aebd-ad8e6de4bfc8"
      ],
      "lockKey": "0765dacc-6384-4b44-b6b7-5ede22563a9c",
      "sYS_INTERNAL_LAST_UPDATED_ON": "2020-12-04T04:17:30.722+0000",
      "contentType": "Course",
      "dialcodeRequired": "No",
      "trackable": {
          "enabled": "Yes",
          "autoBatch": "Yes"
      },
      "identifier": "do_11316499824380313611371",
      "lastStatusChangedOn": "2020-12-04T04:17:29.685+0000",
      "createdFor": [
          "ORG_001"
      ],
      "audience": [
          "Student"
      ],
      "creator": "Reviewer User",
      "os": [
          "All"
      ],
      "visibility": "Default",
      "consumerId": "273f3b18-5dda-4a27-984a-060c7cd398d3",
      "childNodes": [
          "domain_57438",
          "do_11316499915048550411372"
      ],
      "mediaType": "content",
      "osId": "org.ekstep.quiz.app",
      "languageCode": [
          "en"
      ],
      "version": 2,
      "versionKey": "1607060385272",
      "license": "CC BY 4.0",
      "idealScreenDensity": "hdpi",
      "framework": "NCFCOPY",
      "depth": 0,
      "createdBy": "95e4942d-cbe8-477d-aebd-ad8e6de4bfc8",
      "compatibilityLevel": 1,
      "userConsent": "Yes",
      "name": "Untitled Course",
      "resourceType": "Course",
      "status": "Draft"
  }
};

