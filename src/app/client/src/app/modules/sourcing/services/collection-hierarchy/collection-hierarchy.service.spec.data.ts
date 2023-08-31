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
    'userRegData': {},
  };

  export const mockError = {
    'params': {
      'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
      'msgid': null,
      'status': 'failed'
    },
    status: 'failed'
};

export const mockData = {
  sampleContents: [
    {id: 'do_1234', status: 'Live', prevStatus: 'Processing'},
    {id: 'do_12345', status: 'Draft', prevStatus: 'Review'},
    {id: 'do_123456', status: 'Draft', prevStatus: 'Live'}
  ],
  sampleContentsWithContentType: [
    {
      id: 'do_1234',
      createdBy: 'abcd1234',
      organisationId: '012345',
      contentType: 'sample',
      sampleContent: true
    },
    {
      id: 'do_12345',
      createdBy: 'abcd1234',
      organisationId: '012345',
      contentType: 'nonsample',
      sampleContent: false
    },
  ]
};
