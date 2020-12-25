export const mockData = {
  fakeParamMap: {
    questionSetId: 'do_1130307931241103361441',
  },
  impressionEventData: {
    'context': {
      'pdata': {
        'id': 'local.sunbird.portal',
        'ver': '2.8.0',
        'pid': 'creation-portal'
      },
      'env': 'creation-portal',
      'cdata': [
        {
          'id': '01307938306521497658',
          'type': 'sourcing_organization'
        }
      ],
    },
    'edata': {
      'type': 'list',
      'pageid': 'contribution_question_set',
      'uri': '/create/questionSet/do_113170109787922432162',
      'duration': 3.682,
    }
  },
  readQuestionSetSuccess: {
    'children': [
      {
        'parent': 'do_113170109787922432162',
        'identifier': 'do_113170079485313024155',
        'lastStatusChangedOn': '2020-12-11T08:35:18.423+0000',
        'code': 'question.code',
        'visibility': 'Public',
        'consumerId': 'fa13b438-8a3d-41b1-8278-33b0c50210e4',
        'index': 1,
        'language': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.qml-archive',
        'languageCode': [
          'en'
        ],
        'createdOn': '2020-12-11T08:35:18.423+0000',
        'version': 1,
        'objectType': 'Question',
        'versionKey': '1607675718423',
        'depth': 1,
        'primaryCategory': 'Practice Question Set',
        'name': 'question_1',
        'lastUpdatedOn': '2020-12-11T08:35:18.423+0000',
        'status': 'Draft'
      },
    ],
    'name': 'Root ',
    'navigationMode': 'linear',
    'shuffle': 'Yes',
    'status': 'Review'
  },
  updateQuestionSetHierarchySuccess: {
    'id': 'api.questionset.hierarchy.update',
    'ver': '3.0',
    'ts': '2020-12-25T11:59:38ZZ',
    'params': {
      'resmsgid': '9921d051-dab4-479e-b925-abead5c66f6d',
      'msgid': null,
      'err': null,
      'status': 'successful',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'identifier': 'do_1131800880178544641165',
      'identifiers': {}
    }
  },
  updateQuestionSetHierarchyFailed: {
    'id': 'api.questionset.hierarchy.update',
    'ver': '3.0',
    'ts': '2020-12-25T11:58:06ZZ',
    'params': {
      'resmsgid': 'a87f186d-1e96-4cf2-863d-2012bcc4f92e',
      'msgid': null,
      'err': 'NOT_FOUND',
      'status': 'failed',
      'errmsg': 'Error! Node(s) doesn\'t Exists. | [Invalid Node Id.]: do_113164430438555648110'
    },
    'responseCode': 'RESOURCE_NOT_FOUND',
    'result': {
      'messages': null
    }
  },
  reviewQuestionSetSuccess: {
    'id': 'api.questionset.review',
    'ver': '3.0',
    'ts': '2020-12-25T12:00:43ZZ',
    'params': {
      'resmsgid': '779cc493-3f55-4f28-9744-3a3ff9f0743a',
      'msgid': null,
      'err': null,
      'status': 'successful',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'identifier': 'do_1131800880178544641165',
      'versionKey': '1608897643072'
    }
  }
};
