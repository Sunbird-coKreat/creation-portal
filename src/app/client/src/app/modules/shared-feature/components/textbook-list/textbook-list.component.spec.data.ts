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
