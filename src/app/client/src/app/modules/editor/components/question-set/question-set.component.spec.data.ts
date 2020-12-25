export const mockData = {
  addContentEvent: { 'button': { 'type': 'showQuestionTemplate' } },
  formConfig: [
    {
      'code': 'name',
      'dataType': 'text',
      'description': 'Name of the content',
      'editable': true,
      'inputType': 'text',
      'label': 'Name',
      'name': 'Name',
      'placeholder': 'Name',
      'renderingHints': { 'class': 'sb-g-col-lg-1' },
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
      'renderingHints': { 'class': 'sb-g-col-lg-1' },
      'required': true,
      'visible': true,
      'validation': [{
        'type': 'max',
        'value': '120',
        'message': 'Input is Exceded'
      }]
    }],
  questionMetaData: {
    data: {
      'id': 'do_1131743465165373441141',
      'objectType': 'Question',
      'metadata': {
        'parent': 'do_113170109787922432162',
        'identifier': 'do_1131743465165373441141',
        'lastStatusChangedOn': '2020-12-17T09:16:36.258+0000',
        'code': '3679dad3-2e95-3ee2-c0cb-42faa0fc9e4d',
        'visibility': 'Public',
        'consumerId': 'fa13b438-8a3d-41b1-8278-33b0c50210e4',
        'index': 6,
        'language': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.qml-archive',
        'languageCode': [
          'en'
        ],
        'createdOn': '2020-12-17T09:16:36.258+0000',
        'version': 1,
        'objectType': 'Question',
        'versionKey': '1608196596258',
        'depth': 1,
        'primaryCategory': 'Practice Question Set',
        'name': 'untitled SA',
        'lastUpdatedOn': '2020-12-17T09:16:36.258+0000',
        'status': 'Draft'
      },
      'root': false
    }
  }
};
