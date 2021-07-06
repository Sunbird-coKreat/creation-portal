export const mockData = {
  userServiceStub: {
    userid: '874ed8a5-782e-4f6c-8f36-e0288455901e',
    channel: '123456789',
    appId: 'dev.dock.portal',
    slug: 'custchannel'
  },
  contentListRes: {
    'id': 'api.search-service.search',
    'ver': '3.0',
    'ts': '2021-07-05T10:57:39ZZ',
    'params': {
      'resmsgid': '9edad2fe-7605-4e4f-b089-31ea9b130c74',
      'msgid': null,
      'err': null,
      'status': 'successful',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'count': 578,
      'content': [
        {
          'identifier': 'do_11328912467534643213639',
          'gradeLevel': ['Class 1'],
          'creator': 'color4',
          'framework': 'ekstep_ncert_k-12',
          'subject': ['Mathematics'],
          'name': '1',
          'mimeType': 'video/webm',
          'medium': ['Hindi'],
          'lastPublishedBy': '0ce5b67e-b48e-489b-a818-e938e8bfc14b',
          'board': 'CBSE',
          'objectType': 'Content',
          'status': 'Live'
        },
        {
          'identifier': 'do_11315455006530764812',
          'gradeLevel': ['Class 9'],
          'creator': 'check1',
          'framework': 'ekstep_ncert_k-12',
          'subject': ['Hindi'],
          'name': '1',
          'mimeType': 'application/pdf',
          'medium': ['Hindi'],
          'lastPublishedBy': '0ce5b67e-b48e-489b-a818-e938e8bfc14b',
          'board': 'CBSE',
          'objectType': 'Content',
          'status': 'Live'
        }
      ]
    }
  },
  frameworkListRes: {
    'id': 'api.v1.search',
    'ver': '1.0',
    'ts': '2021-07-05T10:57:39.127Z',
    'params': {
      'resmsgid': 'd05cf470-dd7f-11eb-8f0d-5b69b763f5d8',
      'msgid': 'd12ce03b-c321-e2c2-e89f-427073898f2b',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'count': 194,
      'Framework': [
        {
          'identifier': 'ekstep_ncert_k-12',
          'type': 'K-12',
          'objectType': 'Framework'
        }
      ]
    }
  },
  publishedContentListRes: {
    'id': 'api.v1.search',
    'ver': '1.0',
    'ts': '2021-07-05T10:57:39.907Z',
    'params': {
      'resmsgid': 'd0d3f930-dd7f-11eb-8f0d-5b69b763f5d8',
      'msgid': '1d704955-5001-c1c3-cc06-6ae29da9ffe3',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'count': 146,
      'content': [
        {
          'identifier': 'do_113289107137044480148',
          'origin': 'do_11328844752158720013582',
          'lastPublishedBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
          'objectType': 'Content',
          'status': 'Live'
        },
        {
          'identifier': 'do_113289107098263552147',
          'origin': 'do_11328844752157081613581',
          'lastPublishedBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
          'objectType': 'Content',
          'status': 'Live'
        },
        {
          'identifier': 'do_113289107070615552146',
          'origin': 'do_11328844752160358413583',
          'lastPublishedBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
          'objectType': 'Content',
          'status': 'Live'
        }   ]
    }
  },
  userContentListRes: {
    'id': 'api.user.search',
    'ver': 'v1',
    'ts': '2021-07-05 10:57:40:221+0000',
    'params': {
      'resmsgid': null,
      'msgid': 'c65da228-aef8-7918-45ae-d6676acdcb2a',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'count': 5,
        'content': [
          {
            'identifier': 1234,
            'firstName': 'N150',
            'lastName': null,
          },
          {
            'identifier': 2345,
            'firstName': 'vdn1',
            'lastName': null,
          }
        ]
      }
    }
  }
};
