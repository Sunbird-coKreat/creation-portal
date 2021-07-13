import { IEditorConfig } from 'collection-editor-library/lib/interfaces/editor';
export let editorConfig: IEditorConfig | undefined;
editorConfig = {
    context: {
    framework: 'test',
      user: {
        id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
        name: 'Vaibhav',
        orgIds: [
          '01309282781705830427'
        ]
      },
      identifier: 'do_113274017771085824116',
      channel: '01307938306521497658',
      authToken: ' ',
      sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
      did: '7e85b4967aebd6704ba1f604f20056b6',
      uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
      additionalCategories: [
        {
          value: 'Textbook',
          label: 'Textbook'
        },
        {
          value: 'Lesson Plan',
          label: 'Lesson Plan'
        }
      ],
      pdata: {
        id: 'dev.dock.portal',
        ver: '2.8.0',
        pid: 'creation-portal'
      },
      contextRollup: {
        l1: '01307938306521497658'
      },
      tags: [
        '01307938306521497658'
      ],
      cdata: [
        {
          id: '01307938306521497658',
          type: 'sourcing_organization'
        },
        {
          type: 'project',
          id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737'
        },
        {
          type: 'linked_collection',
          id: 'do_113140468925825024117'
        }
      ],
      timeDiff: 5,
      objectRollup: {
        l1: 'do_113140468925825024117',
        l2: 'do_113140468926914560125'
      },
      host: '',
      defaultLicense: 'CC BY 4.0',
      endpoint: '/data/v3/telemetry',
      env: 'question_set',
      cloudStorageUrls: [
        'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/',
        'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
        'https://dockstorage.blob.core.windows.net/sunbird-content-dock/'
      ],
      mode: 'edit',
    },
    config: {
      mode: 'edit',
      maxDepth: 2,
      objectType: 'Collection',
      primaryCategory: 'Course',
      isRoot: true,
      dialcodeMinLength: 2,
      dialcodeMaxLength: 250,
      iconClass: 'fa fa-book',
      children: {},
      hierarchy: {
        level1: {
          name: 'Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {}
        },
        level2: {
          name: 'Sub-Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {
            Content: [
              'Explanation Content',
              'Learning Resource',
              'eTextbook',
              'Teacher Resource',
              'Course Assessment'
            ]
          }
        },
        level3: {
          name: 'Sub-Sub-Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'CourseUnit',
          primaryCategory: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {
            Content: [
              'Explanation Content',
              'Learning Resource',
              'eTextbook',
              'Teacher Resource',
              'Course Assessment'
            ]
          }
        }
      },
      collection:{
        maxContentsLimit: 10
      },
      questionSet:{
        maxQuestionsLimit: 10
      },
      contentPolicyUrl: '/term-of-use.html'
    }
  }

export const nativeElement = `<div><ul id="ft-id-1" class="ui-fancytree fancytree-container fancytree-plain fancytree-ext-glyph fancytree-ext-dnd5 fancytree-connectors" tabindex="0" role="tree" aria-multiselectable="true"><li role="treeitem" aria-expanded="false" aria-selected="false" class="fancytree-lastsib"><span class="fancytree-node fancytree-folder fancytree-has-children fancytree-lastsib fancytree-exp-cl fancytree-ico-cf" draggable="true"><span role="button" class="fancytree-expander fa fa-caret-right"></span><span role="presentation" class="fancytree-custom-icon fa fa-book"></span><span class="fancytree-title" title="SB23410q" style="width:15em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden">SB23410q</span><span class="ui dropdown sb-dotted-dropdown" autoclose="itemClick" suidropdown="" tabindex="0" style="display: none;"> <span id="contextMenu" class="p-0 w-auto"><i class="icon ellipsis vertical sb-color-black"></i></span>
  <span id="contextMenuDropDown" class="menu transition hidden" suidropdownmenu="" style="">
    <div id="addchild" class="item">Add Child</div>
  </span>
  </span></span></li></ul></div>`;

export const getCategoryDefinitionResponse = {
    id: 'api.object.category.definition.read',
    ver: '3.0',
    ts: '2021-06-23T11:43:39ZZ',
    params: {
        resmsgid: '7efb262e-1b7e-44b7-8fe8-ceddc963cf47',
        msgid: null,
        err: null,
        status: 'successful',
        errmsg: null
    },
    responseCode: 'OK',
    result: {
        objectCategoryDefinition: {
            identifier: 'obj-cat:multiple-choice-question_question_all',
            objectMetadata: {
                config: {},
                schema: {
                    properties: {
                        mimeType: {
                            type: 'string',
                            enum: [
                                'application/vnd.sunbird.question'
                            ]
                        },
                        interactionTypes: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: [
                                    'choice'
                                ]
                            }
                        },
                        generateDIALCodes: {
                          default: 'Yes'
                        }
                    }
                }
            },
            languageCode: [],
            name: 'Multiple Choice Question',
            forms: {}
        }
    }
}

