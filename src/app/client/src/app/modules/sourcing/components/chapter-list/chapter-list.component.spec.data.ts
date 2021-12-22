export const chapterListComponentInput = {
  sessionContext: {
    framework: 'NCFCOPY',
    currentRoles: ['CONTRIBUTOR'],
    currentRole: 'CONTRIBUTOR',
    programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1',
    program: 'CBSE 2',
    onBoardSchool: 'My School',
    board: 'NCERT',
    channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
    medium: ['English'],
    gradeLevel: ['Grade 1'],
    subject: ['English'],
    topic: null,
    currentRoleId: 1,
    collection: 'do_1127639035982479361130',
    collectionName: 'बाल रामकथा(HINDHI)',
    lastOpenedUnitParent: 'do_1127639059664568321138',
    topicList: [
      {
        identifier: 'ncfcopy_topic_topic1',
        code: 'topic1',
        translations: null,
        name: 'Topic, topic 1',
        description: 'Mathematics',
        index: 1,
        category: 'topic',
        status: 'Live'
      }
    ],
    nominationDetails: {
      "id": 15468,
      "program_id": "abcd1234",
      "user_id": "abcd-e018-4859-a0a8-e842650b9d64",
      "organisation_id": "abcd-42a7-44c8-84f4-8cfea235f07d",
      "status": "Approved",
      "content_types": null,
      "targetprimarycategories": [
          {
              "name": "eTextbook",
              "identifier": "obj-cat:etextbook_content_all",
              "targetObjectType": "Content"
          },
          {
              "name": "Explanation Content",
              "identifier": "obj-cat:explanation-content_content_all",
              "targetObjectType": "Content"
          },
          {
              "name": "Learning Resource",
              "identifier": "obj-cat:learning-resource_content_all",
              "targetObjectType": "Content"
          },
          {
              "name": "Teacher Resource",
              "identifier": "obj-cat:teacher-resource_content_all",
              "targetObjectType": "Content"
          }
      ],
      "targetprimarycategorynames": [
          "eTextbook",
          "Explanation Content",
          "Learning Resource",
          "Teacher Resource"
      ],
      "collection_ids": [
          "do_11337024881991680011182"
      ],
      "rolemapping": null,
      "userData": {
          "osUpdatedAt": "2021-09-16T01:35:47.356Z",
          "lastName": "",
          "enrolledDate": "2020-08-24T11:24:10.893Z",
          "@type": "User",
          "subject": [
              "Tamil",
              "English",
              "Computer Applications",
              "Mathematics",
              "Environmental Studies",
              "Hindi",
              "null",
              "Science",
              "Geography",
              "Urdu"
          ],
          "roles": [
              "admin",
              "sourcing_reviewer"
          ],
          "channel": "01309282781705830427",
          "osid": "179b8dcd-ad56-42fd-83d1-9459bb8e4489",
          "medium": [
              "English",
              "Tamil",
              "Hindi",
              "null",
              "Kannada"
          ],
          "userId": "5a587cc1-e018-4859-a0a8-e842650b9d64",
          "firstName": "N11",
          "gradeLevel": [
              "Class 7",
              "Class 2",
              "Class 1",
              "Class 10",
              "Class 3",
              "Class 9",
              "Class 4",
              "Class 6",
              "Class 5",
              "Class 8",
              "Grade 1",
              "Grade 2",
              "Grade 6"
          ],
          "osCreatedAt": "2021-09-16T01:35:47.356Z"
      },
      "orgData": {
          "osUpdatedAt": "2020-08-24T11:23:53.873Z",
          "code": "NIT",
          "osCreatedAt": "2020-08-24T11:23:53.873Z",
          "createdBy": "9e41deb1-daf3-4e0d-b45d-cfcad7291af9",
          "@type": "Org",
          "name": "NIT",
          "description": "NIT",
          "osid": "e7328d77-42a7-44c8-84f4-8cfea235f07d",
          "type": [
              "contribute",
              "sourcing"
          ],
          "orgId": "01309282781705830427"
      }
    },
    telemetryPageDetails: {
      telemetryPageId: 'dummyPage',
      telemetryInteractCdata: {}
    }
  },
  collection: {
    name: 'बाल रामकथा(HINDHI)',
    image:
// tslint:disable-next-line:max-line-length
      'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.thumb.jpg',
    description: 'Enter description for TextBook',
    rating: '0',
    subject: ['Hindi'],
    medium: ['English'],
    orgDetails: {},
    gradeLevel: 'Kindergarten',
    contentType: 'TextBook',
    topic: '',
    subTopic: '',
    metaData: {
      identifier: 'do_1127639035982479361130',
      mimeType: 'application/vnd.ekstep.content-collection',
      framework: 'NCFCOPY',
      contentType: 'TextBook'
    }
  },
  config: {
    id: 'ng.sunbird.chapterList',
    ver: '1.0',
    compId: 'chapterListComponent',
    author: 'Kartheek',
    description: '',
    publishedDate: '',
    data: {},
    config: {
      contentTypes: {
        value: [
          {
            id: 'explanationContent',
            label: 'Explanation',
            onClick: 'uploadComponent',
            mimeType: ['application/pdf'],
            metadata: {
              name: 'Explanation Resource',
              description: 'ExplanationResource',
              resourceType: 'Read',
              contentType: 'ExplanationResource',
              audience: ['Learner'],
              appIcon:
                // tslint:disable-next-line:max-line-length
                'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
              marks: 5
            },
            filesConfig: {
              accepted: 'pdf',
              size: '50'
            }
          }
        ],
        defaultValue: [
          {
            id: 'vsaPracticeQuestionContent',
            label: 'Practice Sets',
            onClick: 'questionSetComponent',
            mimeType: ['application/vnd.ekstep.ecml-archive'],
            metadata: {
              name: 'Practice QuestionSet',
              description: 'Practice QuestionSet',
              resourceType: 'Learn',
              contentType: 'PracticeQuestionSet',
              audience: ['Learner'],
              appIcon: '',
              marks: 5
            },
            questionCategories: ['vsa']
          }
        ]
      }
    }
  },
  programContext: {
    programId: '4bc66d00-279f-11ea-8e51-77f851f90140',
    config: {
      framework: 'NCFCOPY',
      roles: [
        {
          id: 1,
          name: 'CONTRIBUTOR',
          default: true,
          defaultTab: 1,
          tabs: [1]
        },
        {
          id: 2,
          name: 'REVIEWER',
          defaultTab: 2,
          tabs: [2]
        }
      ],
      components: [
        {
          id: 'ng.sunbird.chapterList',
          ver: '1.0',
          compId: 'chapterListComponent',
          author: 'Kartheek',
          description: '',
          publishedDate: '',
          data: {},
          config: {
            contentTypes: {
              value: [
                {
                  id: 'explanationContent',
                  label: 'Explanation',
                  onClick: 'uploadComponent',
                  mimeType: ['application/pdf'],
                  metadata: {
                    name: 'Explanation Resource',
                    description: 'ExplanationResource',
                    resourceType: 'Read',
                    contentType: 'ExplanationResource',
                    audience: ['Learner'],
                    appIcon:
                      // tslint:disable-next-line:max-line-length
                      'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                    marks: 5
                  },
                  filesConfig: {
                    accepted: 'pdf',
                    size: '50'
                  }
                }
              ],
              defaultValue: [
                {
                  id: 'vsaPracticeQuestionContent',
                  label: 'Practice Sets',
                  onClick: 'questionSetComponent',
                  mimeType: ['application/vnd.ekstep.ecml-archive'],
                  metadata: {
                    name: 'Practice QuestionSet',
                    description: 'Practice QuestionSet',
                    resourceType: 'Learn',
                    contentType: 'PracticeQuestionSet',
                    audience: ['Learner'],
                    appIcon: '',
                    marks: 5
                  },
                  questionCategories: ['vsa']
                }
              ]
            }
          }
        }
      ],
      actions: {
        showTotalContribution: {
          roles: [1, 2]
        },
        showMyContribution: {
          roles: [1]
        },
        showRejected: {
          roles: [1]
        },
        showUnderReview: {
          roles: [1]
        },
        showTotalUnderReview: {
          roles: [2]
        },
        showAcceptedByMe: {
          roles: [2]
        },
        showRejectedByMe: {
          roles: [2]
        },
        showFilters: {
          roles: [1, 2, 3]
        },
        showAddResource: {
          roles: [1]
        },
        showEditResource: {
          roles: [1]
        },
        showMoveResource: {
          roles: [1]
        },
        showDeleteResource: {
          roles: [1]
        },
        showPreviewResource: {
          roles: [2]
        },
        showCreatorView: {
          roles: [1]
        },
        showReviewerView: {
          roles: [2]
        },
        showCountPanel: {
          roles: [1, 2]
        },
        showAawaitingReview: {
          roles: [2]
        },
        showCreateQuestion: {
          roles: [1]
        },
        showDeleteQuestion: {
          roles: [1]
        },
        showContribution: {
          roles: [1]
        },
        showUpforReview: {
          roles: [2]
        }
      },
      sharedContext: [
        'channel',
        'framework',
        'board',
        'medium',
        'gradeLevel',
        'subject',
        'topic'
      ]
    },
    defaultRoles: ['CONTRIBUTOR'],
    userDetails: {
      programId: '4bc66d00-279f-11ea-8e51-77f851f90140',
      userId: '874ed8a5-782e-4f6c-8f36-e0288455901e',
      onBoardingData: {
        school: 'My School'
      },
      roles: ['CONTRIBUTOR']
    }
  },
  roles: {
    currentRole: 'CONTRIBUTOR'
  }
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
export const responseSample = {
  result: {
    content: {
      appId: 'dev.sunbird.portal',
      audience: ['Learner'],
      board: 'NCERT',
      channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
      childNodes: [
        'do_1127639059664650241140',
        'do_1127639059664650241141',
        'do_1127639059664486401136',
        'do_1127639059664568321137',
        'do_1127639059664568321139',
        'do_1127639059664568321138'
      ],
      children: [
        {
          children: [{
            parent: 'do_1129365666867363841261',
            subject: ['English'],
            medium: ['English'],
            gradeLevel: ['Kindergarten'],
            contentType: 'PracticeQuestionSet',
            dialcodeRequired: 'No',
            identifier: 'do_1129365739663605761192',
            creator: 'Creation',
            version: 2,
            versionKey: '1579171626757',
            license: 'CC BY 4.0',
            name: 'Practice QuestionSet',
            topic: ['Topic 3'],
            board: 'NCERT',
            resourceType: 'Learn',
            status: 'Review',
            prevStatus: 'Draft',
            createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e'
          }],
          contentType: 'TextBookUnit',
          identifier: 'do_1127639059664486401136',
          name: 'अवधपुरी मे राम',
          objectType: 'Content',
          parent: 'do_1127639035982479361130',
          status: 'Draft',
          topic: ['Topic 1'],
          versionKey: '1558093990045',
          visibility: 'Parent'
        }
      ],
      contentType: 'TextBook',
      createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e',
      createdFor: ['ORG_001'],
      creator: 'Creation',
      framework: 'NCFCOPY',
      gradeLevel: ['Kindergarten'],
      identifier: 'do_1127639035982479361130',
      language: ['English'],
      mediaType: 'content',
      medium: ['English'],
      mimeType: 'application/vnd.ekstep.content-collection',
      name: 'बाल रामकथा(HINDHI)',
      organisation: ['Sunbird'],
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1',
      resourceType: 'Book',
      status: 'Draft',
      subject: ['Hindi'],
      version: 2,
      versionKey: '1558095572854',
      visibility: 'Default'
    }
  }
};

export const fetchedQueCount = {
  result: {
    facets: [{ values: [{ count: 66, name: 'topic 1' }] }]
  }
};

export const templateSelectionEvent = {
  template: 'explanationContent',
  templateDetails: {
    filesConfig: { accepted: 'pdf', size: '50' },
    id: 'explanationContent',
    label: 'Explanation',
    metadata: {
      contentType: 'ExplanationResource',
      name: 'Explanation Resource',
    },
    mimeType: ['application/pdf'],
    onClick: 'uploadComponent'
  },
  type: 'next'
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

export const contextualHelpConfig = {
  "sourcing": {
    "reviewContributions": {
      "url": "https://dock.preprod.ntp.net.in/help/contribute/reviewer/review-contributions/index.html",
      "header": "This table allow you to see a list of content pending for your review.",
      "message":  "Click on any unit to proceed with the review process"
    }
  },
  "contribute": {
    "myProjectContribute": {
      "url": "https://dock.preprod.ntp.net.in/help/contribute/how-to/how-to-nominate-for-sourcing-project.html",
      "header": "This space allows you to see a list of content pending for your contribution in this project",
      "message":  "Click on any unit to proceed with the contribution process."
    }
  }
};
