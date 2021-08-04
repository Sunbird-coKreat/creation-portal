export const config = {
    uploadIconFormConfig:
        [{
            'code': 'name',
            'dataType': 'text',
            'editable': false,
            'inputType': 'text',
            'label': 'Asset Caption',
            'name': 'Asset Caption',
            'placeholder': 'Enter asset caption',
            'renderingHints': {
                'class': 'sb-g-col-lg-2 required'
            },
            'required': true,
            'visible': true,
            'validations': [
                {
                    'type': 'required',
                    'message': 'Please enter asset caption'
                }
            ]
        },
        {
            'code': 'keywords',
            'visible': true,
            'editable': false,
            'dataType': 'list',
            'name': 'Tags',
            'placeholder': 'Add tag',
            'renderingHints': {
                'class': 'sb-g-col-lg-2'
            },
            'description': '',
            'inputType': 'keywords',
            'label': 'Tags',
            'required': true,
            'validations': []
        },
        {
            'code': 'creator',
            'dataType': 'text',
            'editable': false,
            'inputType': 'text',
            'label': 'Creator',
            'name': 'Creator',
            'placeholder': 'Enter name',
            'renderingHints': {
                'class': 'sb-g-col-lg-2'
            },
            'required': true,
            'visible': true
        }]
}