export const mockRes = {
    questionDetails : {
        'id': 'api.question.read',
        'ver': '3.0',
        'ts': '2020-12-21T09:51:11ZZ',
        'params': {
            'resmsgid': '05d26268-0467-41df-acfa-06abb5dee927',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'question': {
                'identifier': 'do_1131737393366138881132',
                'solutions': [
                    {
                        'id': '9b644370-47ba-e60a-ca35-572823d45ea9',
                        'type': 'html',
                        'value': '<p>solution_</p>'
                    }
                ],
                'body': '<p>question_1</p>',
                'languageCode': [
                    'en'
                ],
                'answer': '<p>answer_</p>',
                'name': 'untitled SA'
            }
        }
    },

    questionCreateResponse: {
        'id': 'api.question.create',
        'ver': '3.0',
        'ts': '2020-12-21T10:21:57ZZ',
        'params': {
            'resmsgid': 'f87b2e19-7d01-4747-b23e-c8dbdb8b36ad',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'identifier': 'do_1131772097929134081163',
            'versionKey': '1608546117300'
        }
    },

    questionUpdateResponse: {
        'id': 'api.question.update',
        'ver': '3.0',
        'ts': '2020-12-21T10:49:13ZZ',
        'params': {
            'resmsgid': 'b94fb4ff-c509-4a31-b93d-c2a6a84fb548',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'identifier': 'do_1131772097929134081163',
            'versionKey': '1608547753228'
        }
    },

    questionSetAdd: {
        'id': 'api.questionset.add',
        'ver': '3.0',
        'ts': '2020-12-21T11:08:31ZZ',
        'params': {
            'resmsgid': 'dc9213aa-e537-4b1b-8f09-0c7c6ffc9ca5',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'rootId': 'do_1131737119720488961123',
            'children': [
                'do_1131737393366138881132'
            ]
        }
    }
};