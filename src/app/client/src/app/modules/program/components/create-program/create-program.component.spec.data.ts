export const frameWorkData = {
'err': null,
'frameworkdata': {
    'ekstep_ncert_k-12': {
    'identifier': 'ekstep_ncert_k-12',
    'code': 'ekstep_ncert_k-12',
    'translations': '{"hi":"एनसीएफ कॉपी","ka":"ncf ನಕಲಿಸಿ"}',
    'name': 'AP Board',
    'description': ' NCF framework..',
    'categories': [
        {
        'identifier': 'ekstep_ncert_k-12_board',
        'code': 'board',
        'terms': [
            {
            'associations': [
                {
                'identifier': 'ekstep_ncert_k-12_gradelevel_kindergarten',
                'code': 'kindergarten',
                'translations': '{"hi":"बाल विहार"}',
                'name': 'Kindergarten',
                'description': '',
                'category': 'gradeLevel',
                'status': 'Live'
                },
            ],
            'identifier': 'ekstep_ncert_k-12_board_ncert',
            'code': 'ncert',
            'translations': null,
            'name': 'NCERT',
            'description': '',
            'index': 1,
            'category': 'board',
            'status': 'Live'
            },
        ],
        'translations': null,
        'name': 'Curriculum',
        'description': '',
        'index': 1,
        'status': 'Live'
        },
        {
        'identifier': 'ekstep_ncert_k-12_medium',
        'code': 'medium',
        'translations': '{"hi":"मध्यम"}',
        'name': 'Medium',
        'description': '',
        'index': 2,
        'status': 'Live'
        },
        {
        'identifier': 'ekstep_ncert_k-12_subject',
        'code': 'subject',
        'terms': [
            {
            'identifier': 'ekstep_ncert_k-12_subject_mathematics',
            'code': 'mathematics',
            'children': [
                {
                'identifier': 'ekstep_ncert_k-12_subject_arithmetics',
                'code': 'arithmetics',
                'translations': null,
                'name': 'Arithmetics',
                'description': 'Arithmetics',
                'index': 1,
                'category': 'subject',
                'status': 'Live'
                }
            ],
            'translations': null,
            'name': 'Math',
            'description': 'Mathematics',
            'index': 1,
            'category': 'subject',
            'status': 'Live'
            },
            {
            'identifier': 'ekstep_ncert_k-12_subject_malayalam',
            'code': 'malayalam',
            'translations': null,
            'name': 'Malayalam',
            'description': '',
            'index': 22,
            'category': 'subject',
            'status': 'Live'
            }
        ],
        'translations': '{"hi":"विषय"}',
        'name': 'Subject',
        'description': '',
        'index': 4,
        'status': 'Live'
        },
    ],
    'type': 'K-12',
    'objectType': 'Framework'
    }
}
};

const userDetails =  {
'programId': '453b79e0-2d2f-11ea-a48e-338d4518b681',
'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
'onBoarded': true,
'onBoardingData': {
    'school': 'My School'
},
'roles': [
    'CONTRIBUTOR'
]
};

export const extFrameWorkPostData = {
'id': 'api.add.participants',
'responseCode': 'OK',
'result': {
    'created': 'OK',
    'programId': '852203a0-329b-11ea-896e-e55dcdd2e76a'
},
'ts': '2020-01-09T04:50:45.171Z',
'ver': '1.0'
};

export const userProfile = {
    'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    "userRegData": {},
};

export const individualUserRegData = {
    "userId": "6f2c7e13-3e0f-435e-8065-a84d481e8d92"
};

export const orgUserRegData = {
    "roles": ["user"]
};

export const orgAdminUserRegData = {
    "roles": ["admin"]
};