export const editorServiceSelectedChildren = {
    mimeType: 'application/vnd.sunbird.question',
    primaryCategory: 'Multiple Choice Question',
    interactionType: 'choice'
}

export const categoryDefinition = {
  result: {
    objectCategoryDefinition: {
      forms: {
        unitMetadata: {
          properties: {code: 'name', editable: true}
        },
        create: {
          properties: {code: 'name', editable: true}
        },
        search: {
          properties: {code: 'name', editable: true}
        },
        childMetadata: {
          properties: {code: 'name', editable: true}
        }
      }
    }
  }
}

export const hierarchyResponse = [{ result: {
  content: {
      ownershipType: [
          'createdBy'
      ],
      copyright: 'NIT123',
      keywords: [
          'test course'
      ],
      subject: [
          'English',
          'Hindi'
      ],
      targetMediumIds: [
          'nit_k-12_medium_english'
      ],
      channel: '01309282781705830427',
      organisation: [
          'NIT'
      ],
      language: [
          'English'
      ],
      mimeType: 'application/vnd.ekstep.content-collection',
      targetGradeLevelIds: [
          'nit_k-12_gradelevel_grade-1'
      ],
      objectType: 'Content',
      // tslint:disable-next-line:max-line-length
      appIcon: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113253856016146432127/artifact/do_113253856016146432127_1617902346121_image.jpg',
      primaryCategory: 'Course',
      children: [
          {
              ownershipType: [
                  'createdBy'
              ],
              parent: 'do_113316550746677248131',
              code: '89be24d9-d098-39c0-9680-0d0e3df3c647',
              keywords: [
                  'unit-1'
              ],
              credentials: {
                  enabled: 'No'
              },
              channel: '01309282781705830427',
              description: 'unit-1',
              language: [
                  'English'
              ],
              mimeType: 'application/vnd.ekstep.content-collection',
              idealScreenSize: 'normal',
              createdOn: '2021-07-06T07:15:40.525+0000',
              objectType: 'Content',
              primaryCategory: 'Course Unit',
              children: [
                  {
                      ownershipType: [
                          'createdBy'
                      ],
                      parent: 'do_113316552626380800133',
                      code: 'd6067beb-01f9-a634-13a4-c453fc3d05d9',
                      keywords: [
                          'unit-1.1'
                      ],
                      credentials: {
                          enabled: 'No'
                      },
                      channel: '01309282781705830427',
                      description: 'unit-1.1',
                      language: [
                          'English'
                      ],
                      mimeType: 'application/vnd.ekstep.content-collection',
                      idealScreenSize: 'normal',
                      createdOn: '2021-07-06T07:15:50.428+0000',
                      objectType: 'Content',
                      primaryCategory: 'Course Unit',
                      children: [
                          {
                              ownershipType: [
                                  'createdBy'
                              ],
                              parent: 'do_113316552707506176135',
                              unitIdentifiers: [
                                  'do_1133124409146736641472'
                              ],
                              copyright: '2021',
                              previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1133124455783546881476/artifact/do_1133124455783546881476_1625054498447_dummy.pdf',
                              subject: [
                                  'Mathematics'
                              ],
                              channel: '01309282781705830427',
                              downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1133124455783546881476/content-name-is-more-than-30-charcater_1625054501658_do_1133124455783546881476_1.0.ecar',
                              language: [
                                  'English'
                              ],
                              source: 'https://dock.sunbirded.org/api/content/v1/read/do_1133124455783546881476',
                              mimeType: 'application/pdf',
                              variants: {
                                  spine: {
                                      ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1133124455783546881476/content-name-is-more-than-30-charcater_1625054501895_do_1133124455783546881476_1.0_spine.ecar',
                                      size: 1487
                                  }
                              },
                              objectType: 'Content',
                              se_mediums: [
                                  'Hindi'
                              ],
                              gradeLevel: [
                                  'Class 1'
                              ],
                              primaryCategory: 'eTextbook',
                              appId: 'dev.dock.portal',
                              contentEncoding: 'identity',
                              artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1133124455783546881476/artifact/do_1133124455783546881476_1625054498447_dummy.pdf',
                              sYS_INTERNAL_LAST_UPDATED_ON: '2021-06-30T12:01:42.209+0000',
                              contentType: 'eTextBook',
                              se_gradeLevels: [
                                  'Class 1'
                              ],
                              trackable: {
                                  enabled: 'No',
                                  autoBatch: 'No'
                              },
                              identifier: 'do_1133124455783546881476',
                              audience: [
                                  'Student'
                              ],
                              visibility: 'Default',
                              author: 'Vai',
                              consumerId: '273f3b18-5dda-4a27-984a-060c7cd398d3',
                              discussionForum: {
                                  enabled: 'Yes'
                              },
                              index: 1,
                              mediaType: 'content',
                              osId: 'org.ekstep.quiz.app',
                              languageCode: [
                                  'en'
                              ],
                              lastPublishedBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
                              version: 2,
                              pragma: [
                                  'external'
                              ],
                              se_subjects: [
                                  'Mathematics'
                              ],
                              license: 'CC BY 4.0',
                              prevState: 'Review',
                              size: 14040,
                              lastPublishedOn: '2021-06-30T12:01:41.657+0000',
                              name: 'content name is more than 30 charcater',
                              status: 'Live',
                              code: '92db93d1-9a9b-61aa-9b6d-66bbb979f4ad',
                              credentials: {
                                  enabled: 'No'
                              },
                              prevStatus: 'Processing',
                              origin: 'do_1133124455783546881476',
                              streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1133124455783546881476/artifact/do_1133124455783546881476_1625054498447_dummy.pdf',
                              medium: [
                                  'Hindi'
                              ],
                              idealScreenSize: 'normal',
                              createdOn: '2021-06-30T12:01:38.105+0000',
                              se_boards: [
                                  'CBSE'
                              ],
                              processId: '7b4d85eb-1167-4e99-9941-2091961dfac8',
                              contentDisposition: 'inline',
                              lastUpdatedOn: '2021-06-30T12:01:41.299+0000',
                              originData: {
                                  identifier: 'do_1133124455783546881476',
                                  repository: 'https://dock.sunbirded.org/api/content/v1/read/do_1133124455783546881476'
                              },
                              collectionId: 'do_1133124409135595521471',
                              dialcodeRequired: 'No',
                              lastStatusChangedOn: '2021-06-30T12:01:42.198+0000',
                              createdFor: [
                                  '01309282781705830427'
                              ],
                              creator: 'Vai',
                              os: [
                                  'All'
                              ],
                              cloudStorageKey: 'content/do_1133124455783546881476/artifact/do_1133124455783546881476_1625054498447_dummy.pdf',
                              se_FWIds: [
                                  'ekstep_ncert_k-12'
                              ],
                              pkgVersion: 1,
                              versionKey: '1625054501299',
                              idealScreenDensity: 'hdpi',
                              framework: 'ekstep_ncert_k-12',
                              depth: 3,
                              s3Key: 'ecar_files/do_1133124455783546881476/content-name-is-more-than-30-charcater_1625054501658_do_1133124455783546881476_1.0.ecar',
                              lastSubmittedOn: '2021-06-30T12:01:39.984+0000',
                              createdBy: 'd3d05422-1670-4c3e-9051-13c306e89a95',
                              compatibilityLevel: 4,
                              board: 'CBSE',
                              programId: '537c2280-d999-11eb-882d-db3e4f86a45f'
                          }
                      ],
                      contentDisposition: 'inline',
                      lastUpdatedOn: '2021-07-06T07:15:50.428+0000',
                      contentEncoding: 'gzip',
                      contentType: 'CourseUnit',
                      dialcodeRequired: 'No',
                      trackable: {
                          enabled: 'No',
                          autoBatch: 'No'
                      },
                      identifier: 'do_113316552707506176135',
                      lastStatusChangedOn: '2021-07-06T07:15:50.428+0000',
                      audience: [
                          'Student'
                      ],
                      os: [
                          'All'
                      ],
                      visibility: 'Parent',
                      discussionForum: {
                          enabled: 'Yes'
                      },
                      index: 1,
                      mediaType: 'content',
                      osId: 'org.ekstep.launcher',
                      languageCode: [
                          'en'
                      ],
                      version: 2,
                      versionKey: '1625555750428',
                      license: 'CC BY 4.0',
                      idealScreenDensity: 'hdpi',
                      depth: 2,
                      compatibilityLevel: 1,
                      name: 'unit-1.1',
                      timeLimits: {},
                      status: 'Draft',
                      level: 3
                  }
              ],
              contentDisposition: 'inline',
              lastUpdatedOn: '2021-07-06T07:15:40.525+0000',
              contentEncoding: 'gzip',
              contentType: 'CourseUnit',
              dialcodeRequired: 'No',
              trackable: {
                  enabled: 'No',
                  autoBatch: 'No'
              },
              identifier: 'do_113316552626380800133',
              lastStatusChangedOn: '2021-07-06T07:15:40.525+0000',
              audience: [
                  'Student'
              ],
              os: [
                  'All'
              ],
              visibility: 'Parent',
              discussionForum: {
                  enabled: 'Yes'
              },
              index: 1,
              mediaType: 'content',
              osId: 'org.ekstep.launcher',
              languageCode: [
                  'en'
              ],
              version: 2,
              versionKey: '1625555740525',
              license: 'CC BY 4.0',
              idealScreenDensity: 'hdpi',
              depth: 1,
              compatibilityLevel: 1,
              name: 'unit-1',
              timeLimits: {},
              status: 'Draft',
              level: 2
          }
      ],
      contentEncoding: 'gzip',
      collaborators: [
          '5c3a2a46-4830-4ade-a4cd-b6780635569c'
      ],
      lockKey: '49d5e059-5ff7-444c-bcf5-84e293f8da7c',
      generateDIALCodes: 'Yes',
      contentType: 'Course',
      trackable: {
          enabled: 'Yes',
          autoBatch: 'Yes'
      },
      identifier: 'do_113316550746677248131',
      audience: [
          'Student'
      ],
      subjectIds: [
          'nit_k-12_subject_english',
          'nit_k-12_subject_hindi'
      ],
      visibility: 'Default',
      consumerId: '273f3b18-5dda-4a27-984a-060c7cd398d3',
      childNodes: [
          'do_1133124455783546881476',
          'do_113316552707506176135',
          'do_113316552626380800133'
      ],
      discussionForum: {
          enabled: 'Yes'
      },
      mediaType: 'content',
      osId: 'org.ekstep.quiz.app',
      languageCode: [
          'en'
      ],
      version: 2,
      license: 'CC BY 4.0',
      name: 'test course',
      targetBoardIds: [
          'nit_k-12_board_cbse'
      ],
      status: 'Draft',
      code: 'org.sunbird.Yj12wV',
      credentials: {
          enabled: 'Yes'
      },
      description: 'test course1',
      idealScreenSize: 'normal',
      createdOn: '2021-07-06T07:11:51.103+0000',
      targetSubjectIds: [
          'nit_k-12_subject_english'
      ],
      copyrightYear: 2021,
      contentDisposition: 'inline',
      additionalCategories: [
          'Lesson Plan',
          'Textbook'
      ],
      lastUpdatedOn: '2021-07-06T07:23:08.357+0000',
      dialcodeRequired: 'No',
      lastStatusChangedOn: '2021-07-06T07:11:51.103+0000',
      createdFor: [
          '01309282781705830427'
      ],
      creator: 'N11',
      os: [
          'All'
      ],
      targetFWIds: [
          'nit_k-12'
      ],
      versionKey: '1625556188357',
      idealScreenDensity: 'hdpi',
      framework: 'nit_k-12',
      depth: 0,
      createdBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      compatibilityLevel: 1,
      userConsent: 'Yes',
      timeLimits: '{}',
      resourceType: 'Course',
      level: 1
  }
  }
}]

