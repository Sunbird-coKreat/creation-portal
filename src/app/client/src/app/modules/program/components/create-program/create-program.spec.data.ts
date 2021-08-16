export const contentUploadComponentInput = {
    action: 'preview',
    contentId: 'do_1129159525832540161668',
    'config': {
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
    programContext: {
      config: {
        actions: {
          showChangeFile: {
            roles: [1]
          },
          showRequestChanges: {
            roles: [2]
          },
          showPublish: {
            roles: [2]
          },
          showSubmit: {
            roles: [1]
          },
          showSave: {
            roles: [1]
          },
          showEdit: {
            roles: [1]
          }
        },
        components: [
          {
            id: 'ng.sunbird.uploadComponent',
            ver: '1.0',
            compId: 'uploadContentComponent',
            author: 'Kartheek',
            description: '',
            publishedDate: '',
            data: {},
            config: {
              filesConfig: {
                accepted: 'pdf, mp4, webm, youtube',
                size: '50'
              },
              formConfiguration: [
                {
                  code: 'learningOutcome',
                  dataType: 'list',
                  description: 'Learning Outcomes For The Content',
                  editable: true,
                  inputType: 'multiselect',
                  label: 'Learning Outcome',
                  name: 'LearningOutcome',
                  placeholder: 'Select Learning Outcomes',
                  required: false,
                  visible: true
                },
                {
                  code: 'bloomslevel',
                  dataType: 'list',
                  description: 'Learning Level For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'Learning Level',
                  name: 'LearningLevel',
                  placeholder: 'Select Learning Levels',
                  required: true,
                  visible: true,
                  defaultValue: [
                    'Knowledge (Remembering)',
                    'Comprehension (Understanding)',
                    'Application (Transferring)',
                    'Analysis (Relating)',
                    'Evaluation (Judging)',
                    'Synthesis (Creating)'
                  ]
                },
                {
                  code: 'creator',
                  dataType: 'text',
                  description: 'Enter The Author Name',
                  editable: true,
                  inputType: 'text',
                  label: 'Author',
                  name: 'Author',
                  placeholder: 'Enter Author Name',
                  required: true,
                  visible: true
                },
                {
                  code: 'license',
                  dataType: 'list',
                  description: 'License For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'License',
                  name: 'License',
                  placeholder: 'Select License',
                  required: true,
                  visible: true
                }
              ]
            }
          }
        ],
        config: {
          filesConfig: {accepted: 'pdf, mp4, webm, youtube', size: '50'},
          formConfiguration:  [
            {
              code: 'learningOutcome',
              dataType: 'list',
              defaultValue: ['Spelling Practice', 'Memorizing Practice', 'Writing Practice', 'Searching', 'Patience', 'Computation skill'],
              description: 'Learning Outcomes For The Content',
              editable: true,
              inputType: 'multiselect',
              label: 'Learning Outcome',
              name: 'LearningOutcome',
              placeholder: 'Select Learning Outcomes',
              required: false,
              visible: true
            }
          ],
          resourceTitleLength: '200',
          tenantName: 'SunbirdEd'
        }
      },
      defaultRoles: ['CONTRIBUTOR'],
      programId: '8a038e90-35f5-11ea-af1e-17ee2cf27b43',
      userDetails: {
        enrolledOn: '2020-01-16T05:31:25.798Z',
        onBoarded: true,
        onBoardingData: {school: 'My School'},
        programId: '608de690-3821-11ea-905b-d9320547e5be',
        roles: ['CONTRIBUTOR'],
        userId: '874ed8a5-782e-4f6c-8f36-e0288455901e'
      }
    },
    sessionContext: {
      bloomsLevel: undefined,
      board: 'NCERT',
      channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
      collection: 'do_1127639035982479361130',
      collectionName: 'बाल रामकथा(HINDHI)',
      collectionStatus: undefined,
      collectionType: undefined,
      currentRole: 'CONTRIBUTOR',
      currentRoleId: 1,
      framework: 'NCFCOPY',
      medium: 'English',
      onBoardSchool: undefined,
      program: 'CBSE',
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1'
    },
    templateDetails: {
      filesConfig: {
        accepted: 'pdf',
        size: '50',
        label: 'Explanation'
      },
      metadata: {
        appIcon:
        // tslint:disable-next-line:max-line-length
          'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
        audience: ['Learner'],
        contentType: 'ExplanationResource',
        description: 'ExplanationResource',
        marks: 5,
        name: 'Explanation Resource',
        resourceType: 'Read'
      }
    },
    selectedSharedContext: {
      framework: 'NCFCOPY',
      topic: ['Topic 1']
    },
    unitIdentifier: 'do_1127639059664486401136'
  };

  export const contentMetaData = {
    result: {
      content: {
        SYS_INTERNAL_LAST_UPDATED_ON: '2019-12-18T07:34:33.262+0000',
        appId: 'sunbird.env.sunbird.ins.portal',
        artifactUrl:
          // tslint:disable-next-line:max-line-length
          'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/assets/do_1129159525832540161668/5-mbsamplepdffile_5mb.pdf',
        audience: ['Learner'],
        channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
        code: '3ec87ece-39c4-d8e1-cb77-7a51db464a02',
        compatibilityLevel: 1,
        consumerId: '4190d121-3206-4c9e-b0d4-903fcd87c2ff',
        contentDisposition: 'inline',
        contentEncoding: 'identity',
        contentType: 'ExplanationResource',
        createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e',
        createdOn: '2019-12-18T07:32:48.074+0000',
        creator: 'Creation',
        dialcodeRequired: 'No',
        framework: 'NCFCOPY',
        idealScreenDensity: 'hdpi',
        idealScreenSize: 'normal',
        identifier: 'do_1129159525832540161668',
        language: ['English'],
        languageCode: ['en'],
        lastStatusChangedOn: '2019-12-18T07:32:48.074+0000',
        lastUpdatedOn: '2019-12-18T07:34:33.219+0000',
        license: 'CC BY 4.0',
        mediaType: 'content',
        mimeType: 'application/pdf',
        name: 'Explanation',
        os: ['All'],
        osId: 'org.ekstep.quiz.app',
        ownershipType: ['createdBy'],
        resourceType: 'Learn',
        status: 'Draft',
        version: 2,
        versionKey: '1576654473219',
        visibility: 'Default'
      }
    }
  };

  export const playerConfig = {
    config: {},
    data: {},
    context: {
      pdata: {
        pid: ''
      }
    },
    metadata: {}
  };

  export const frameworkDetails = {
    err: null,
    frameworkdata: {
      NCFCOPY: {
        categories: [
          {
            code: 'board',
            description: '',
            identifier: 'ncfcopy_board',
            index: 1,
            name: 'Curriculum',
            status: 'Live',
            terms: [
              {
                associations: [
                  {
                    category: 'gradeLevel',
                    code: 'kindergarten',
                    description: '',
                    identifier: 'ncfcopy_gradelevel_kindergarten',
                    name: 'Kindergarten',
                    status: 'Live'
                  }
                ],
                category: 'board',
                code: 'ncert',
                description: '',
                identifier: 'ncfcopy_board_ncert',
                index: 1,
                name: 'NCERT',
                status: 'Live'
              }
            ]
          }
        ]
      }
    }
  };

  export const licenseDetails = {
    count: 2,
    license: [
      {
        IL_FUNC_OBJECT_TYPE: 'License',
        IL_SYS_NODE_TYPE: 'DATA_NODE',
        IL_UNIQUE_ID: 'abc-04',
        createdOn: '2019-11-29T12:13:43.783+0000',
        description: 'abc',
        graph_id: 'domain',
        identifier: 'abc-04',
        lastStatusChangedOn: '2019-11-29T12:13:43.783+0000',
        lastUpdatedOn: '2019-11-29T12:13:43.783+0000',
        name: 'ABC 04',
        nodeType: 'DATA_NODE',
        node_id: 357772,
        objectType: 'License',
        status: 'Live',
        url: 'www.url.com',
        versionKey: '1575029623783'
      },
      {
        consumerId: '02bf5216-c947-492f-929b-af2e61ea78cd',
        createdOn: '2019-11-25T13:33:07.797+0000',
        description: 'This license is Creative Commons Attribution',
        graph_id: 'domain',
        identifier: 'cc-by-4.0',
        lastStatusChangedOn: '2019-11-25T13:33:07.797+0000',
        lastUpdatedOn: '2019-12-12T12:10:41.648+0000',
        name: 'CC BY 4.0',
        nodeType: 'DATA_NODE',
        node_id: 341092,
        objectType: 'License',
        status: 'Live',
        url: 'https://creativecommons.org/licenses/by/4.0/legalcode',
        versionKey: '1576152641648'
      }
    ]
  };

  export const updateContentResponse = {
    result: {
      identifier: 'do_1129159525832540161668',
      node_id: 'do_1129159525832540161668',
      versionKey: '1577098360997'
    }
  };

  export const getPreSignedUrl = {
    result: {
      content_id: 'do_112919628453183488190',
      pre_signed_url:
        // tslint:disable-next-line:max-line-length
        'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/assets/do_112919628453183488190/samplevideo_1280x720_1mb.mp4?sv=2017-04-17&se=2019-12-23T12%3A52%3A28Z&sr=b&sp=w&sig=GAnjDsJZxtoIfefWIEqyaWSBYmVk/NeYgK8zQhgEiYE%3D',
      url_expiry: '600'
    }
  };

  export const contentMetaData1 = {
    result: {
      content: {
        SYS_INTERNAL_LAST_UPDATED_ON: '2019-12-18T07:34:33.262+0000',
        appId: 'sunbird.env.sunbird.ins.portal',
        artifactUrl:
          // tslint:disable-next-line:max-line-length
          'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/assets/do_1129159525832540161668/5-mbsamplepdffile_5mb.pdf',
        audience: ['Learner'],
        channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
        code: '3ec87ece-39c4-d8e1-cb77-7a51db464a02',
        compatibilityLevel: 1,
        consumerId: '4190d121-3206-4c9e-b0d4-903fcd87c2ff',
        contentDisposition: 'inline',
        contentEncoding: 'identity',
        contentType: 'ExplanationResource',
        createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e',
        createdOn: '2019-12-18T07:32:48.074+0000',
        creator: 'Creation',
        dialcodeRequired: 'No',
        framework: 'NCFCOPY',
        idealScreenDensity: 'hdpi',
        idealScreenSize: 'normal',
        identifier: 'do_1129159525832540161668',
        language: ['English'],
        languageCode: ['en'],
        lastStatusChangedOn: '2019-12-18T07:32:48.074+0000',
        lastUpdatedOn: '2019-12-18T07:34:33.219+0000',
        license: 'CC BY 4.0',
        mediaType: 'content',
        mimeType: 'application/pdf',
        name: 'Explanation',
        os: ['All'],
        osId: 'org.ekstep.quiz.app',
        ownershipType: ['createdBy'],
        resourceType: 'Learn',
        status: 'Review',
        version: 2,
        versionKey: '1576654473219',
        visibility: 'Default'
      }
    }
  };
  export const contentUploadComponentInput1 = {
    action: 'preview',
    contentId: 'do_1129159525832540161668',
    'config': {
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
    programContext: {
      config: {
        actions: {
          showChangeFile: {
            roles: [1]
          },
          showRequestChanges: {
            roles: [2]
          },
          showPublish: {
            roles: [2]
          },
          showSubmit: {
            roles: [1]
          },
          showSave: {
            roles: [1]
          },
          showEdit: {
            roles: [1]
          }
        },
        components: [
          {
            id: 'ng.sunbird.uploadComponent',
            ver: '1.0',
            compId: 'uploadContentComponent',
            author: 'Kartheek',
            description: '',
            publishedDate: '',
            data: {},
            config: {
              filesConfig: {
                accepted: 'pdf, mp4, webm, youtube',
                size: '50'
              },
              formConfiguration: [
                {
                  code: 'learningOutcome',
                  dataType: 'list',
                  description: 'Learning Outcomes For The Content',
                  editable: true,
                  inputType: 'multiselect',
                  label: 'Learning Outcome',
                  name: 'LearningOutcome',
                  placeholder: 'Select Learning Outcomes',
                  required: false,
                  visible: true
                },
                {
                  code: 'bloomslevel',
                  dataType: 'list',
                  description: 'Learning Level For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'Learning Level',
                  name: 'LearningLevel',
                  placeholder: 'Select Learning Levels',
                  required: true,
                  visible: true,
                  defaultValue: [
                    'Knowledge (Remembering)',
                    'Comprehension (Understanding)',
                    'Application (Transferring)',
                    'Analysis (Relating)',
                    'Evaluation (Judging)',
                    'Synthesis (Creating)'
                  ]
                },
                {
                  code: 'creator',
                  dataType: 'text',
                  description: 'Enter The Author Name',
                  editable: true,
                  inputType: 'text',
                  label: 'Author',
                  name: 'Author',
                  placeholder: 'Enter Author Name',
                  required: true,
                  visible: true
                },
                {
                  code: 'license',
                  dataType: 'list',
                  description: 'License For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'License',
                  name: 'License',
                  placeholder: 'Select License',
                  required: true,
                  visible: true
                }
              ]
            }
          }
        ],
        config: {
          filesConfig: {accepted: 'pdf, mp4, webm, youtube', size: '50'},
          formConfiguration:  [
            {
              code: 'learningOutcome',
              dataType: 'list',
              defaultValue: ['Spelling Practice', 'Memorizing Practice', 'Writing Practice', 'Searching', 'Patience', 'Computation skill'],
              description: 'Learning Outcomes For The Content',
              editable: true,
              inputType: 'multiselect',
              label: 'Learning Outcome',
              name: 'LearningOutcome',
              placeholder: 'Select Learning Outcomes',
              required: false,
              visible: true
            }
          ],
          resourceTitleLength: '200',
          tenantName: 'SunbirdEd'
        }
      },
      defaultRoles: ['CONTRIBUTOR'],
      programId: '8a038e90-35f5-11ea-af1e-17ee2cf27b43',
      userDetails: {
        enrolledOn: '2020-01-16T05:31:25.798Z',
        onBoarded: true,
        onBoardingData: {school: 'My School'},
        programId: '608de690-3821-11ea-905b-d9320547e5be',
        roles: ['CONTRIBUTOR'],
        userId: '874ed8a5-782e-4f6c-8f36-e0288455901e'
      }
    },
    sessionContext: {
      bloomsLevel: undefined,
      board: 'NCERT',
      channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
      collection: 'do_1127639035982479361130',
      collectionName: 'बाल रामकथा(HINDHI)',
      collectionStatus: undefined,
      collectionType: undefined,
      currentRole: 'CONTRIBUTOR',
      currentRoleId: 2,
      framework: 'NCFCOPY',
      medium: 'English',
      onBoardSchool: undefined,
      program: 'CBSE',
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1'
    },
    templateDetails: {
      filesConfig: {
        accepted: 'pdf',
        size: '50',
        label: 'Explanation'
      },
      metadata: {
        appIcon:
        // tslint:disable-next-line:max-line-length
          'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
        audience: ['Learner'],
        contentType: 'ExplanationResource',
        description: 'ExplanationResource',
        marks: 5,
        name: 'Explanation Resource',
        resourceType: 'Read'
      }
    },
    selectedSharedContext: {
      framework: 'NCFCOPY',
      topic: ['Topic 1']
    },
    unitIdentifier: 'do_1127639059664486401136'
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
            },
            'forms': {
              'blueprintCreate': {
                  'templateName': '',
                  'required': [],
                  'properties': [
                      {
                          'code': 'topics',
                          'dataType': 'list',
                          'description': '',
                          'editable': true,
                          'index': 0,
                          'inputType': 'multiSelect',
                          'label': 'Chapters',
                          'name': 'Chapters',
                          'placeholder': 'Please select chapters',
                          'renderingHints': {},
                          'required': true
                      }
                  ]
              }
        }
    }
  }
  };
  export const userProfile = {
    userId: '123456789',
    rootOrg : {
      slug: 'sunbird'
    }
  };
  export const programDetails = {
    result : {
    'program_id': '0dceb6f0-eaea-11eb-9ee7-09812e08a188',
    'name': 'Number Magic - 2',
    'description': 'Number Magic - 2',
    'type': 'private',
    'collection_ids': [
      'do_1131975645014835201326'
    ],
    'content_types': [],
    'target_collection_category': [
      'Digital Textbook'
    ],
    'targetprimarycategories': [{
      'name': 'eTextbook',
      'identifier': 'obj-cat:etextbook_content_all',
      'targetObjectType': 'Content'
    }],
    'targetprimarycategorynames': [
      'eTextbook'
    ],
    'startdate': '2021-07-22T12:41:31.996Z',
    'enddate': '2021-08-21T18:29:59.000Z',
    'nomination_enddate': null,
    'shortlisting_enddate': null,
    'content_submission_enddate': '2021-08-01T18:29:59.000Z',
    'image': null,
    'status': 'Unlisted',
    'slug': 'sunbird',
    'config': {
      'board': [
        'CBSE'
      ],
      'roles': [{
          'id': 1,
          'name': 'CONTRIBUTOR',
          'tabs': [
            1
          ],
          'default': true,
          'defaultTab': 1
        },
        {
          'id': 2,
          'name': 'REVIEWER',
          'tabs': [
            2
          ],
          'defaultTab': 2
        }
      ],
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
        },
        'description': '',
        'publishedDate': ''
      },
      'medium': [
        'English'
      ],
      'subject': [
        'Hindi'
      ],
      '_comments': '',
      'framework': [
        'ekstep_ncert_k-12'
      ],
      'components': [{
          'id': 'ng.sunbird.collection',
          'ver': '1.0',
          'data': {},
          'author': 'Venkat',
          'compId': 'collectionComponent',
          'config': {
            'status': [
              'Draft',
              'Live'
            ],
            'filters': {
              'explicit': [{
                  'code': 'gradeLevel',
                  'label': 'Class',
                  'range': [
                    'Kindergarten',
                    'Grade 1',
                    'Grade 2',
                    'Grade 3'
                  ],
                  'visibility': true,
                  'multiselect': false,
                  'defaultValue': [
                    'Kindergarten',
                    'Grade 1'
                  ]
                },
                {
                  'code': 'subject',
                  'label': 'Subject',
                  'range': [
                    'English',
                    'Mathematics',
                    'Hindi'
                  ],
                  'visibility': true,
                  'multiselect': false,
                  'defaultValue': [
                    'English'
                  ]
                }
              ],
              'implicit': [{
                  'code': 'framework',
                  'label': 'Framework',
                  'defaultValue': 'ekstep_ncert_k-12'
                },
                {
                  'code': 'board',
                  'label': 'Board',
                  'defaultValue': 'CBSE'
                },
                {
                  'code': 'medium',
                  'label': 'Medium',
                  'defaultValue': [
                    'English'
                  ]
                }
              ]
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
        },
        {
          'id': 'ng.sunbird.chapterList',
          'ver': '1.0',
          'data': {},
          'author': 'Kartheek',
          'compId': 'chapterListComponent',
          'config': {
            'contentTypes': {
              'value': [{
                  'id': 'explanationContent',
                  'label': 'Explanation',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Explanation Resource',
                    'marks': 5,
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'ExplanationResource',
                    'description': 'ExplanationResource',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'video/mp4',
                    'video/webm',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, mp4, webm, epub'
                  }
                },
                {
                  'id': 'learningActivity',
                  'label': 'Activity for Learning',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Activity for Learning',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'LearningActivity',
                    'description': 'LearningActivity',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'video/mp4',
                    'video/webm',
                    'application/epub',
                    'application/vnd.ekstep.h5p-archive'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, mp4, webm, epub, h5p'
                  }
                },
                {
                  'id': 'experientialContent',
                  'label': 'Experiential',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Experiential Resource',
                    'marks': 5,
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'ExperientialResource',
                    'description': 'ExperientialResource',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'video/mp4',
                    'video/webm'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'mp4, webm'
                  }
                },
                {
                  'id': 'classroomTeachingVideo',
                  'label': 'Classroom Teaching Video',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Classroom Teaching Video',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'ClassroomTeachingVideo',
                    'description': 'ClassroomTeachingVideo',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'video/mp4',
                    'video/webm'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'mp4, webm'
                  }
                },
                {
                  'id': 'explanationVideo',
                  'label': 'Explanation Video',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Explanation Video',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'ExplanationVideo',
                    'description': 'ExplanationVideo',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'video/mp4',
                    'video/webm'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'mp4, webm'
                  }
                },
                {
                  'id': 'explanationReadingMaterial',
                  'label': 'Explanation Reading Material',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Explanation Reading Material',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'ExplanationReadingMaterial',
                    'description': 'ExplanationReadingMaterial',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'previousBoardExamPapers',
                  'label': 'Previous Board Exam Papers',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Previous Board Exam Papers',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PreviousBoardExamPapers',
                    'description': 'PreviousBoardExamPapers',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'lessonPlanResource',
                  'label': 'Lesson Plan',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Lesson Plan',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'LessonPlanResource',
                    'description': 'LessonPlanResource',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'focusSpotContent',
                  'label': 'FocusSpot',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'FocusSpot Resource',
                    'marks': 5,
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'FocusSpot',
                    'description': 'FocusSpot',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'TeachingMethod',
                  'label': 'Teaching Method',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Teaching Method',
                    'marks': 5,
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'TeachingMethod',
                    'description': 'TeachingMethod',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'PedagogyFlow',
                  'label': 'Pedagogy Flow',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Pedagogy Flow',
                    'marks': 5,
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PedagogyFlow',
                    'description': 'PedagogyFlow',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'LearningOutcomeDefinition',
                  'label': 'Learning Outcome Definition',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Learning Outcome Definition',
                    'marks': 5,
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'LearningOutcomeDefinition',
                    'description': 'LearningOutcomeDefinition',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'MarkingSchemeRubric',
                  'label': 'Marking Scheme Rubric',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Marking Scheme Rubric',
                    'marks': 5,
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'MarkingSchemeRubric',
                    'description': 'MarkingSchemeRubric',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'ConceptMap',
                  'label': 'Concept Map',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Concept Map',
                    'marks': 5,
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'ConceptMap',
                    'description': 'ConceptMap',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'SelfAssess',
                  'label': 'Self Assess',
                  'onClick': 'uploadComponent',
                  'metadata': {
                    'name': 'Self Assess',
                    'marks': 5,
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'SelfAssess',
                    'description': 'SelfAssess',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf',
                    'application/epub'
                  ],
                  'filesConfig': {
                    'size': '50',
                    'accepted': 'pdf, epub'
                  }
                },
                {
                  'id': 'vsaPracticeQuestionContent',
                  'label': 'VSA - Practice Sets',
                  'onClick': 'questionSetComponent',
                  'metadata': {
                    'name': 'Practice QuestionSet',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PracticeQuestionSet',
                    'description': 'Practice QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'questionCategories': [
                    'vsa'
                  ]
                },
                {
                  'id': 'saPracticeQuestionContent',
                  'label': 'SA - Practice Sets',
                  'onClick': 'questionSetComponent',
                  'metadata': {
                    'name': 'Practice QuestionSet',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PracticeQuestionSet',
                    'description': 'Practice QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'questionCategories': [
                    'sa'
                  ]
                },
                {
                  'id': 'laPracticeQuestionContent',
                  'label': 'LA - Practice Sets',
                  'onClick': 'questionSetComponent',
                  'metadata': {
                    'name': 'Practice QuestionSet',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PracticeQuestionSet',
                    'description': 'Practice QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'questionCategories': [
                    'la'
                  ]
                },
                {
                  'id': 'mcqPracticeQuestionContent',
                  'label': 'MCQ - Practice Sets',
                  'onClick': 'questionSetComponent',
                  'metadata': {
                    'name': 'Practice QuestionSet',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PracticeQuestionSet',
                    'description': 'Practice QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'questionCategories': [
                    'mcq'
                  ]
                },
                {
                  'id': 'curiositySetContent',
                  'label': 'Curiosity Sets',
                  'onClick': 'curiositySetComponent',
                  'metadata': {
                    'name': 'Curiosity QuestionSet',
                    'marks': 5,
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'CuriosityQuestionSet',
                    'description': 'Curiosity QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'questionCategories': [
                    'curiosity'
                  ]
                }
              ],
              'defaultValue': [{
                'id': 'vsaPracticeQuestionContent',
                'label': 'Practice Sets',
                'onClick': 'questionSetComponent',
                'metadata': {
                  'name': 'Practice QuestionSet',
                  'marks': 5,
                  'appIcon': '',
                  'audience': [
                    'Learner'
                  ],
                  'contentType': 'PracticeQuestionSet',
                  'description': 'Practice QuestionSet',
                  'resourceType': 'Learn'
                },
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'questionCategories': [
                  'vsa'
                ]
              }]
            }
          },
          'description': '',
          'publishedDate': ''
        },
        {
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
              },
              {
                'code': 'attributions',
                'name': 'Attributions',
                'label': 'Attributions',
                'visible': true,
                'dataType': 'list',
                'editable': true,
                // tslint:disable-next-line:max-line-length
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
                // tslint:disable-next-line:max-line-length
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
          'description': '',
          'publishedDate': ''
        },
        {
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
              },
              {
                'code': 'attributions',
                'name': 'Attributions',
                'label': 'Attributions',
                'visible': true,
                'dataType': 'list',
                'editable': true,
                // tslint:disable-next-line:max-line-length
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
                // tslint:disable-next-line:max-line-length
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
          'description': '',
          'publishedDate': ''
        },
        {
          'id': 'ng.sunbird.dashboard',
          'ver': '1.0',
          'data': {},
          'author': 'Venkanna Gouda',
          'compId': 'dashboardComp',
          'config': {},
          'description': '',
          'publishedDate': ''
        }
      ],
      'gradeLevel': [
        'Class 10'
      ],
      'collections': [{
        'id': 'do_1131975645014835201326',
        'children': [{
            'id': 'do_1131975645361274881476',
            'allowed_content_types': []
          },
          {
            'id': 'do_1131975645365125121526',
            'allowed_content_types': []
          },
          {
            'id': 'do_1131975645363568641504',
            'allowed_content_types': []
          },
          {
            'id': 'do_1131975645360373761464',
            'allowed_content_types': []
          },
          {
            'id': 'do_1131975645358899201442',
            'allowed_content_types': []
          },
          {
            'id': 'do_1131975645364469761516',
            'allowed_content_types': []
          },
          {
            'id': 'do_1131975645358407681434',
            'allowed_content_types': []
          },
          {
            'id': 'do_1131975645354311681384',
            'allowed_content_types': []
          }
        ],
        'allowed_content_types': []
      }],
      'blueprintMap': {},
      'loginReqired': true,
      'sharedContext': [
        'channel',
        'framework',
        'board',
        'medium',
        'gradeLevel',
        'subject',
        'topic'
      ],
      'defaultContributeOrgReview': true
    },
    'rolemapping': {
      'REVIEWER': [
        '424644bc-62ec-4222-b79c-206e1bf83807'
      ]
    },
    'createdby': '5a587cc1-e018-4859-a0a8-e842650b9d64',
    'updatedby': null,
    'createdon': '2021-07-22T12:41:31.996Z',
    'updatedon': '2021-07-22T12:41:51.542Z',
    'rootorg_id': '01309282781705830427',
    'sourcing_org_name': 'NIT',
    'channel': 'DIKSHA',
    'template_id': 'template1',
    'guidelines_url': null
    }
  };
  export const channelData = {
    'channel': {
        'code': '01309282781705830427',
        'frameworks': [
            {
                'name': 'nit_k-12',
                'relation': 'hasSequenceMember',
                'identifier': 'nit_k-12',
                'description': 'nit_k-12 Framework',
                'objectType': 'Framework',
                'status': 'Live',
                'type': 'K-12'
            },
            {
                'name': 'nit_tpd',
                'relation': 'hasSequenceMember',
                'identifier': 'nit_tpd',
                'description': 'nit_tpd Framework',
                'objectType': 'Framework',
                'status': 'Live',
                'type': 'TPD'
            }
        ],
        'channel': 'in.ekstep',
        'description': 'Preprod Kayal Org',
        'createdOn': '2020-08-24T05:00:51.381+0000',
        'objectType': 'Channel',
        'collectionPrimaryCategories': [
            'Content Playlist',
            'Course',
            'Digital Textbook',
            'Question paper'
        ],
        'appId': '@ignore@',
        'primaryCategories': [
            {
                'identifier': 'obj-cat:asset_asset_all',
                'name': 'Asset',
                'targetObjectType': 'Asset'
            },
            {
                'identifier': 'obj-cat:content-playlist_collection_all',
                'name': 'Content Playlist',
                'targetObjectType': 'Collection'
            },
            {
                'identifier': 'obj-cat:content-playlist_content_all',
                'name': 'Content Playlist',
                'targetObjectType': 'Content'
            },
            {
                'identifier': 'obj-cat:course-assessment_collection_all',
                'name': 'Course Assessment',
                'targetObjectType': 'Collection'
            },
            {
                'identifier': 'obj-cat:course-assessment_content_all',
                'name': 'Course Assessment',
                'targetObjectType': 'Content'
            },
            {
                'identifier': 'obj-cat:curriculum-course_collection_all',
                'name': 'Curriculum Course',
                'targetObjectType': 'Collection'
            },
            {
                'identifier': 'obj-cat:demo-practice-question-set_questionset_all',
                'name': 'Demo Practice Question Set',
                'targetObjectType': 'QuestionSet'
            },
            {
                'identifier': 'obj-cat:digital-textbook_collection_all',
                'name': 'Digital Textbook',
                'targetObjectType': 'Collection'
            },
            {
                'identifier': 'obj-cat:etextbook_content_all',
                'name': 'eTextbook',
                'targetObjectType': 'Content'
            },
            {
                'identifier': 'obj-cat:explanation-content_content_all',
                'name': 'Explanation Content',
                'targetObjectType': 'Content'
            },
            {
                'identifier': 'obj-cat:ftb-question_question_all',
                'name': 'FTB Question',
                'targetObjectType': 'Question'
            },
            {
                'identifier': 'obj-cat:learning-resource_content_all',
                'name': 'Learning Resource',
                'targetObjectType': 'Content'
            },
            {
                'identifier': 'obj-cat:multiple-choice-question_question_all',
                'name': 'Multiple Choice Question',
                'targetObjectType': 'Question'
            },
            {
                'identifier': 'obj-cat:practice-question-set_question_all',
                'name': 'Practice Question Set',
                'targetObjectType': 'Question'
            },
            {
                'identifier': 'obj-cat:practice-question-set_content_all',
                'name': 'Practice Question Set',
                'targetObjectType': 'Content'
            },
            {
                'identifier': 'obj-cat:professional-development-course_collection_all',
                'name': 'Professional Development Course',
                'targetObjectType': 'Collection'
            },
            {
                'identifier': 'obj-cat:subjective-question_question_all',
                'name': 'Subjective Question',
                'targetObjectType': 'Question'
            },
            {
                'identifier': 'obj-cat:teacher-resource_content_all',
                'name': 'Teacher Resource',
                'targetObjectType': 'Content'
            },
            {
                'identifier': 'obj-cat:course_collection_01309282781705830427',
                'name': 'Course',
                'targetObjectType': 'Collection'
            },
            {
                'identifier': 'obj-cat:exam-question_content_01309282781705830427',
                'name': 'Exam Question',
                'targetObjectType': 'Content'
            },
            {
                'identifier': 'obj-cat:question-paper_collection_01309282781705830427',
                'name': 'Question Paper',
                'targetObjectType': 'Collection'
            }
        ],
        'additionalCategories': [],
        'lastUpdatedOn': '2021-04-09T13:43:13.465+0000',
        'collectionAdditionalCategories': [
            'Textbook',
            'Lesson Plan'
        ],
        'contentAdditionalCategories': [
            'Classroom Teaching Video',
            'Concept Map',
            'Curiosity Question Set',
            'Experiential Resource',
            'Explanation Video',
            'Focus Spot',
            'Learning Outcome Definition',
            'Lesson Plan',
            'Marking Scheme Rubric',
            'Pedagogy Flow',
            'Previous Board Exam Papers',
            'TV Lesson',
            'Textbook'
        ],
        'apoc_num': 1,
        'identifier': '01309282781705830427',
        'lastStatusChangedOn': '2020-08-24T05:00:51.381+0000',
        'consumerId': '7411b6bd-89f3-40ec-98d1-229dc64ce77d',
        'assetAdditionalCategories': [],
        'languageCode': [],
        'versionKey': '1617975793465',
        'contentPrimaryCategories': [
            'Course Assessment',
            'eTextbook',
            'Explanation Content',
            'Learning Resource',
            'Practice Question Set',
            'Teacher Resource',
            'Exam Question'
        ],
        'name': 'NIT123',
        'defaultCourseFramework': 'TPD',
        'assetPrimaryCategories': [
            'Asset',
            'CertAsset',
            'Certificate Template'
        ],
        'status': 'Live',
        'defaultFramework': 'ekstep_ncert_k-12'
    }
  };
  export const tempCollections = [
    {
        'ownershipType': [
            'createdBy'
        ],
        'copyright': 'NIT',
        'subject': [
            'Mathematics'
        ],
        'channel': '01309282781705830427',
        'organisation': [
            'NIT'
        ],
        'language': [
            'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'objectType': 'Content',
        'gradeLevel': [
            'Class 2'
        ],
        'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png',
        'primaryCategory': 'Digital Textbook',
        'contentEncoding': 'gzip',
        'lockKey': '1636f7a6-ad18-492b-a55b-5ced68e86f9d',
        'generateDIALCodes': 'No',
        'contentType': 'TextBook',
        'trackable': {
            'enabled': 'No',
            'autoBatch': 'No'
        },
        'identifier': 'do_11332149758691737612',
        'lastUpdatedBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
        'audience': [
            'Student'
        ],
        'visibility': 'Default',
        'consumerId': '273f3b18-5dda-4a27-984a-060c7cd398d3',
        'childNodes': [
            'do_11332149813058764813',
            'do_11332149813308620815',
            'do_113321500668067840194',
            'do_113321501394665472195'
        ],
        'discussionForum': {
            'enabled': 'Yes'
        },
        'mediaType': 'content',
        'osId': 'org.ekstep.quiz.app',
        'graph_id': 'domain',
        'nodeType': 'DATA_NODE',
        'version': 2,
        'license': 'CC BY 4.0',
        'IL_FUNC_OBJECT_TYPE': 'Collection',
        'name': '2021',
        'topic': [],
        'status': 'Draft',
        'code': 'org.sunbird.ikwy0D',
        'credentials': {
            'enabled': 'No'
        },
        'description': 'Enter description for TextBook',
        'medium': [
            'English'
        ],
        'idealScreenSize': 'normal',
        'createdOn': '2021-07-13T06:56:13.411+0000',
        'contentDisposition': 'inline',
        'additionalCategories': [
            'Textbook'
        ],
        // tslint:disable-next-line:max-line-length
        'licenseterms': 'By creating and uploading content on DIKSHA, you consent to publishing this content under the Creative Commons Framework, specifically under the CC-BY-SA 4.0 license.',
        'lastUpdatedOn': '2021-07-29T08:56:38.794+0000',
        'dialcodeRequired': 'No',
        'createdFor': [
            '01309282781705830427'
        ],
        'creator': 'N11',
        'os': [
            'All'
        ],
        'IL_SYS_NODE_TYPE': 'DATA_NODE',
        'versionKey': '1627548998794',
        'idealScreenDensity': 'hdpi',
        'framework': 'ekstep_ncert_k-12',
        'depth': 0,
        'createdBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
        'compatibilityLevel': 1,
        'userConsent': 'Yes',
        'IL_UNIQUE_ID': 'do_11332149758691737612',
        'board': 'CBSE',
        'resourceType': 'Book',
        'node_id': 515766,
        'selected': 2,
        'total': 2,
        'contentTypeUnit': 'Chapter'
    }
  ];
  export const hierarchyRead = {
    result: {
      content: {
        'ownershipType': [
          'createdBy'
        ],
        'copyright': 'NIT',
        'subject': [
          'Chemistry'
        ],
        'channel': 'sunbird',
        'organisation': [
          'NIT'
        ],
        'language': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'objectType': 'Content',
        'chapterCountForContribution': 2,
        'se_mediums': [
          'Telugu'
        ],
        'gradeLevel': [
          'Class1'
        ],
        // tslint:disable-next-line:max-line-length
        'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_112327933149642752199/artifact/00001_1468318704124_427_1504874563_1504874652199.png',
        'primaryCategory': 'Course',
        'children': [{
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_1133407744582696961763',
            'copyright': 'NIT',
            'code': 'do_1131687102343086081720',
            'credentials': {
              'enabled': 'No'
            },
            'origin': 'do_1131687102343086081720',
            'channel': 'sunbird',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2021-08-09T12:35:07.202+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2021-08-09T12:35:07.201+0000',
            'contentEncoding': 'gzip',
            'originData': {
              'channel': '01309282781705830427'
            },
            'contentType': 'CourseUnit',
            'dialcodeRequired': 'No',
            'trackable': {
              'enabled': 'No',
              'autoBatch': 'No'
            },
            'identifier': 'do_1133407744589905921766',
            'lastStatusChangedOn': '2021-08-09T12:35:07.202+0000',
            'audience': [
              'Student'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 1,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'version': 2,
            'versionKey': '1628512507202',
            'allowedContentTypes': [
              'Demo Practice Question Set',
              'Content Playlist',
              'Course Assessment',
              'eTextbook',
              'Explanation Content',
              'Learning Resource',
              'Practice Question Set',
              'Teacher Resource',
              'Exam Question'
            ],
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'compatibilityLevel': 1,
            'name': 'U1',
            'openForContribution': true,
            'programId': 'f8931290-f8d6-11eb-8d22-35d6fc24c6f9',
            'status': 'Draft'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_1133407744582696961763',
            'copyright': 'NIT',
            'code': 'do_1131687102342922241718',
            'credentials': {
              'enabled': 'No'
            },
            'origin': 'do_1131687102342922241718',
            'channel': 'sunbird',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2021-08-09T12:35:07.200+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2021-08-09T12:35:07.200+0000',
            'contentEncoding': 'gzip',
            'originData': {
              'channel': '01309282781705830427'
            },
            'contentType': 'CourseUnit',
            'dialcodeRequired': 'No',
            'trackable': {
              'enabled': 'No',
              'autoBatch': 'No'
            },
            'identifier': 'do_1133407744589824001764',
            'lastStatusChangedOn': '2021-08-09T12:35:07.200+0000',
            'audience': [
              'Student'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 2,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'version': 2,
            'versionKey': '1628512507200',
            'allowedContentTypes': [
              'Demo Practice Question Set',
              'Content Playlist',
              'Course Assessment',
              'eTextbook',
              'Explanation Content',
              'Learning Resource',
              'Practice Question Set',
              'Teacher Resource',
              'Exam Question'
            ],
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'compatibilityLevel': 1,
            'name': 'U2',
            'openForContribution': true,
            'programId': 'f8931290-f8d6-11eb-8d22-35d6fc24c6f9',
            'status': 'Draft'
          }
        ],
        'contentEncoding': 'gzip',
        'contentType': 'Course',
        'se_gradeLevels': [
          'Class1'
        ],
        'trackable': {
          'enabled': 'Yes',
          'autoBatch': 'Yes'
        },
        'identifier': 'do_1133407744582696961763',
        'lastUpdatedBy': '5c3a2a46-4830-4ade-a4cd-b6780635569c',
        'audience': [
          'Student'
        ],
        'visibility': 'Default',
        'consumerId': 'fa13b438-8a3d-41b1-8278-33b0c50210e4',
        'childNodes': [
          'do_1133407744589905921766',
          'do_1133407744589824001764'
        ],
        'mediaType': 'content',
        'osId': 'org.ekstep.quiz.app',
        'languageCode': [
          'en'
        ],
        'version': 2,
        'se_subjects': [
          'Chemistry'
        ],
        'allowedContentTypes': [
          'Demo Practice Question Set',
          'Content Playlist',
          'Course Assessment',
          'eTextbook',
          'Explanation Content',
          'Learning Resource',
          'Practice Question Set',
          'Teacher Resource',
          'Exam Question'
        ],
        'license': 'CC BY 4.0',
        'name': '1436:content',
        'status': 'Draft',
        'code': 'org.sunbird.s5tMI8',
        'credentials': {
          'enabled': 'Yes'
        },
        'origin': 'do_1131687097896140801717',
        'description': 'Enter description for Course',
        'medium': [
          'Telugu'
        ],
        'idealScreenSize': 'normal',
        'createdOn': '2021-08-09T12:35:07.114+0000',
        'copyrightYear': 1234,
        'contentDisposition': 'inline',
        'licenseterms': 'By creating and uploading content on DIKSHA, you consent to publishing this content under the Creative Commons Framework, specifically under the CC-BY-SA 4.0 license.',
        'lastUpdatedOn': '2021-08-09T12:35:07.219+0000',
        'originData': {
          'channel': '01309282781705830427'
        },
        'dialcodeRequired': 'No',
        'lastStatusChangedOn': '2021-08-09T12:35:07.114+0000',
        'createdFor': [
          '01309282781705830427'
        ],
        'creator': 'N115',
        'os': [
          'All'
        ],
        'chapterCount': 2,
        'versionKey': '1628512507219',
        'idealScreenDensity': 'hdpi',
        'framework': 'TPD',
        'depth': 0,
        'createdBy': '5c3a2a46-4830-4ade-a4cd-b6780635569c',
        'compatibilityLevel': 1,
        'userConsent': 'Yes',
        'openForContribution': true,
        'programId': 'f8931290-f8d6-11eb-8d22-35d6fc24c6f9',
        'resourceType': 'Course'
      }
    }
  };
