export const collectionComponentInput = {
    'config': {
      'author': 'Venkat',
      'compId': 'collectionComponent',
      'config': {
        'collectionList': [],
        'collectionType': 'Textbook',
        'filters': {
          'explicit': [
            {
              'code': 'gradeLevel',
              'defaultValue': [
                'Kindergarten'
              ],
              'label': 'Class',
              'multiselect': false,
              'range': [
                'Kindergarten',
                'Grade 1',
                'Grade 2',
                'Grade 3'
              ],
              'visibility': true
            },
            {
              'code': 'subject',
              'defaultValue': [
                'English'
              ],
              'label': 'Subject',
              'multiselect': false,
              'range': [
                'English',
                'Mathematics',
                'Hindi'
              ],
              'visibility': true
            }
          ],
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
          ]
        },
        'groupBy': {
          'defaultValue': 'subject',
          'value': 'subject'
        },
        'status': [
          'Draft',
          'Live'
        ]
      },
      'data': {},
      'description': '',
      'id': 'ng.sunbird.collection',
      'publishedDate': '',
      'ver': '1.0'
    },
    'programContext': {
      'config': {
        'framework': 'NCFCOPY',
        'roles': [
          {
            'default': true,
            'defaultTab': 1,
            'id': 1,
            'name': 'CONTRIBUTOR',
            'tabs': [
              1
            ]
          },
          {
            'defaultTab': 2,
            'id': 2,
            'name': 'REVIEWER',
            'tabs': [
              2
            ]
          }
        ],
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
      'name': 'Filter Check Project',
      'programId': '18cc8a70-2889-11ea-9bc0-fd6cea67ce9f',
      'userDetails': {
        'programId': '18cc8a70-2889-11ea-9bc0-fd6cea67ce9f',
      }
    },
    'userProfile': {
      'firstName': 'Creation',
      'id': '874ed8a5-782e-4f6c-8f36-e0288455901e',
      'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
      'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
      'userName': 'ntptest102',
    }
  };

  export const collectionWithCard = [
    {
      'action': {
        'onImage': {
          'eventName': 'onImage'
        }
      },
      'cardImg': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/maths_1467351511252.png',
      'contentType': 'TextBook',
      'gradeLevel': 'Kindergarten',
      'image': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/maths_1467351511252.png',
      'medium': [
        'English'
      ],
      'metaData': {
        'contentType': 'TextBook',
        'framework': 'NCFCOPY',
        'identifier': 'do_1127638981486755841123',
      },
      'name': 'Math-Magic',
      'rating': '0',
      'resourceType': 'Book',
      'subTopic': '',
      'subject': [
        'Mathematics'
      ],
      'topic': ''
    }
  ];

  export const searchCollectionResponse = {
    'id': 'api.v1.search',
    'responseCode': 'OK',
    'result': {
      'content': [
        {
          'board': 'NCERT',
          'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
          'contentType': 'TextBook',
          'creator': 'Creation',
          'framework': 'NCFCOPY',
          'gradeLevel': [
            'Kindergarten'
          ],
          'identifier': 'do_1127638981486755841123',
          'language': [
            'English'
          ],
          'medium': [
            'English'
          ],
          'resourceType': 'Book',
          'status': 'Draft',
          'subject': [
            'Math'
          ]
        },
        {
          'board': 'NCERT',
          'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
          'contentType': 'TextBook',
          'gradeLevel': [
            'Kindergarten'
          ],
          'identifier': 'do_1127638981486755841123',
          'language': [
            'English'
          ],
          'medium': [
            'English'
          ],
          'resourceType': 'Book',
          'status': 'Review',
          'subject': [
            'Math'
          ],
        },
        {
          'board': 'NCERT',
          'contentType': 'TextBook',
          'creator': 'Creation',
          'framework': 'NCFCOPY',
          'gradeLevel': [
            'Kindergarten'
          ],
          'identifier': 'do_1127638981486755841121',
          'license': 'CC BY-NC 4.0',
          'medium': [
            'Kannada'
          ],
          'resourceType': 'Book',
          'status': 'Review',
          'subject': [
            'Kannada'
          ],
        }
      ]
    }
  };

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


  export const userProfile = {
    'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'rootOrgId': '12345',
    'userRegData': {},
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