export const categoryDefinitionData = {
    id: 'api.object.category.definition.read',
    ver: '3.0',
    ts: '2021-07-07T17:25:31ZZ',
    params: {
        resmsgid: '8306af95-5259-4a3d-ab11-2d81586b8d30',
        msgid: null,
        err: null,
        status: 'successful',
        errmsg: null
    },
    responseCode: 'OK',
    result: {
        objectCategoryDefinition: {
            identifier: 'obj-cat:course_collection_01309282781705830427',
            objectMetadata: {
                config: {
                    frameworkMetadata: {
                        orgFWType: [
                            'K-12',
                            'TPD'
                        ],
                        targetFWType: [
                            'K-12'
                        ]
                    },
                    sourcingSettings: {
                        collection: {
                            maxDepth: 4,
                            objectType: 'Collection',
                            primaryCategory: 'Course',
                            isRoot: true,
                            iconClass: 'fa fa-book',
                            children: {},
                            hierarchy: {
                                level1: {
                                    name: 'Course Unit',
                                    type: 'Unit',
                                    mimeType: 'application/vnd.ekstep.content-collection',
                                    contentType: 'CourseUnit',
                                    primaryCategory: 'Course Unit',
                                    iconClass: 'fa fa-folder-o',
                                    children: {}
                                },
                                level2: {
                                    name: 'Course Unit',
                                    type: 'Unit',
                                    mimeType: 'application/vnd.ekstep.content-collection',
                                    contentType: 'CourseUnit',
                                    primaryCategory: 'Course Unit',
                                    iconClass: 'fa fa-folder-o',
                                    children: {
                                        Content: []
                                    }
                                },
                                level3: {
                                    name: 'Course Unit',
                                    type: 'Unit',
                                    mimeType: 'application/vnd.ekstep.content-collection',
                                    contentType: 'CourseUnit',
                                    primaryCategory: 'Course Unit',
                                    iconClass: 'fa fa-folder-o',
                                    children: {
                                        Content: []
                                    }
                                },
                                level4: {
                                    name: 'Course Unit',
                                    type: 'Unit',
                                    mimeType: 'application/vnd.ekstep.content-collection',
                                    contentType: 'CourseUnit',
                                    primaryCategory: 'Course Unit',
                                    iconClass: 'fa fa-folder-o',
                                    children: {
                                        Content: []
                                    }
                                }
                            }
                        }
                    }
                },
                schema: {
                    properties: {
                        trackable: {
                            type: 'object',
                            properties: {
                                enabled: {
                                    type: 'string',
                                    enum: [
                                        'Yes',
                                        'No'
                                    ],
                                    default: 'Yes'
                                },
                                autoBatch: {
                                    type: 'string',
                                    enum: [
                                        'Yes',
                                        'No'
                                    ],
                                    default: 'Yes'
                                }
                            },
                            default: {
                                enabled: 'Yes',
                                autoBatch: 'Yes'
                            },
                            additionalProperties: false
                        },
                        monitorable: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: [
                                    'progress-report',
                                    'score-report'
                                ]
                            }
                        },
                        credentials: {
                            type: 'object',
                            properties: {
                                enabled: {
                                    type: 'string',
                                    enum: [
                                        'Yes',
                                        'No'
                                    ],
                                    default: 'Yes'
                                }
                            },
                            default: {
                                enabled: 'Yes'
                            },
                            additionalProperties: false
                        },
                        userConsent: {
                            type: 'string',
                            enum: [
                                'Yes',
                                'No'
                            ],
                            default: 'Yes'
                        },
                        mimeType: {
                            type: 'string',
                            enum: [
                                'application/vnd.ekstep.content-collection'
                            ]
                        },
                        generateDIALCodes: {
                            type: 'string',
                            enum: [
                                'Yes',
                                'No'
                            ],
                            default: 'Yes'
                        }
                    }
                }
            },
            languageCode: [],
            name: 'Course',
            forms: {
                create: {
                    templateName: '',
                    required: [],
                    properties: [
                        {
                            name: 'First Section',
                            fields: [
                                {
                                    code: 'appIcon',
                                    dataType: 'text',
                                    description: 'appIcon of the content',
                                    editable: true,
                                    inputType: 'appIcon',
                                    label: 'Icon',
                                    name: 'Icon',
                                    placeholder: 'Icon',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    required: true,
                                    visible: true
                                },
                                {
                                    code: 'name',
                                    dataType: 'text',
                                    description: 'Name of the content',
                                    editable: true,
                                    inputType: 'text',
                                    label: 'Title',
                                    name: 'Name',
                                    placeholder: 'Title',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    required: true,
                                    visible: true,
                                    validations: [
                                        {
                                            type: 'maxLength',
                                            value: '120',
                                            message: 'Input is Exceeded'
                                        },
                                        {
                                            type: 'required',
                                            message: 'Title is required'
                                        }
                                    ]
                                },
                                {
                                    code: 'description',
                                    dataType: 'text',
                                    description: 'Description of the content',
                                    editable: true,
                                    inputType: 'textarea',
                                    label: 'Description',
                                    name: 'Description',
                                    placeholder: 'Description',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    required: false,
                                    visible: true,
                                    validations: [
                                        {
                                            type: 'maxLength',
                                            value: '256',
                                            message: 'Input is Exceeded'
                                        }
                                    ]
                                },
                                {
                                    code: 'keywords',
                                    visible: true,
                                    editable: true,
                                    dataType: 'list',
                                    name: 'Keywords',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    description: 'Keywords for the content',
                                    inputType: 'keywords',
                                    label: 'Keywords',
                                    placeholder: 'Enter Keywords',
                                    required: false,
                                    validations: []
                                }
                            ]
                        },
                        {
                            name: 'Second Section',
                            fields: [
                                {
                                    code: 'dialcodeRequired',
                                    dataType: 'text',
                                    description: 'QR CODE REQUIRED',
                                    editable: true,
                                    default: 'No',
                                    index: 5,
                                    inputType: 'radio',
                                    label: 'QR code required',
                                    name: 'dialcodeRequired',
                                    placeholder: 'QR code required',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    range: [
                                        'Yes',
                                        'No'
                                    ],
                                    required: false,
                                    visible: true
                                },
                                {
                                    code: 'dialcodes',
                                    depends: [
                                        'dialcodeRequired'
                                    ],
                                    dataType: 'list',
                                    description: 'Digital Infrastructure for Augmented Learning',
                                    editable: true,
                                    inputType: 'dialcode',
                                    label: 'QR code',
                                    name: 'dialcode',
                                    placeholder: 'Enter code here',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    required: true,
                                    visible: true,
                                    validations: [
                                        {
                                            type: 'minLength',
                                            value: '2'
                                        },
                                        {
                                            type: 'maxLength',
                                            value: '20'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'Third Section',
                            fields: [
                                {
                                    code: 'primaryCategory',
                                    dataType: 'text',
                                    description: 'Type',
                                    editable: false,
                                    renderingHints: {},
                                    inputType: 'select',
                                    label: 'Category',
                                    name: 'Type',
                                    placeholder: '',
                                    required: true,
                                    visible: true,
                                    validations: []
                                },
                                {
                                    code: 'additionalCategories',
                                    dataType: 'list',
                                    depends: [
                                        'primaryCategory'
                                    ],
                                    description: 'Additonal Category of the Content',
                                    editable: true,
                                    inputType: 'nestedselect',
                                    label: 'Additional Category',
                                    name: 'Additional Category',
                                    placeholder: 'Select Additional Category',
                                    renderingHints: {},
                                    required: false,
                                    visible: true
                                }
                            ]
                        },
                        {
                            name: 'Organisation Framework Terms',
                            fields: [
                                {
                                    code: 'framework',
                                    visible: true,
                                    editable: true,
                                    dataType: 'text',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    description: '',
                                    label: 'Course Type',
                                    required: true,
                                    name: 'Framework',
                                    inputType: 'framework',
                                    placeholder: 'Select Course Type',
                                    output: 'identifier',
                                    validations: [
                                        {
                                            type: 'required',
                                            message: 'Course Type is required'
                                        }
                                    ]
                                },
                                {
                                    code: 'subjectIds',
                                    visible: true,
                                    editable: true,
                                    dataType: 'list',
                                    depends: [
                                        'framework'
                                    ],
                                    sourceCategory: 'subject',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    description: '',
                                    label: 'Subjects covered in the course',
                                    required: true,
                                    name: 'Subject',
                                    inputType: 'frameworkCategorySelect',
                                    placeholder: 'Select Subject(s)',
                                    output: 'identifier',
                                    validations: [
                                        {
                                            type: 'required',
                                            message: 'Subjects Taught is required'
                                        }
                                    ]
                                },
                                {
                                    code: 'topicsIds',
                                    visible: true,
                                    editable: true,
                                    dataType: 'list',
                                    depends: [
                                        'framework',
                                        'subjectIds'
                                    ],
                                    sourceCategory: 'topic',
                                    renderingHints: {},
                                    name: 'Topic',
                                    description: 'Choose a Topics',
                                    inputType: 'topicselector',
                                    label: 'Topics covered in the course',
                                    placeholder: 'Choose Topics',
                                    required: false,
                                    output: 'identifier'
                                }
                            ]
                        },
                        {
                            name: 'Target Framework Terms',
                            fields: [
                                {
                                    code: 'audience',
                                    dataType: 'list',
                                    description: 'Audience',
                                    editable: true,
                                    inputType: 'nestedselect',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    label: 'Audience Type',
                                    name: 'Audience Type',
                                    placeholder: 'Select Audience Type',
                                    required: false,
                                    visible: true,
                                    range: [
                                        'Student',
                                        'Teacher',
                                        'Parent',
                                        'Administrator'
                                    ]
                                },
                                {
                                    code: 'targetBoardIds',
                                    visible: true,
                                    depends: [],
                                    editable: true,
                                    dataType: 'list',
                                    sourceCategory: 'board',
                                    output: 'identifier',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    description: 'Board',
                                    label: 'Board/Syllabus of the audience',
                                    required: true,
                                    name: 'Board/Syllabus',
                                    inputType: 'select',
                                    placeholder: 'Select Board/Syllabus',
                                    validations: [
                                        {
                                            type: 'required',
                                            message: 'Board is required'
                                        }
                                    ]
                                },
                                {
                                    code: 'targetMediumIds',
                                    visible: true,
                                    depends: [
                                        'targetBoardIds'
                                    ],
                                    editable: true,
                                    dataType: 'list',
                                    sourceCategory: 'medium',
                                    output: 'identifier',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    description: '',
                                    label: 'Medium(s) of the audience',
                                    required: true,
                                    name: 'Medium',
                                    inputType: 'nestedselect',
                                    placeholder: 'Select Medium',
                                    validations: [
                                        {
                                            type: 'required',
                                            message: 'Medium is required'
                                        }
                                    ]
                                },
                                {
                                    code: 'targetGradeLevelIds',
                                    visible: true,
                                    depends: [
                                        'targetBoardIds',
                                        'targetMediumIds'
                                    ],
                                    editable: true,
                                    dataType: 'list',
                                    sourceCategory: 'gradeLevel',
                                    output: 'identifier',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    description: 'Class',
                                    label: 'Class(es) of the audience',
                                    required: true,
                                    name: 'Class',
                                    inputType: 'nestedselect',
                                    placeholder: 'Select Class',
                                    validations: [
                                        {
                                            type: 'required',
                                            message: 'Class is required'
                                        }
                                    ]
                                },
                                {
                                    code: 'targetSubjectIds',
                                    visible: true,
                                    depends: [
                                        'targetBoardIds',
                                        'targetMediumIds',
                                        'targetGradeLevelIds'
                                    ],
                                    editable: true,
                                    dataType: 'list',
                                    sourceCategory: 'subject',
                                    output: 'identifier',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    description: '',
                                    label: 'Subject(s) of the audience',
                                    required: true,
                                    name: 'Subject',
                                    inputType: 'nestedselect',
                                    placeholder: 'Select Subject',
                                    validations: [
                                        {
                                            type: 'required',
                                            message: 'Subject is required'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'Sixth Section',
                            fields: [
                                {
                                    code: 'author',
                                    dataType: 'text',
                                    description: 'Author of the content',
                                    editable: true,
                                    inputType: 'text',
                                    label: 'Author',
                                    name: 'Author',
                                    placeholder: 'Author',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    required: false,
                                    visible: true
                                },
                                {
                                    code: 'attributions',
                                    dataType: 'text',
                                    description: 'Attributions',
                                    editable: true,
                                    inputType: 'text',
                                    label: 'Attributions',
                                    name: 'Attributions',
                                    placeholder: 'Attributions',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    required: false,
                                    visible: true
                                },
                                {
                                    code: 'copyright',
                                    dataType: 'text',
                                    description: 'Copyright',
                                    editable: true,
                                    inputType: 'text',
                                    label: 'Copyright',
                                    name: 'Copyright & year',
                                    placeholder: 'Copyright',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    required: true,
                                    visible: true,
                                    validations: [
                                        {
                                            type: 'required',
                                            message: 'Copyright is required'
                                        }
                                    ]
                                },
                                {
                                    code: 'copyrightYear',
                                    dataType: 'text',
                                    description: 'Year',
                                    editable: true,
                                    inputType: 'text',
                                    label: 'Copyright Year',
                                    name: 'Copyright Year',
                                    placeholder: 'Copyright Year',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    required: true,
                                    visible: true,
                                    validations: [
                                        {
                                            type: 'required',
                                            message: 'Copyright Year is required'
                                        }
                                    ]
                                },
                                {
                                    code: 'license',
                                    dataType: 'text',
                                    description: 'license',
                                    editable: true,
                                    inputType: 'select',
                                    label: 'License',
                                    name: 'license',
                                    placeholder: 'Select License',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    required: true,
                                    visible: true,
                                    defaultValue: 'CC BY 4.0',
                                    validations: [
                                        {
                                            type: 'required',
                                            message: 'License is required'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                delete: {},
                publish: {},
                review: {},
                search: {
                    templateName: '',
                    required: [],
                    properties: [
                        {
                            code: 'primaryCategory',
                            dataType: 'list',
                            description: 'Type',
                            editable: true,
                            default: [],
                            renderingHints: {
                                class: 'sb-g-col-lg-1'
                            },
                            inputType: 'nestedselect',
                            label: 'Content Type(s)',
                            name: 'Type',
                            placeholder: 'Select ContentType',
                            required: false,
                            visible: true
                        },
                        {
                            code: 'board',
                            visible: true,
                            depends: [],
                            editable: true,
                            dataType: 'list',
                            renderingHints: {
                                class: 'sb-g-col-lg-1'
                            },
                            description: 'Board',
                            label: 'Board',
                            required: false,
                            name: 'Board',
                            inputType: 'select',
                            placeholder: 'Select Board',
                            output: 'name'
                        },
                        {
                            code: 'medium',
                            visible: true,
                            depends: [
                                'board'
                            ],
                            editable: true,
                            dataType: 'list',
                            renderingHints: {
                                class: 'sb-g-col-lg-1'
                            },
                            description: '',
                            label: 'Medium(s)',
                            required: false,
                            name: 'Medium',
                            inputType: 'nestedselect',
                            placeholder: 'Select Medium',
                            output: 'name'
                        },
                        {
                            code: 'gradeLevel',
                            visible: true,
                            depends: [
                                'board',
                                'medium'
                            ],
                            editable: true,
                            default: '',
                            dataType: 'list',
                            renderingHints: {
                                class: 'sb-g-col-lg-1'
                            },
                            description: 'Class',
                            label: 'Class(es)',
                            required: false,
                            name: 'Class',
                            inputType: 'nestedselect',
                            placeholder: 'Select Class',
                            output: 'name'
                        },
                        {
                            code: 'subject',
                            visible: true,
                            depends: [
                                'board',
                                'medium',
                                'gradeLevel'
                            ],
                            editable: true,
                            default: '',
                            dataType: 'list',
                            renderingHints: {
                                class: 'sb-g-col-lg-1'
                            },
                            description: '',
                            label: 'Subject(s)',
                            required: false,
                            name: 'Subject',
                            inputType: 'nestedselect',
                            placeholder: 'Select Subject',
                            output: 'name'
                        },
                        {
                            code: 'topic',
                            visible: true,
                            editable: true,
                            dataType: 'list',
                            depends: [
                                'board',
                                'medium',
                                'gradeLevel',
                                'subject'
                            ],
                            default: '',
                            renderingHints: {
                                class: 'sb-g-col-lg-1'
                            },
                            name: 'Topic',
                            description: 'Choose a Topics',
                            inputType: 'topicselector',
                            label: 'Topic(s)',
                            placeholder: 'Choose Topics',
                            required: false
                        }
                    ]
                },
                unitMetadata: {
                    templateName: '',
                    required: [],
                    properties: [
                        {
                            name: 'First Section',
                            fields: [
                                {
                                    code: 'name',
                                    dataType: 'text',
                                    description: 'Name of the content',
                                    editable: true,
                                    inputType: 'text',
                                    label: 'Title',
                                    name: 'Title',
                                    placeholder: 'Title',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1 required'
                                    },
                                    required: true,
                                    visible: true,
                                    validations: [
                                        {
                                            type: 'max',
                                            value: '120',
                                            message: 'Input is Exceeded'
                                        },
                                        {
                                            type: 'required',
                                            message: 'Title is required'
                                        }
                                    ]
                                },
                                {
                                    code: 'description',
                                    dataType: 'text',
                                    description: 'Description of the content',
                                    editable: true,
                                    inputType: 'textarea',
                                    label: 'Description',
                                    name: 'Description',
                                    placeholder: 'Description',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    required: false,
                                    visible: true,
                                    validations: [
                                        {
                                            type: 'max',
                                            value: '256',
                                            message: 'Input is Exceeded'
                                        }
                                    ]
                                },
                                {
                                    code: 'keywords',
                                    visible: true,
                                    editable: true,
                                    dataType: 'list',
                                    name: 'Keywords',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    index: 3,
                                    description: 'Keywords for the content',
                                    inputType: 'keywords',
                                    label: 'Keywords',
                                    placeholder: 'Enter Keywords',
                                    required: false,
                                    validations: []
                                },
                                {
                                    code: 'topic',
                                    visible: true,
                                    depends: [],
                                    editable: true,
                                    dataType: 'list',
                                    renderingHints: {},
                                    name: 'Topic',
                                    description: 'Choose a Topics',
                                    index: 11,
                                    inputType: 'topicselector',
                                    label: 'Topics',
                                    placeholder: 'Choose Topics',
                                    required: false,
                                    validations: []
                                },
                                {
                                    code: 'dialcodeRequired',
                                    dataType: 'text',
                                    description: 'QR CODE REQUIRED',
                                    editable: true,
                                    default: 'No',
                                    index: 5,
                                    inputType: 'radio',
                                    label: 'QR code required',
                                    name: 'dialcodeRequired',
                                    placeholder: 'QR code required',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    range: [
                                        'Yes',
                                        'No'
                                    ],
                                    required: false,
                                    visible: true
                                },
                                {
                                    code: 'dialcodes',
                                    depends: [
                                        'dialcodeRequired'
                                    ],
                                    dataType: 'list',
                                    description: 'Digital Infrastructure for Augmented Learning',
                                    editable: true,
                                    inputType: 'dialcode',
                                    label: 'QR code',
                                    name: 'dialcode',
                                    placeholder: 'Enter code here',
                                    renderingHints: {
                                        class: 'sb-g-col-lg-1'
                                    },
                                    required: true,
                                    visible: true,
                                    validations: [
                                        {
                                            type: 'minLength',
                                            value: '2'
                                        },
                                        {
                                            type: 'maxLength',
                                            value: '20'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                update: {}
            }
        }
    }
}
