export const mockData = {
  assetBrowserEvent: {
    type: 'image',
    url: 'apple.png'
  },
  event: {
    target: {
      files: [{
        lastModified: 1602826982711,
        lastModifiedDate: 'Fri Oct 16 2020 11:13:02 GMT+0530 (India Standard Time)',
        name: "logo.png",
        size: 63344,
        type: "image/png",
        webkitRelativePath: ""
      }]
    }
  },
  formData: {
    channel: "01307938306521497658",
    createdBy: "5a587cc1-e018-4859-a0a8-e842650b9d64",
    creator: "Vaibahv Bhuva",
    mediaType: "image",
    mimeType: "image/png",
    keywords: undefined,
    name: "logo"
  },
  uploadIconFormConfig:
  [{
      'code': 'name',
      'dataType': 'text',
      'editable': true,
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
      'editable': true,
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
      'editable': true,
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
};
