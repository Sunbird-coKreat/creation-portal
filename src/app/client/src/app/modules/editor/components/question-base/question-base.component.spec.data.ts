export const mockRes = {
    fakeParamMap: {
        questionId: 'do_1131823509449031681174',
        type: 'default'
      },
    subjectiveEditorState: {
        'question': '<p>Capital of india is?</p>',
        'answer': '<p>New Delhi</p>',
        'solutions': ''
      },
    subjectiveMetadata: {
        'body': '<p>Capital of india is?</p>',
        'answer': '<p>New Delhi</p>',
        'templateId': '',
        'responseDeclaration': {},
        'interactionTypes': [],
        'interactions': [],
        'editorState': {
            'question': '<p>Capital of india is?</p>',
            'answer': '<p>New Delhi</p>'
        },
        'media': [],
        'mimeType': 'application/vnd.ekstep.qml-archive',
        'primaryCategory': 'Practice Question Set',
        'solutions': []
    },

    McqEditorState: {
        'question': '<p>color of sky is?</p>',
        'options': [{
                'body': '<p>red</p>',
                'length': 0
            },
            {
                'body': '<p>blue</p>',
                'length': 0
            }
        ],
        'answer': '0',
        'numberOfOptions': 2
    },
    McqMetadata: {
        'templateId': ' mcq-vertical',
        // tslint:disable-next-line:max-line-length
        'body': '<div class="question-body"><div class="mcq-title"><p>color of sky is?</p></div><div data-choice-interaction="response1" class="mcq-vertical"></div></div>',
        'interactionTypes': [
            'choice'
        ],
        'interactions': {
            'response1': {
                'type': 'choice',
                'options': [{
                        'value': {
                            'label': '<p>red</p>',
                            'value': 0
                        }
                    },
                    {
                        'value': {
                            'label': '<p>blue</p>',
                            'value': 1
                        }
                    }
                ]
            }
        },
        'editorState': {
            'question': '<p>color of sky is?</p>',
            'options': [{
                    'answer': true,
                    'value': {
                        'body': '<p>red</p>',
                        'value': 0
                    }
                },
                {
                    'answer': false,
                    'value': {
                        'body': '<p>blue</p>',
                        'value': 1
                    }
                }
            ]
        },
        'media': [],
        'mimeType': 'application/vnd.ekstep.qml-archive',
        'primaryCategory': 'Practice Question Set',
        'solutions': []
    },
    questionHtml: {
        // tslint:disable-next-line:max-line-length
        'body': '<div class="question-body"><div class="mcq-title"><p>capital of india is?</p></div><div data-choice-interaction="response1" class="mcq-vertical"></div></div>',
        'responseDeclaration': {
            'maxScore': 1,
            'response1': {
                'cardinality': 'single',
                'type': 'integer',
                'correctResponse': {
                    'value': '0',
                    'outcomes': {
                        'SCORE': 1
                    }
                }
            }
        }
    },

    questionOptions: [{
    'body': '<p>a1</p>',
    'length': 0
    },
    {
        'body': '<p>a2</p>',
        'length': 0
    }],
    questionInteraction: {
        'response1': {
            'type': 'choice',
            'options': [{
                    'value': {
                        'label': '<p>a1</p>',
                        'value': 0
                    }
                },
                {
                    'value': {
                        'label': '<p>a2</p>',
                        'value': 1
                    }
                }
            ]
        }
    },
    createMetadata: {
        'code': 'b04833ce-f2ae-4b51-086e-71bc1637fa84',
        'body': '<p>Capital of India is?</p>',
        'answer': '<p>New Delhi</p>',
        'status': 'Draft',
        'name': 'SA',
        'mimeType': 'application/vnd.ekstep.qml-archive',
        'primaryCategory': 'Practice Question Set',
        'solutions': []
    },
    createResponse: {
        'id': 'api.question.create',
        'ver': '3.0',
        'ts': '2020-12-28T16:41:39ZZ',
        'params': {
            'resmsgid': 'ef1740f3-15f9-489a-852d-5e2c16c52f51',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'identifier': 'do_1131823509449031681174',
            'versionKey': '1609173699330'
        }
    },
    updateMetadata: {
        'body': '<p>Capital of India is?</p>',
        'answer': '<p>New Delhiiii</p>',
        'name': 'SA',
        'primaryCategory': 'Practice Question Set',
        'solutions': []
    },
    updateResponse: {
        'id': 'api.question.update',
        'ver': '3.0',
        'ts': '2020-12-28T19:24:54ZZ',
        'params': {
            'resmsgid': 'a2960f6b-b9a7-444d-9a46-23a58625fe3a',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'identifier': 'do_1131823509449031681174',
            'versionKey': '1609183494167'
        }
    },
    addQuestionQuestionsetResponse: {
        'id': 'api.questionset.add',
        'ver': '3.0',
        'ts': '2020-12-28T20:07:16ZZ',
        'params': {
            'resmsgid': '7fbcc47a-d3da-4d0c-9782-110e003bffac',
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
