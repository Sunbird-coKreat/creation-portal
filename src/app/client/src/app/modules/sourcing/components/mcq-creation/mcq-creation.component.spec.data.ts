export const validMcqFormData = {
    'question': '<p>question</p>',
    'options': [
        {
            'body': '<p>a</p>'
        },
        {
            'body': '<p>b</p>'
        }
    ],
    'templateId': 'mcq-vertical',
    'answer': '1',
    'learningOutcome': undefined,
    'bloomsLevel': undefined,
    'maxScore': 1,
    'numberOfOptions': 2,
};

export const invalidMcqFormData = {
    'question': '',
    'options': [
        {
            'body': ''
        },
        {
            'body': ''
        }
    ],
    'templateId': 'mcq-vertical',
    'answer': '1',
    'learningOutcome': undefined,
    'bloomsLevel': undefined,
    'maxScore': 1,
    'numberOfOptions': 2,
};
