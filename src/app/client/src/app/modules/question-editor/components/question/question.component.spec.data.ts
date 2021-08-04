export const mockData = {
    childMetadata: {
        templateName: '',
        required: [],
        properties: [
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
                    class: 'sb-g-col-lg-1 required'
                },
                required: true,
                visible: true,
                validations: [
                    {
                        type: 'max',
                        value: '200',
                        message: 'Input is Exceeded'
                    },
                    {
                        type: 'required',
                        message: 'Title is required'
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
                label: 'keywords',
                placeholder: 'Enter Keywords',
                required: false,
                validations: [
                    {
                        type: 'required',
                        message: 'Keyword is required'
                    }
                ]
            }
        ]
    },
    questionMetaData: {
        answer: '<p>adasd</p>',
        body: '<p>asd</p>',
        description: 'description',
        editorState: {
            answer: '<p>adasd</p>',
            editorState: { answer: '<p>adasd</p>' },
            name: 'Subjective Question',
            primaryCategory: 'Subjective Question',
            qType: 'SA',
            question: '<p>asd</p>',
        },
        identifier: 'do_113219577241780224147',
        keywords: ['keyword'],
        languageCode: ['en'],
        media: [],
        mimeType: 'application/vnd.sunbird.question',
        name: 'Mcq question ',
        primaryCategory: 'Subjective Question',
        qType: 'SA',
        solutions: []
    },
    childMetadataUpdated: {
        templateName: '',
        required: [],
        properties: [
            {
                code: 'name',
                dataType: 'text',
                description: 'Name of the content',
                editable: false,
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
                editable: false,
                inputType: 'textarea',
                label: 'Description',
                name: 'Description',
                placeholder: 'Description',
                renderingHints: {
                    class: 'sb-g-col-lg-1 required'
                },
                required: true,
                visible: true,
                validations: [
                    {
                        type: 'max',
                        value: '200',
                        message: 'Input is Exceeded'
                    },
                    {
                        type: 'required',
                        message: 'Title is required'
                    }
                ]
            },
            {
                "code": "board",
                "default": "",
                "visible": true,
                "depends": [],
                "editable": true,
                "dataType": "text",
                "renderingHints": {
                    "class": "sb-g-col-lg-1"
                },
                "description": "Board",
                "label": "Board/Syllabus",
                "required": false,
                "name": "Board/Syllabus",
                "inputType": "select",
                "placeholder": "Select Board/Syllabus"
            },
            {
                code: 'keywords',
                visible: true,
                editable: false,
                dataType: 'list',
                name: 'Keywords',
                renderingHints: {
                    class: 'sb-g-col-lg-1 required'
                },
                description: 'Keywords for the content',
                inputType: 'keywords',
                label: 'keywords',
                placeholder: 'Enter Keywords',
                required: false,
                validations: [
                    {
                        type: 'required',
                        message: 'Keyword is required'
                    }
                ]
            }
        ]
    },
    formData: {
        description: 'description',
        keywords: ['keyword'],
        name: ''
    },
    frameWorkDetails: {
        frameworkData: [
            {
                "identifier": "ekstep_ncert_k-12_board",
                "code": "board",
                "terms": [
                    {
                        "associations": [
                            {
                                "identifier": "ekstep_ncert_k-12_learningoutcome_9686a2a712bdfdb43408555865cda57f2367699a",
                                "code": "9686a2a712bdfdb43408555865cda57f2367699a",
                                "translations": null,
                                "name": "Inequalities in a triangle.",
                                "description": "Inequalities in a triangle.",
                                "index": 0,
                                "category": "learningoutcome",
                                "status": "Live"
                            },
                            {
                                "identifier": "ekstep_ncert_k-12_topic_08859db5d07d93b99c12b3e5bceb975c582d31b7",
                                "code": "08859db5d07d93b99c12b3e5bceb975c582d31b7",
                                "translations": null,
                                "name": "Nature around the kids",
                                "description": "Nature around the kids",
                                "index": 0,
                                "category": "topic",
                                "status": "Live"
                            }],
                        "identifier": "ekstep_ncert_k-12_board_cbse",
                        "code": "cbse",
                        "translations": null,
                        "name": "CBSE",
                        "description": "CBSE",
                        "index": 10,
                        "category": "board",
                        "status": "Live"
                    }
                ],
                "translations": null,
                "name": "Board",
                "description": "Board",
                "index": 1,
                "status": "Live"
            }
        ],
        topicList: [
            {
                "identifier": "ekstep_ncert_k-12_topic_08859db5d07d93b99c12b3e5bceb975c582d31b7",
                "code": "08859db5d07d93b99c12b3e5bceb975c582d31b7",
                "translations": null,
                "name": "Nature around the kids",
                "description": "Nature around the kids",
                "index": 10,
                "category": "topic",
                "status": "Live"
            }
        ]
    },
    editorState: {
        body: {
            "answer": '</p> Yes</p>',
            "question": "<p>Hi how are you ?</p>",
            "editorState": {
                "answer": '</p> Yes</p>'
            },
            "name": "Subjective Question",
            "qType": "SA",
            "primaryCategory": "Subjective Question"
        },
        mediaobj: {}
    },
    eventData: {
        body: { answer: "<p>dad</p>" },
        editorState: { answer: "<p>dad</p>" },
        name: "Subjective Question",
        qType: "SA",
        primaryCategory: "Subjective Question",
        mediaobj: undefined
    }
};
