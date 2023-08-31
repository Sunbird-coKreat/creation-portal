export const resourceTemplateComponentInput = {
    templateList: [
      {
        filesConfig: { accepted: 'pdf', size: '50' },
        id: 'explanationContent',
        label: 'Explanation',
        metadata: {
          appIcon:
            // tslint:disable-next-line:max-line-length
            'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
          audience: ['Learner'],
          contentType: 'ExplanationResource',
          description: 'ExplanationResource',
          marks: 5,
          name: 'Explanation Resource',
          resourceType: 'Read'
        },
        mimeType: ['application/pdf', 'application/msword'],
        onClick: 'uploadComponent'
      },
      {
        id: 'curiositySetContent',
        label: 'Curiosity Sets',
        metadata: {
          appIcon: '',
          audience: ['Learner'],
          contentType: 'CuriosityQuestionSet',
          description: 'Curiosity QuestionSet',
          marks: 5,
          name: 'Curiosity QuestionSet',
          resourceType: 'Learn'
        },
        mimeType: ['application/vnd.ekstep.ecml-archive'],
        onClick: 'curiositySetComponent',
        questionCategories: ['Curiosity']
      }
    ],
    programContext: {
        config: {
          actions: {
           showAddResource: {
              roles: [1]
            },
            showEditResource: {
              roles: [2]
            },
            showMoveResource: {
              roles: [2]
            },
            showDeleteResource: {
              roles: [1]
            },
            showPreviewResource: {
              roles: [1]
            }
          }
        },
        userDetails: {
          programId: '0000000-000000-000000'
        },
        defaultRoles: ['CONTRIBUTOR'],
        rootorg_id: '1131700101604311041350'
      },
    sessionContext: {
        collection: 'do_0000000',
        telemetryPageDetails: {
          telemetryPageId: 'dummyPage',
          telemetryInteractCdata: {}
        }
    },
    unitIdentifier: 'do_1131700101604311041350',
    error: {
      "id": "api.dialcode.update",
      "ver": "1.0",
      "ts": "2021-06-09T05:51:06.894Z",
      "params": {
          "resmsgid": "aeff6ae0-c8e6-11eb-b277-0b49bcec017c",
          "msgid": null,
          "status": "failed",
          "err": null,
          "errmsg": null
      },
      "responseCode": "SERVER_ERROR",
      "result": {}
  }
  };
