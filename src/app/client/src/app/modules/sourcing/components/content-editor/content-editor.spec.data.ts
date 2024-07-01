export const contentEditorComponentInput = {
    action: 'preview',
    contentId: 'do_1129159525832540161668',
    programContext: {
      config: {
        actions: {
          showChangeFile: {
            roles: [1]
          },
          showRequestChanges: {
            roles: [2]
          },
          showPublish: {
            roles: [2]
          },
          showSubmit: {
            roles: [1]
          },
          showSave: {
            roles: [1]
          },
          showEdit: {
            roles: [1]
          }
        },
        components: [
          {
            id: 'ng.sunbird.uploadComponent',
            ver: '1.0',
            compId: 'uploadContentComponent',
            author: 'Kartheek',
            description: '',
            publishedDate: '',
            data: {},
            config: {
              filesConfig: {
                accepted: 'pdf, mp4, webm, youtube',
                size: '50'
              },
              formConfiguration: [
                {
                  code: 'learningOutcome',
                  dataType: 'list',
                  description: 'Learning Outcomes For The Content',
                  editable: true,
                  inputType: 'multiselect',
                  label: 'Learning Outcome',
                  name: 'LearningOutcome',
                  placeholder: 'Select Learning Outcomes',
                  required: false,
                  visible: true
                },
                {
                  code: 'bloomslevel',
                  dataType: 'list',
                  description: 'Learning Level For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'Learning Level',
                  name: 'LearningLevel',
                  placeholder: 'Select Learning Levels',
                  required: true,
                  visible: true,
                  defaultValue: [
                    'Knowledge (Remembering)',
                    'Comprehension (Understanding)',
                    'Application (Transferring)',
                    'Analysis (Relating)',
                    'Evaluation (Judging)',
                    'Synthesis (Creating)'
                  ]
                },
                {
                  code: 'creator',
                  dataType: 'text',
                  description: 'Enter The Author Name',
                  editable: true,
                  inputType: 'text',
                  label: 'Author',
                  name: 'Author',
                  placeholder: 'Enter Author Name',
                  required: true,
                  visible: true
                },
                {
                  code: 'license',
                  dataType: 'list',
                  description: 'License For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'License',
                  name: 'License',
                  placeholder: 'Select License',
                  required: true,
                  visible: true
                }
              ]
            }
          }
        ],
        config: {
          filesConfig: {accepted: 'pdf, mp4, webm, youtube', size: '50'},
          formConfiguration:  [
            {
              code: 'learningOutcome',
              dataType: 'list',
              defaultValue: ['Spelling Practice', 'Memorizing Practice', 'Writing Practice', 'Searching', 'Patience', 'Computation skill'],
              description: 'Learning Outcomes For The Content',
              editable: true,
              inputType: 'multiselect',
              label: 'Learning Outcome',
              name: 'LearningOutcome',
              placeholder: 'Select Learning Outcomes',
              required: false,
              visible: true
            }
          ],
          resourceTitleLength: '200',
          tenantName: 'SunbirdEd'
        }
      },
      defaultRoles: ['CONTRIBUTOR'],
      programId: '8a038e90-35f5-11ea-af1e-17ee2cf27b43',
      userDetails: {
        enrolledOn: '2020-01-16T05:31:25.798Z',
        onBoarded: true,
        onBoardingData: {school: 'My School'},
        programId: '608de690-3821-11ea-905b-d9320547e5be',
        roles: ['CONTRIBUTOR'],
        userId: '874ed8a5-782e-4f6c-8f36-e0288455901e'
      }
    },
    sessionContext: {
      bloomsLevel: undefined,
      board: 'NCERT',
      channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
      collection: 'do_1127639035982479361130',
      collectionName: 'बाल रामकथा(HINDHI)',
      collectionStatus: undefined,
      collectionType: undefined,
      currentRole: 'CONTRIBUTOR',
      currentRoleId: 1,
      framework: 'NCFCOPY',
      medium: 'English',
      onBoardSchool: undefined,
      program: 'CBSE',
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1'
    },
    unitIdentifier: 'do_1127639059664486401136',
    content: {
        status: 'Review'
    }
  };

  export const playerConfig = {
    config: {},
    data: {},
    context: {
      pdata: {
        pid: ''
      }
    },
    metadata: {}
  };
