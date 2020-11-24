export const toolbarConfig = [{
    name: 'Submit',
    type: 'submitContent',
    buttonType: 'icon',
    style: 'sb-btn sb-btn-normal sb-btn-outline-primary sb-right-icon-btn',
    slot: `<i class="trash alternate outline icon"></i>`
  },
  {
    name: 'Save',
    type: 'saveContent',
    buttonType: 'button',
    style: 'sb-btn sb-btn-normal sb-btn-outline-primary sb-right-icon-btn',
    slot: `<i class="trash alternate outline icon"></i>`
  }
];

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
      'ownershipType': [
        'createdBy'
      ],
      'copyright': 'NCERT',
      'keywords': [
        'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार प्रौद्योगिकी) का समन्वय',
        'ऑनलाइन शिक्षण के दौरान सुरक्षा , बचाव और गोपनीयता',
        'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
      ],
      'channel': '0123221758376673287017',
      'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
      'organisation': [
        'EKSTEP'
      ],
      'language': [
        'English'
      ],
      'mimeType': 'application/vnd.ekstep.content-collection',
      'variants': {
        'online': {
          'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar',
          'size': 32699
        },
        'spine': {
          'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
          'size': 1104989
        }
      },
      'leafNodes': [
        'do_31313398097120460811398',
        'do_31313459126286745611582',
        'do_31313402698105651211544',
        'do_3131339728289546241845',
        'do_3131340293650841601930',
        'do_31313474605245235212030',
        'do_313133975595655168155',
        'do_31313472227985817611976',
        'do_3131339798579281921909',
        'do_31313483394648473611208',
        'do_31313483573434777611860',
        'do_31313458495336448011707',
        'do_31313477350508134412125',
        'do_3131339659511971841906',
        'do_31313471869309747211677',
        'do_3131347275282268161289',
        'do_31313478176004505611054',
        'do_31313396328849408011957',
        'do_31313402816037683211431',
        'do_3131340323801907201134',
        'do_3131339686433587201844',
        'do_3131339850007183361849',
        'do_31313475711469158411171',
        'do_3131292436049264641492',
        'do_31313474043200307211689',
        'do_3131345828580229121941',
        'do_31313476933029068811835',
        'do_31313478172178022411334',
        'do_31313478248306278411335',
        'do_31313403369611264011448',
        'do_3131340162837626881924',
        'do_31313397741881753611521'
      ],
      'objectType': 'Content',
      'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313406305859174411460/artifact/nishtha_icon.thumb.jpg',
      'primaryCategory': 'Course',
      'children': [
        {
          'type': 'reference',
          'category': 'VSA',
          'editorState': {
            'question': '<p>Question</p><ol><li>Hello Hello</li><li>Bye BYe</li><li>Okay OKay</li></ol><figure class="image"><img src="data:image/png;base64,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" data-mathtext="x%3D%5Cfrac%7B-b%5Cpm%5Csqrt%7Bb%5E2-4ac%7D%7D%7B2a%7D" advanced="false"></figure>',
            'answer': '<figure class="image"><img src="https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_1131148075934351361141/artifact/500_internal_server_error.png" alt="do_1131148075934351361141" data-asset-variable="do_1131148075934351361141"></figure>',
            'solutions': [
              {
                'id': '33900c76-075c-691f-97f8-69d6211d575b',
                'type': 'html',
                'value': '<p>SolutionSolutionSolutionSolutionSolutionSolutionSolutionSolutionSolutionSolutionSolution</p><p>Solution</p><p><br data-cke-filler="true"></p><p>SolutionSolution</p><figure class="image"><img src="https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_1131148075934351361141/artifact/500_internal_server_error.png" alt="do_1131148075934351361141" data-asset-variable="do_1131148075934351361141"></figure>'
              }
            ]
          },
          'ownershipType': [
            'createdBy'
          ],
          'copyright': 'NCERT',
          'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313396328849408011957/5_1_objective.pdf',
          'keywords': [
            'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
          ],
          'subject': [
            'CPD'
          ],
          'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313396328849408011957/uddeshy_1603273750034_do_31313396328849408011957_1.0.ecar',
          'channel': '0125196274181898243',
          'organisation': [
            'NCERT'
          ],
          'language': [
            'English'
          ],
          'variants': {
            'spine': {
              'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313396328849408011957/uddeshy_1603273750125_do_31313396328849408011957_1.0_spine.ecar',
              'size': 34919
            }
          },
          'mimeType': 'application/pdf',
          'me_totalRatingsCount': 109933,
          'gradeLevel': [
            'Others'
          ],
          'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313396328849408011957/artifact/nishtha_icon.thumb.jpg',
          'primaryCategory': 'Explanation Content',
          'appId': 'prod.diksha.app',
          'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313396328849408011957/5_1_objective.pdf',
          'contentEncoding': 'identity',
          'me_totalPlaySessionCount': {
            'portal': 105295
          },
          'lockKey': '9b615ac9-0448-48e5-9316-c280a54bf26b',
          'contentType': 'Question',
          'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
          'identifier': 'do_31313396328849408011957',
          'audience': [
            'Student'
          ],
          'me_totalTimeSpentInSec': {
            'portal': 4361746
          },
          'visibility': 'Default',
          'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
          'author': 'NCERT',
          'mediaType': 'content',
          'osId': 'org.ekstep.quiz.app',
          'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
          'version': 2,
          'pragma': [
            'external'
          ],
          'prevState': 'Review',
          'license': 'CC BY-SA 4.0',
          'lastPublishedOn': '2020-10-21T09:49:10.029+0000',
          'size': 456902,
          'name': 'Reference Question - VSA',
          'status': 'Live',
          'code': 'c1280662-c243-4774-8a64-8414b50550ea',
          'prevStatus': 'Processing',
          'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313396328849408011957/5_1_objective.pdf',
          'medium': [
            'Hindi'
          ],
          'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
          'idealScreenSize': 'normal',
          'createdOn': '2020-10-21T07:56:42.991+0000',
          'copyrightYear': 2020,
          'contentDisposition': 'inline',
          'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
          'lastUpdatedOn': '2020-10-21T09:49:08.403+0000',
          'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:55:10.517+0000',
          'dialcodeRequired': 'No',
          'createdFor': [
            '0125196274181898243'
          ],
          'lastStatusChangedOn': '2020-10-21T09:49:10.182+0000',
          'creator': 'NCERT COURSE CREATOR 2',
          'os': [
            'All'
          ],
          'pkgVersion': 1,
          'versionKey': '1603273748403',
          'idealScreenDensity': 'hdpi',
          's3Key': 'ecar_files/do_31313396328849408011957/uddeshy_1603273750034_do_31313396328849408011957_1.0.ecar',
          'framework': 'ncert_k-12',
          'me_averageRating': 4,
          'lastSubmittedOn': '2020-10-21T08:01:45.454+0000',
          'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
          'compatibilityLevel': 4,
          'resourceType': 'Learn',
          'index': 1,
          'depth': 2,
          'parent': 'do_3131430588156067841367',
          'objectType': 'Content',
          'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:49:14.254+0000',
          'languageCode': [
            'en'
          ]
        },
        {
          'responseDeclaration': {
            'responseValue': {
              'cardinality': 'single',
              'type': 'integer',
              'correct_response': {'value': '0'}
            }
          },
          'type': 'mcq',
          'templateId': 'mcq-vertical',
          'editorState': {
            'question': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">If f(x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">) = f (x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">) ⇒ x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> = x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> ∀ x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> ∈ A then the function f: A → B is</span></p>',
            'options': [
              {
                'answer': true,
                'value': {
                  'type': 'text',
                  'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one</span>&nbsp;</p>',
                  'resvalue': 0,
                  'resindex': 0
                }
              },
              {
                'answer': false,
                'value': {
                  'type': 'text',
                  'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one onto</span></p>',
                  'resvalue': 1,
                  'resindex': 1
                }
              },
              {
                'answer': false,
                'value': {
                  'type': 'text',
                  'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">onto</span></p>',
                  'resvalue': 2,
                  'resindex': 2
                }
              },
              {
                'answer': false,
                'value': {
                  'type': 'text',
                  'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">many one</span></p>',
                  'resvalue': 3,
                  'resindex': 3
                }
              }
            ],
            'solutions': [
              {
                'id': '5b1f0dda-cd2d-cc09-4fce-a0065bfa1229',
                'type': 'html',
                'value': '<p>Answer: (a) one-one</p>'
              }
            ]
          },
          'body': '<div class=\'mcq-vertical cheveron-helper\'><div class=\'mcq-title\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">If f(x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">) = f (x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">) ⇒ x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> = x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> ∀ x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> ∈ A then the function f: A → B is</span></p></div><i class=\'chevron down icon\'></i><div class=\'mcq-options\'><div data-simple-choice-interaction data-response-variable=\'responseValue\' value=0 class=\'mcq-option\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one</span>&nbsp;</p></div><div data-simple-choice-interaction data-response-variable=\'responseValue\' value=1 class=\'mcq-option\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one onto</span></p></div><div data-simple-choice-interaction data-response-variable=\'responseValue\' value=2 class=\'mcq-option\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">onto</span></p></div><div data-simple-choice-interaction data-response-variable=\'responseValue\' value=3 class=\'mcq-option\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">many one</span></p></div></div></div>',      
          'options': [
            {
              'answer': true,
              'value': {
                'type': 'text',
                'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one</span>&nbsp;</p>',
                'resvalue': 0,
                'resindex': 0
              }
            },
            {
              'answer': false,
              'value': {
                'type': 'text',
                'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one onto</span></p>',
                'resvalue': 1,
                'resindex': 1
              }
            },
            {
              'answer': false,
              'value': {
                'type': 'text',
                'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">onto</span></p>',
                'resvalue': 2,
                'resindex': 2
              }
            },
            {
              'answer': false,
              'value': {
                'type': 'text',
                'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">many one</span></p>',
                'resvalue': 3,
                'resindex': 3
              }
            }
          ],
          'solutions': [
            {
              'id': '5b1f0dda-cd2d-cc09-4fce-a0065bfa1229',
              'type': 'html',
              'value': '<p>Answer: (a) one-one</p>'
            }
          ],
          'category': 'MCQ',
          'ownershipType': [
            'createdBy'
          ],
          'copyright': 'NCERT',
          'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339659511971841906/5_2_content-outline.pdf',
          'keywords': [
            'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
          ],
          'subject': [
            'CPD'
          ],
          'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339659511971841906/saamgrii-kii-ruuprekhaa_1603273716688_do_3131339659511971841906_1.0.ecar',
          'channel': '0125196274181898243',
          'organisation': [
            'NCERT'
          ],
          'language': [
            'English'
          ],
          'variants': {
            'spine': {
              'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339659511971841906/saamgrii-kii-ruuprekhaa_1603273716775_do_3131339659511971841906_1.0_spine.ecar',
              'size': 34924
            }
          },
          'mimeType': 'application/pdf',
          'me_totalRatingsCount': 88434,
          'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131339659511971841906/artifact/nishtha_icon.thumb.jpg',
          'gradeLevel': [
            'Others'
          ],
          'primaryCategory': 'Explanation Content',
          'appId': 'prod.diksha.app',
          'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339659511971841906/5_2_content-outline.pdf',
          'contentEncoding': 'identity',
          'me_totalPlaySessionCount': {
            'portal': 91651
          },
          'lockKey': '8e1a605c-777f-4020-b42d-e0104aeb38f3',
          'contentType': 'Question',
          'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
          'identifier': 'do_3131339659511971841906',
          'audience': [
            'Student'
          ],
          'me_totalTimeSpentInSec': {
            'portal': 3344880
          },
          'visibility': 'Default',
          'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
          'author': 'NCERT',
          'mediaType': 'content',
          'osId': 'org.ekstep.quiz.app',
          'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
          'version': 2,
          'pragma': [
            'external'
          ],
          'prevState': 'Review',
          'license': 'CC BY-SA 4.0',
          'lastPublishedOn': '2020-10-21T09:48:36.685+0000',
          'size': 321641,
          'name': 'MCQ Question',
          'status': 'Live',
          'code': '56d39a86-e83d-4c5c-b514-a81a493bbb9c',
          'prevStatus': 'Processing',
          'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339659511971841906/5_2_content-outline.pdf',
          'medium': [
            'Hindi'
          ],
          'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
          'idealScreenSize': 'normal',
          'createdOn': '2020-10-21T08:02:08.028+0000',
          'copyrightYear': 2020,
          'contentDisposition': 'inline',
          'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
          'lastUpdatedOn': '2020-10-21T09:48:36.508+0000',
          'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:25:14.632+0000',
          'dialcodeRequired': 'No',
          'createdFor': [
            '0125196274181898243'
          ],
          'creator': 'NCERT COURSE CREATOR 2',
          'lastStatusChangedOn': '2020-10-21T09:48:36.862+0000',
          'os': [
            'All'
          ],
          'pkgVersion': 1,
          'versionKey': '1603273716508',
          'idealScreenDensity': 'hdpi',
          's3Key': 'ecar_files/do_3131339659511971841906/saamgrii-kii-ruuprekhaa_1603273716688_do_3131339659511971841906_1.0.ecar',
          'framework': 'ncert_k-12',
          'me_averageRating': 4,
          'lastSubmittedOn': '2020-10-21T08:05:13.473+0000',
          'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
          'compatibilityLevel': 4,
          'resourceType': 'Learn',
          'index': 2,
          'depth': 2,
          'parent': 'do_3131430588156067841367',
          'objectType': 'Content',
          'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:17:29.712+0000',
          'languageCode': [
            'en'
          ]
        }
      ],
      'appId': 'prod.diksha.app',
      'contentEncoding': 'gzip',
      'lockKey': '50342dd9-464c-4ab1-83d4-7baaaf1d1dd5',
      'totalCompressedSize': 463098443,
      'mimeTypesCount': '{"application/vnd.ekstep.h5p-archive":2,"application/pdf":22,"application/vnd.ekstep.content-collection":13,"application/vnd.ekstep.ecml-archive":3,"video/mp4":5}',
      'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-04T19:00:02.228+0000',
      'contentType': 'QuestionSet',
      'trackable': {
        'enabled': 'Yes',
        'autoBatch': 'No'
      },
      'identifier': 'do_3131430588146155521345',
      'lastUpdatedBy': '87ce3810-6b3d-4427-bfb7-efe57b7efbd5',
      'audience': [
        'Teacher'
      ],
      'toc_url': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131430588146155521345/artifact/do_3131430588146155521345_toc.json',
      'visibility': 'Default',
      'contentTypesCount': '{"PracticeResource":8,"CourseUnit":13,"ExplanationResource":24}',
      'author': 'NCERT',
      'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
      'childNodes': [
        'do_31313398097120460811398',
        'do_3131430588155166721351',
        'do_31313459126286745611582',
        'do_3131430588155740161363',
        'do_31313402698105651211544',
        'do_3131339728289546241845',
        'do_3131340293650841601930',
        'do_3131430588155985921365',
        'do_31313474605245235212030',
        'do_313133975595655168155',
        'do_31313472227985817611976',
        'do_3131339798579281921909',
        'do_3131430588155576321359',
        'do_31313483394648473611208',
        'do_31313483573434777611860',
        'do_31313458495336448011707',
        'do_3131430588156313601371',
        'do_31313477350508134412125',
        'do_3131430588156149761369',
        'do_3131339659511971841906',
        'do_31313471869309747211677',
        'do_3131430588155658241361',
        'do_3131347275282268161289',
        'do_3131430588155002881349',
        'do_3131430588155494401357',
        'do_3131430588155330561355',
        'do_31313478176004505611054',
        'do_31313396328849408011957',
        'do_31313402816037683211431',
        'do_3131340323801907201134',
        'do_3131339686433587201844',
        'do_3131430588155248641353',
        'do_3131339850007183361849',
        'do_31313475711469158411171',
        'do_3131292436049264641492',
        'do_31313474043200307211689',
        'do_3131345828580229121941',
        'do_31313476933029068811835',
        'do_31313478172178022411334',
        'do_3131430588156067841367',
        'do_31313478248306278411335',
        'do_31313403369611264011448',
        'do_3131430588154920961347',
        'do_3131340162837626881924',
        'do_31313397741881753611521'
      ],
      'mediaType': 'content',
      'osId': 'org.ekstep.quiz.app',
      'languageCode': [
        'en'
      ],
      'lastPublishedBy': '3254f264-5bed-49db-8e30-ce4d292978e3',
      'version': 2,
      'license': 'CC BY-SA 4.0',
      'prevState': 'Review',
      'size': 1104989,
      'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
      'name': '.सी.टी का समन्वय (उत्तर प्रदेश) - test only',
      'status': 'Live',
      'code': 'org.sunbird.QCPlqd.copy.copy',
      'c_diksha_private_batch_count': 0,
      'credentials': {
        'enabled': 'Yes'
      },
      'prevStatus': 'Processing',
      'origin': 'do_3131427131586969601258',
      'description': 'सूचना एवं संचार तकनीक (आईसीटी ) व शिक्षा शास्त्र का शिक्षण - अधिगम में समायोजन का मॉड्यूल  शिक्षक/शिक्षक प्रशिक्षक को शिक्षण, अधिगम और मूल्यांकन में उपयुक्त आईसीटी को प्रयोग करने में सक्षम बनाता है।',
      'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130887519261818881205/artifact/nishtha_icon.jpg',
      'idealScreenSize': 'normal',
      'createdOn': '2020-11-03T04:21:36.708+0000',
      'reservedDialcodes': {
        'W1N3W5': 0
      },
      'batches': [
        {
          'createdFor': [
            '01246376237871104093'
          ],
          'endDate': null,
          'name': 'UP_शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी का समन्वय (उत्तर प्रदेश)',
          'batchId': '0131427256528404481',
          'enrollmentType': 'open',
          'enrollmentEndDate': null,
          'startDate': '2020-11-02',
          'status': 1
        }
      ],
      'copyrightYear': 2020,
      'contentDisposition': 'inline',
      'licenseterms': 'I agree that by submitting / publishing this Content, I confirm that this Content complies with the Terms of Use and Content Policy and that I consent to publish it under the Creative Commons Framework. I have made sure that I do not violate copyright or privacy rights of others',
      'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
      'originData': {
        'name': 'UP_शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी का समन्वय (उत्तर प्रदेश)',
        'copyType': 'deep',
        'license': 'CC BY-SA 4.0',
        'organisation': [
          'सहज | SAHAJ'
        ],
        'author': 'NCERT'
      },
      'dialcodeRequired': 'No',
      'lastStatusChangedOn': '2020-11-03T04:24:31.063+0000',
      'createdFor': [
        '0123221758376673287017'
      ],
      'creator': 'Kumar Content Creator',
      'os': [
        'All'
      ],
      'c_diksha_open_batch_count': 0,
      'pkgVersion': 1,
      'versionKey': '1604377469890',
      'idealScreenDensity': 'hdpi',
      'framework': 'TPD',
      'dialcodes': [
        'W1N3W5'
      ],
      'depth': 0,
      's3Key': 'ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
      'lastSubmittedOn': '2020-11-03T04:23:24.515+0000',
      'createdBy': '19abdacf-cb10-4d0b-a5c0-e68f2adb0a4c',
      'compatibilityLevel': 4,
      'leafNodesCount': 32,
      'userConsent': 'Yes',
      'resourceType': 'Course'
    }
};

