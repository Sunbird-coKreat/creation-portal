export const formConfig = [
    {
        'code': 'name',
        'dataType': 'text',
        'description': 'Name of the content',
        'editable': true,
        'inputType': 'text',
        'label': 'Name',
        'name': 'Name',
        'placeholder': 'Name',
        'renderingHints': {},
        'required': true,
        'visible': true,
        'validation': [{
            'type': 'max',
            'value': '120',
            'message': 'Input is Exceded'
        }]
    },
    {
        'code': 'author',
        'dataType': 'text',
        'description': 'Author of the content',
        'editable': true,
        'inputType': 'text',
        'label': 'Author',
        'name': 'Author',
        'placeholder': 'Author',
        'renderingHints': {},
        'required': true,
        'visible': true,
        'validation': [{
            'type': 'max',
            'value': '120',
            'message': 'Input is Exceded'
        }]
    },
    {
        'code': 'attributions',
        'dataType': 'text',
        'description': 'Attributions',
        'editable': true,
        'inputType': 'text',
        'label': 'Attributions',
        'name': 'Attributions',
        'placeholder': 'Attributions',
        'renderingHints': {},
        'required': true,
        'visible': true,
        'validation': [{
            'type': 'max',
            'value': '120',
            'message': 'Input is Exceded'
        }]
    },
    {
        'code': 'copyright',
        'dataType': 'text',
        'description': 'Copyright & year',
        'editable': true,
        'inputType': 'text',
        'label': 'Copyright & year',
        'name': 'Copyright & year',
        'placeholder': 'Copyright & year',
        'renderingHints': {},
        'required': true,
        'visible': true,
        'validation': [{
            'type': 'max',
            'value': '120',
            'message': 'Input is Exceded'
        }]
    },
    {
        'code': 'license',
        'dataType': 'text',
        'description': 'Licence',
        'editable': true,
        'inputType': 'select',
        'label': 'Licence',
        'name': 'Licence',
        'placeholder': 'Select Licence',
        'renderingHints': {},
        'required': true,
        'visible': true,
        'templateOptions': {
            'placeHolder': 'Select Licence',
            'multiple': false,
            'hidden': false,
        },
        'validations': [{
            'type': 'required'
        }],
        'terms': [
            {
                'identifier': 'CC BY 4.0',
                'code': 'CC BY 4.0',
                'translations': null,
                'name': 'CC BY 4.0',
                'description': 'CC BY 4.0',
                'index': 1,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'CC BY-NC 4.0',
                'code': 'CC BY-NC 4.0',
                'translations': null,
                'name': 'CC BY-NC 4.0',
                'description': 'CC BY-NC 4.0',
                'index': 1,
                'category': 'board',
                'status': 'Live'
            }
        ],
    },
    {
        'code': 'audience',
        'dataType': 'text',
        'description': 'Audience',
        'editable': true,
        'inputType': 'select',
        'label': 'Audience',
        'name': 'Audience',
        'placeholder': 'Select Audience',
        'renderingHints': {},
        'required': true,
        'visible': true,
        'templateOptions': {
            'placeHolder': 'Select Audience',
            'multiple': false,
            'hidden': false,
        },
        'validations': [{
            'type': 'required'
        }],
        'terms': [
            {
                'identifier': 'Student',
                'code': 'Student',
                'translations': null,
                'name': 'Student',
                'description': 'Student',
                'index': 1,
                'category': 'board',
                'status': 'Live'
            }
        ],
    },
];
