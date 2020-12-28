export const mockRes = {
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
    }
};
