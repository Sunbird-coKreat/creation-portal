export const formConfig = [
    {
        'code': 'name',
        'dataType': 'text',
        'description': 'Name of the content',
        'editable': true,
        'inputType': 'text',
        'label': 'Title',
        'name': 'Title',
        'placeholder': 'Title',
        'renderingHints': {'class': 'sb-g-col-lg-1'},
        'required': true,
        'visible': true,
        'validations': [{
            'type': 'max',
            'value': '120',
            'message': 'Input is Exceeded'
        }, {
            'type': 'required',
            'message': 'Title is required'
        }]
    },
    {
        'code': 'description',
        'dataType': 'text',
        'description': 'Description of the content',
        'editable': true,
        'inputType': 'textarea',
        'label': 'Description',
        'name': 'Description',
        'placeholder': 'Description',
        'renderingHints': {'class': 'sb-g-col-lg-1'},
        'required': true,
        'visible': true,
        'validations': [{
            'type': 'max',
            'value': '120',
            'message': 'Input is Exceeded'
        }, {
            'type': 'required',
            'message': 'Title is required'
        }]
    },
    {
        'code': 'keywords',
        'visible': true,
        'editable': true,
        'dataType': 'list',
        'name': 'Keywords',
        'renderingHints': {'class': 'sb-g-col-lg-1'},
        'index': 3,
        'description': 'Keywords for the content',
        'inputType': 'keywords',
        'label': 'keywords',
        'placeholder': 'Enter Keywords',
        'required': false,
        'section': {
          'index': 1,
          'name': ''
        },
        'validations': [{
          'type': 'required',
          'message': 'Keyword is required'
        }]
      },
      {
        'code': 'primaryCategory',
        'dataType': 'text',
        'description': 'Type',
        'editable': false,
        'index': 4,
        'renderingHints': {

        },
        'inputType': 'select',
        'label': 'Type',
        'name': 'Type',
        'placeholder': '',
        'required': true,
        'visible': true,
        'section': {
          'index': 2,
          'name': ''
        }
      },
      {
        'code': 'additionalCategories',
        'dataType': 'list',
        'description': 'Additonal Category of the Content',
        'editable': true,
        'index': 5,
        'inputType': 'nestedselect',
        'label': 'Additional Category',
        'name': 'Additional Category',
        'placeholder': 'Select Additional Category',
        'renderingHints': {

        },
        'default': '',
        'range': [
            {
              'value': 'Classroom Teaching Video',
              'label': 'Classroom Teaching Video'
            },
            {
              'value': 'Concept Map',
              'label': 'Concept Map'
            },
            {
              'value': 'Curiosity Question Set',
              'label': 'Curiosity Question Set'
            },
            {
              'value': 'Textbook',
              'label': 'Textbook'
            },
            {
              'value': 'Experiential Resource',
              'label': 'Experiential Resource'
            },
            {
              'value': 'Explanation Video',
              'label': 'Explanation Video'
            },
            {
              'value': 'Focus Spot',
              'label': 'Focus Spot'
            },
            {
              'value': 'Learning Outcome Definition',
              'label': 'Learning Outcome Definition'
            },
            {
              'value': 'Marking Scheme Rubric',
              'label': 'Marking Scheme Rubric'
            },
            {
              'value': 'Pedagogy Flow',
              'label': 'Pedagogy Flow'
            },
            {
              'value': 'Lesson Plan',
              'label': 'Lesson Plan'
            },
            {
              'value': 'Previous Board Exam Papers',
              'label': 'Previous Board Exam Papers'
            },
            {
              'value': 'TV Lesson',
              'label': 'TV Lesson'
            }
        ],
        'required': false,
        'visible': true,
        'section': {
          'index': 2,
          'name': ''
        }
      },
      {
        'code': 'board',
        'visible': true,
        'depends': ['gradeLevel', 'medium', 'subject', 'topic'],
        'editable': true,
        'dataType': 'text',
        'renderingHints': {

        },
        'description': 'Board',
        'index': 6,
        'label': 'Board/Syllabus',
        'required': true,
        'name': 'Board/Syllabus',
        'inputType': 'select',
        'placeholder': 'Select Board/Syllabus',
        'section': {
          'index': 3,
          'name': ''
        },
        'validations': [{
          'type': 'required',
          'message': 'Board is required'
        }]
      }, {
        'code': 'medium',
        'visible': true,
        'depends': ['gradeLevel', 'subject', 'topic'],
        'editable': true,
        'dataType': 'list',
        'renderingHints': {

        },
        'description': '',
        'index': 7,
        'label': 'Medium',
        'required': true,
        'name': 'Medium',
        'inputType': 'multiselect',
        'placeholder': 'Select Medium',
        'section': {
          'index': 3,
          'name': ''
        },
        'validations': [{
          'type': 'required',
          'message': 'Medium is required'
        }]
      }, {
        'code': 'gradeLevel',
        'visible': true,
        'depends': ['subject', 'topic'],
        'editable': true,
        'dataType': 'list',
        'renderingHints': {

        },
        'description': 'Class',
        'index': 8,
        'label': 'Class',
        'required': true,
        'name': 'Class',
        'inputType': 'multiselect',
        'placeholder': 'Select Class',
        'section': {
          'index': 3,
          'name': ''
        }
      }, {
        'code': 'subject',
        'visible': true,
        'depends': ['topic'],
        'editable': true,
        'dataType': 'list',
        'renderingHints': {

        },
        'description': '',
        'index': 9,
        'label': 'Subject',
        'required': true,
        'name': 'Subject',
        'inputType': 'multiselect',
        'placeholder': 'Select Subject',
        'section': {
          'index': 3,
          'name': ''
        }
      },
      {
        'code': 'topic',
        'visible': true,
        'editable': true,
        'dataType': 'list',
        'renderingHints': {},
        'name': 'Topic',
        'description': 'Choose a Topics',
        'index': 11,
        'inputType': 'topicselector',
        'label': 'Topics',
        'placeholder': 'Choose Topics',
        'required': false,
        'section': {
          'index': 3,
          'name': ''
        },
        'range': '',
        'validations': [{
            'type': 'required',
            'message': 'Topic is required'
          }]
    },
    {
        'code': 'audience',
        'dataType': 'list',
        'description': 'Audience',
        'editable': true,
        'inputType': 'select',
        'label': 'Audience',
        'name': 'Audience',
        'placeholder': 'Select Audience',
        'renderingHints': {'class': 'sb-g-col-lg-1'},
        'required': true,
        'visible': true,
        'range': ['Student', 'Teacher', 'Administrator'],
    },
    {
        'code': 'showFeedback',
        'dataType': 'text',
        'description': 'Show Feedback',
        'editable': true,
        'default': '',
        'index': 5,
        'inputType': 'checkbox',
        'label': 'Show Feedback',
        'name': 'showFeedback',
        'placeholder': 'Show Feedback',
        'renderingHints': {
        },
        'required': false,
        'visible': true
    },
    {
        'code': 'shuffleQuestions',
        'dataType': 'text',
        'description': 'Shuffle Questions',
        'editable': true,
        'default': '',
        'index': 5,
        'inputType': 'checkbox',
        'label': 'Shuffle Questions',
        'name': 'Shuffle Questions',
        'placeholder': 'Shuffle Questions',
        'renderingHints': {
        },
        'required': false,
        'visible': true
    },
    {
        'code': 'showQuestions',
        'dataType': 'text',
        'description': 'Show Questions',
        'editable': true,
        'index': 5,
        'inputType': 'select',
        'label': 'Show Questions',
        'name': 'showQuestions',
        'placeholder': 'Show Questions',
        'renderingHints': {
        },
        'required': false,
        'visible': true,
        'range': ''
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
        'renderingHints': {'class': 'sb-g-col-lg-1'},
        'required': true,
        'visible': true,
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
        'renderingHints': {'class': 'sb-g-col-lg-1'},
        'required': true,
        'visible': true,
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
        'renderingHints': {'class': 'sb-g-col-lg-1'},
        'required': true,
        'visible': true,
    },
    {
        'code': 'license',
        'dataType': 'text',
        'description': 'license',
        'editable': true,
        'inputType': 'select',
        'label': 'license',
        'name': 'license',
        'placeholder': 'Select license',
        'renderingHints': {'class': 'sb-g-col-lg-1'},
        'required': true,
        'visible': true,
        'range': ''
    }
];
