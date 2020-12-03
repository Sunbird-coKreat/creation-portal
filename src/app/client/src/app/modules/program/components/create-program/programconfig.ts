// tslint:disable:max-line-length
var programConfig = {
    'defaultContributeOrgReview' : true,
    '_comments': '',
    'loginReqired': true,
    'framework': [],
    'board': [],
    'gradeLevel': [],
    'medium': [],
    'subject': [],
    'roles': [
      {
        'id': 1,
        'name': 'CONTRIBUTOR',
        'default': true,
        'defaultTab': 1,
        'tabs': [
          1
        ]
      },
      {
        'id': 2,
        'name': 'REVIEWER',
        'defaultTab': 2,
        'tabs': [
          2
        ]
      }
    ],
    'header': {
      'id': 'ng.sunbird.header',
      'ver': '1.0',
      'compId': 'headerComp',
      'author': 'Venkat',
      'description': '',
      'publishedDate': '',
      'data': {},
      'config': {
        'tabs': [
          {
            'index': 1,
            'label': 'Contribute',
            'onClick': 'collectionComponent'
          },
          {
            'index': 2,
            'label': 'Review',
            'onClick': 'collectionComponent'
          },
          {
            'index': 3,
            'label': 'Dashboard',
            'onClick': 'dashboardComponent'
          }
        ]
      }
    },
    'components': [
      {
        'id': 'ng.sunbird.collection',
        'ver': '1.0',
        'compId': 'collectionComponent',
        'author': 'Venkat',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {
          'filters': {
            'implicit': [
              {
                'code': 'framework',
                'defaultValue': 'NCFCOPY',
                'label': 'Framework'
              },
              {
                'code': 'board',
                'defaultValue': 'NCERT',
                'label': 'Board'
              },
              {
                'code': 'medium',
                'defaultValue': [
                  'English'
                ],
                'label': 'Medium'
              }
            ],
            'explicit': [
              {
                'code': 'gradeLevel',
                'range': [
                  'Kindergarten',
                  'Grade 1',
                  'Grade 2',
                  'Grade 3'
                ],
                'label': 'Class',
                'multiselect': false,
                'defaultValue': [
                  'Kindergarten',
                  'Grade 1'
                ],
                'visibility': true
              },
              {
                'code': 'subject',
                'range': [
                  'English',
                  'Mathematics',
                  'Hindi'
                ],
                'label': 'Subject',
                'multiselect': false,
                'defaultValue': [
                  'English'
                ],
                'visibility': true
              }
            ]
          },
          'groupBy': {
            'value': 'subject',
            'defaultValue': 'subject'
          },
          'collectionType': 'Textbook',
          'collectionList': [],
          'status': [
            'Draft',
            'Live'
          ]
        }
      },
      {
        'id': 'ng.sunbird.chapterList',
        'ver': '1.0',
        'compId': 'chapterListComponent',
        'author': 'Kartheek',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {
          'contentTypes': {
            'value': [
              {
                'id': 'explanationContent',
                'label': 'Explanation',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'video/mp4',
                  'video/webm',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Explanation Resource',
                  'description': 'ExplanationResource',
                  'resourceType': 'Read',
                  'contentType': 'ExplanationResource',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, mp4, webm, epub',
                  'size': '50'
                }
              },
              {
                'id': 'learningActivity',
                'label': 'Activity for Learning',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'video/mp4',
                  'video/webm',
                  'application/epub',
                  'application/vnd.ekstep.h5p-archive',
                ],
                'metadata': {
                  'name': 'Activity for Learning',
                  'description': 'LearningActivity',
                  'resourceType': 'Read',
                  'contentType': 'LearningActivity',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, mp4, webm, epub, h5p',
                  'size': '50'
                }
              },
              {
                'id': 'experientialContent',
                'label': 'Experiential',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'video/mp4',
                  'video/webm'
                ],
                'metadata': {
                  'name': 'Experiential Resource',
                  'description': 'ExperientialResource',
                  'resourceType': 'Read',
                  'contentType': 'ExperientialResource',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'mp4, webm',
                  'size': '50'
                }
              },
              {
                'id': 'classroomTeachingVideo',
                'label': 'Classroom Teaching Video',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'video/mp4',
                  'video/webm'
                ],
                'metadata': {
                  'name': 'Classroom Teaching Video',
                  'description': 'ClassroomTeachingVideo',
                  'resourceType': 'Read',
                  'contentType': 'ClassroomTeachingVideo',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'mp4, webm',
                  'size': '50'
                }
              },
              {
                'id': 'explanationVideo',
                'label': 'Explanation Video',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'video/mp4',
                  'video/webm'
                ],
                'metadata': {
                  'name': 'Explanation Video',
                  'description': 'ExplanationVideo',
                  'resourceType': 'Read',
                  'contentType': 'ExplanationVideo',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'mp4, webm',
                  'size': '50'
                }
              },
              {
                'id': 'explanationReadingMaterial',
                'label': 'Explanation Reading Material',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Explanation Reading Material',
                  'description': 'ExplanationReadingMaterial',
                  'resourceType': 'Read',
                  'contentType': 'ExplanationReadingMaterial',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'previousBoardExamPapers',
                'label': 'Previous Board Exam Papers',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Previous Board Exam Papers',
                  'description': 'PreviousBoardExamPapers',
                  'resourceType': 'Read',
                  'contentType': 'PreviousBoardExamPapers',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'lessonPlanResource',
                'label': 'Lesson Plan',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Lesson Plan',
                  'description': 'LessonPlanResource',
                  'resourceType': 'Read',
                  'contentType': 'LessonPlanResource',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'focusSpotContent',
                'label': 'FocusSpot',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'FocusSpot Resource',
                  'description': 'FocusSpot',
                  'resourceType': 'Read',
                  'contentType': 'FocusSpot',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'TeachingMethod',
                'label': 'Teaching Method',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Teaching Method',
                  'description': 'TeachingMethod',
                  'resourceType': 'Read',
                  'contentType': 'TeachingMethod',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'PedagogyFlow',
                'label': 'Pedagogy Flow',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Pedagogy Flow',
                  'description': 'PedagogyFlow',
                  'resourceType': 'Read',
                  'contentType': 'PedagogyFlow',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'LearningOutcomeDefinition',
                'label': 'Learning Outcome Definition',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Learning Outcome Definition',
                  'description': 'LearningOutcomeDefinition',
                  'resourceType': 'Read',
                  'contentType': 'LearningOutcomeDefinition',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'MarkingSchemeRubric',
                'label': 'Marking Scheme Rubric',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Marking Scheme Rubric',
                  'description': 'MarkingSchemeRubric',
                  'resourceType': 'Read',
                  'contentType': 'MarkingSchemeRubric',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'ConceptMap',
                'label': 'Concept Map',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Concept Map',
                  'description': 'ConceptMap',
                  'resourceType': 'Read',
                  'contentType': 'ConceptMap',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'SelfAssess',
                'label': 'Self Assess',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf',
                  'application/epub'
                ],
                'metadata': {
                  'name': 'Self Assess',
                  'description': 'SelfAssess',
                  'resourceType': 'Read',
                  'contentType': 'SelfAssess',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf, epub',
                  'size': '50'
                }
              },
              {
                'id': 'vsaPracticeQuestionContent',
                'label': 'VSA - Practice Sets',
                'onClick': 'questionSetComponent',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'metadata': {
                  'name': 'Practice QuestionSet',
                  'description': 'Practice QuestionSet',
                  'resourceType': 'Learn',
                  'contentType': 'PracticeQuestionSet',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'questionCategories': [
                  'vsa'
                ]
              },
              {
                'id': 'saPracticeQuestionContent',
                'label': 'SA - Practice Sets',
                'onClick': 'questionSetComponent',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'metadata': {
                  'name': 'Practice QuestionSet',
                  'description': 'Practice QuestionSet',
                  'resourceType': 'Learn',
                  'contentType': 'PracticeQuestionSet',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'questionCategories': [
                  'sa'
                ]
              },
              {
                'id': 'laPracticeQuestionContent',
                'label': 'LA - Practice Sets',
                'onClick': 'questionSetComponent',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'metadata': {
                  'name': 'Practice QuestionSet',
                  'description': 'Practice QuestionSet',
                  'resourceType': 'Learn',
                  'contentType': 'PracticeQuestionSet',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'questionCategories': [
                  'la'
                ]
              },
              {
                'id': 'mcqPracticeQuestionContent',
                'label': 'MCQ - Practice Sets',
                'onClick': 'questionSetComponent',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'metadata': {
                  'name': 'Practice QuestionSet',
                  'description': 'Practice QuestionSet',
                  'resourceType': 'Learn',
                  'contentType': 'PracticeQuestionSet',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'questionCategories': [
                  'mcq'
                ]
              },
              {
                'id': 'curiositySetContent',
                'label': 'Curiosity Sets',
                'onClick': 'curiositySetComponent',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'metadata': {
                  'name': 'Curiosity QuestionSet',
                  'description': 'Curiosity QuestionSet',
                  'resourceType': 'Learn',
                  'contentType': 'CuriosityQuestionSet',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'questionCategories': [
                  'curiosity'
                ]
              }
            ],
            'defaultValue': [
              {
                'id': 'vsaPracticeQuestionContent',
                'label': 'Practice Sets',
                'onClick': 'questionSetComponent',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'metadata': {
                  'name': 'Practice QuestionSet',
                  'description': 'Practice QuestionSet',
                  'resourceType': 'Learn',
                  'contentType': 'PracticeQuestionSet',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'questionCategories': [
                  'vsa'
                ]
              }
            ]
          }
        }
      },
      {
        'id': 'ng.sunbird.uploadComponent',
        'ver': '1.0',
        'compId': 'uploadContentComponent',
        'author': 'Kartheek',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {
          'filesConfig': {
            'accepted': 'pdf, mp4, webm, h5p, epub',
            'size': '50'
          },
          'formConfiguration': [
            {
              'code': 'learningOutcome',
              'dataType': 'list',
              'description': 'Learning Outcomes For The Content',
              'editable': true,
              'inputType': 'multiselect',
              'label': 'Learning Outcome',
              'name': 'LearningOutcome',
              'placeholder': 'Select Learning Outcomes',
              'required': false,
              'visible': true
            },
            {
              'code': 'attributions',
              'dataType': 'list',
              'description': 'Enter Attributions',
              'editable': true,
              'inputType': 'text',
              'label': 'Attributions',
              'name': 'Attributions',
              'placeholder': 'Enter Attributions',
              'required': false,
              'visible': true,
              'helpText': 'If you have relied on another work to create this Content, provide the name of that creator and the source of that work.'
            },
            {
              'code': 'copyright',
              'dataType': 'text',
              'description': 'Enter Copyright and Year',
              'editable': true,
              'inputType': 'text',
              'label': 'Copyright and Year',
              'name': 'Copyright',
              'placeholder': 'Enter Copyright and Year',
              'required': true,
              'visible': true,
              'helpText': 'If you are an individual, creating original Content, you are the copyright holder. If you are creating Content on behalf of an organisation, the organisation may be the copyright holder. Please fill as <Name of copyright holder>, <Year of publication>'
            },
            {
              'code': 'creator',
              'dataType': 'text',
              'description': 'Enter The Author Name',
              'editable': true,
              'inputType': 'text',
              'label': 'Author',
              'name': 'Author',
              'placeholder': 'Enter Author Name',
              'required': true,
              'visible': true,
              'helpText': 'Provide name of creator of this Content.'
            },
            {
              'code': 'license',
              'dataType': 'list',
              'description': 'License For The Content',
              'editable': true,
              'inputType': 'select',
              'label': 'License',
              'name': 'License',
              'placeholder': 'Select License',
              'required': true,
              'visible': true,
              'helpText': 'Choose the most appropriate Creative Commons License for this Content'
            },
            {
              'code': 'contentPolicyCheck',
              'dataType': 'boolean',
              'editable': false,
              'inputType': 'checkbox',
              'name': 'Content Policy Check',
              'required': true,
              'visible': true
            }
          ],
          'resourceTitleLength': '200',
          'tenantName': 'SunbirdEd'
        }
      },
      {
        'id': 'ng.sunbird.practiceSetComponent',
        'ver': '1.0',
        'compId': 'practiceSetComponent',
        'author': 'Kartheek',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {
          'No of options': 4,
          'solutionType': [
            'Video',
            'Text & image'
          ],
          'questionCategory': [
            'vsa',
            'sa',
            'ls',
            'mcq',
            'curiosity'
          ],
          'formConfiguration': [
            {
              'code': 'learningOutcome',
              'dataType': 'list',
              'description': 'Learning Outcomes For The Content',
              'editable': true,
              'inputType': 'multiselect',
              'label': 'Learning Outcome',
              'name': 'LearningOutcome',
              'placeholder': 'Select Learning Outcomes',
              'required': false,
              'visible': true
            },
            {
              'code': 'attributions',
              'dataType': 'list',
              'description': 'Enter Attributions',
              'editable': true,
              'inputType': 'text',
              'label': 'Attributions',
              'name': 'Attributions',
              'placeholder': 'Enter Attributions',
              'required': false,
              'visible': true,
              'helpText': 'If you have relied on another work to create this Content, provide the name of that creator and the source of that work.'
            },
            {
              'code': 'copyright',
              'dataType': 'text',
              'description': 'Enter Copyright and Year',
              'editable': true,
              'inputType': 'text',
              'label': 'Copyright and Year',
              'name': 'Copyright',
              'placeholder': 'Enter Copyright and Year',
              'required': true,
              'visible': true,
              'helpText': 'If you are an individual, creating original Content, you are the copyright holder. If you are creating Content on behalf of an organisation, the organisation may be the copyright holder. Please fill as <Name of copyright holder>, <Year of publication>'
            },
            {
              'code': 'creator',
              'dataType': 'text',
              'description': 'Enter The Author Name',
              'editable': true,
              'inputType': 'text',
              'label': 'Author',
              'name': 'Author',
              'placeholder': 'Enter Author Name',
              'required': true,
              'visible': true,
              'helpText': 'Provide name of creator of this Content.'
            },
            {
              'code': 'license',
              'dataType': 'list',
              'description': 'License For The Content',
              'editable': true,
              'inputType': 'select',
              'label': 'License',
              'name': 'License',
              'placeholder': 'Select License',
              'required': true,
              'visible': true,
              'helpText': 'Choose the most appropriate Creative Commons License for this Content'
            },
            {
              'code': 'contentPolicyCheck',
              'dataType': 'boolean',
              'editable': false,
              'inputType': 'checkbox',
              'name': 'Content Policy Check',
              'required': true,
              'visible': true
            }
          ],
          'resourceTitleLength': '200',
          'tenantName': '',
          'assetConfig': {
            'image': {
              'size': '50',
              'accepted': 'jpeg, png, jpg'
            },
            'video': {
              'size': '50',
              'accepted': 'pdf, mp4, webm, youtube'
            }
          }
        }
      },
      {
        'id': 'ng.sunbird.dashboard',
        'ver': '1.0',
        'compId': 'dashboardComp',
        'author': 'Venkanna Gouda',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {}
      }
    ],
    'sharedContext': [
      'channel',
      'framework',
      'board',
      'medium',
      'gradeLevel',
      'subject',
      'topic'
    ]
};

export let programConfigObj = programConfig;
