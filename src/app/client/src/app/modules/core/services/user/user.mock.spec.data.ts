export const mockUserData = {
    tenantSuccess:
    {
        'id': 'api.tenant.info',
        'ver': '1.0',
        'ts': '2018-04-10 15:34:45:875+0530',
        'params': {
            'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
            'msgid': null,
            'status': 'successful',
            'err': '',
            'errmsg': ''
        },
        'responseCode': 'OK',
        'result': {
            'titleName': 'SUNBIRD',
            'logo': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'poster': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'favicon': 'http://localhost:3000/assets/images/favicon.ico',
            'appLogo': 'http://localhost:3000/assets/images/sunbird_logo.png'
        }
    },
    tenantFailure: {
        'id': 'api.tenant.info',
        'ver': '1.0',
        'ts': '2018-04-10 15:34:45:875+0530',
        'params': {
            'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
            'msgid': null,
            'status': 'failed'
        },
        'responseCode': 'CLIENT_ERROR'
    },
    tenantDefault: {
        'titleName': 'Sunbird',
        'logo': 'http://localhost:3000/assets/images/sunbird_logo.png',
        'poster': 'http://localhost:3000/assets/images/sunbird_logo.png',
        'favicon': 'http://localhost:3000/assets/images/favicon.ico',
        'appLogo': 'http://localhost:3000/assets/images/sunbird_logo.png'

    },
    error: {
        'id': 'api.user.read',
        'ver': 'v1',
        'ts': '2018-02-28 12:07:33:518+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'bdf695fd-3916-adb0-2072-1d53deb14aea',
            'err': null,
            'status': 'error',
            'errmsg': null
        },
        'responseCode': 'CLINTERROR',
        'result': {}
    },
    success: {
        'id': 'api.user.read',
        'ver': 'v1',
        'ts': '2018-02-28 12:07:33:518+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'bdf695fd-3916-adb0-2072-1d53deb14aea',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'missingFields': [
                    'dob',
                    'location'
                ],
                'lastName': 'User',
                'webPages': [
                    {
                        'type': 'fb',
                        'url': 'https://www.facebook.com/gjh'
                    }
                ],
                'tcStatus': null,
                'loginId': 'ntptest102',
                'education': [
                    {
                        'updatedBy': null,
                        'yearOfPassing': 0,
                        'degree': 'hhj',
                        'updatedDate': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressId': null,
                        'duration': null,
                        'courseName': null,
                        'createdDate': '2017-11-30 13:19:47:276+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardOrUniversity': '',
                        'grade': '',
                        'percentage': null,
                        'name': 'g',
                        'id': '0123867019537448963'
                    },
                    {
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'yearOfPassing': 2000,
                        'degree': 'ahd',
                        'updatedDate': '2017-12-06 13:52:13:291+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressId': null,
                        'duration': null,
                        'courseName': null,
                        'createdDate': '2017-12-06 13:50:59:915+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardOrUniversity': '',
                        'grade': 'F',
                        'percentage': 999,
                        'name': 'djd',
                        'id': '0123909651904757763'
                    }
                ],
                'gender': 'female',
                'regOrgId': '0123653943740170242',
                'subject': [
                    'Gujarati',
                    'Kannada'
                ],
                'roles': [
                    'public'
                ],
                'language': [
                    'Bengali'
                ],
                'updatedDate': '2018-02-21 08:54:46:436+0000',
                'completeness': 88,
                'skills': [
                    {
                        'skillName': 'bnn',
                        'addedAt': '2018-02-17',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-02-17',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'f2f8f18e45d2ede1eb93f40dd53e11290814fd5999d056181d919f219c9fda03',
                        'skillNameToLowercase': 'bnn',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'as',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '8ef363f359f68c7db0e1422f29e97632229d2ce92ad95cbd2525b068f8cbc2cf',
                        'skillNameToLowercase': 'as',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'java',
                        'addedAt': '2017-11-19',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-19',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '9f96b0187dff50353a1ca9bb5177324f61d6c725fe7f050938b0c530ad2d82d8',
                        'skillNameToLowercase': 'java',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'kafka123',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'abefe2638ec556faad62ca18d9214e8175584e87ff70c27e566c74727789790f',
                        'skillNameToLowercase': 'kafka123',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asllfhsal',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'e00543bb0c0fc0822136eaf17223be0d7c2fc8f4b5f5c2a0a2c902c5aaed4a1f',
                        'skillNameToLowercase': 'asllfhsal',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'purescript',
                        'addedAt': '2017-11-17',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-17',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'ee5c047f3b2f552f7cd31dffefc87bdcd34d9adac9a44ed79e44498136ff821d',
                        'skillNameToLowercase': 'purescript',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'angular',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '65fc8fb2cc0f5a54f30d3fe412631184820abc73a390ee66bea000680af2b0ff',
                        'skillNameToLowercase': 'angular',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'graph database - neo4g',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '5bdf5759b63e106897a22ce960fdeca108da759e105d25cf2ccb0fb8e8fb54b8',
                        'skillNameToLowercase': 'graph database - neo4g',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'kafka',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '17759f5c8024ab470190c2b2da1554ed693a2a5d93aba9bcc27c42889146eaea',
                        'skillNameToLowercase': 'kafka',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'apis design',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'a05fc5f9e82344b4adbc8b5a51b10f7133946667e1724bf7df1705e8b8c1e462',
                        'skillNameToLowercase': 'apis design',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asflashf',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '0f419edad82dd10f6d49b0f38622a12365a8ce8356100004fa4aa17352b7a32f',
                        'skillNameToLowercase': 'asflashf',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asfajsfh',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '50985029eea591602cc64e243ceb2679688639fe5f3cdccde79eb94248dfc303',
                        'skillNameToLowercase': 'asfajsfh',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'akka',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '8f8ced5c48869be76c3fde50be6221a7cd34ddae4887959f612ddb3e7ba34ed9',
                        'skillNameToLowercase': 'akka',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'test',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'cdbfc1812b172e1362e384bdd42ea13360333d8ad6140064a5a81d8ec3d72002',
                        'skillNameToLowercase': 'test',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'afjalskf',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '28acdc61a6865a2cf571083dbc50684878f718efde54502c12e0b02c729a932b',
                        'skillNameToLowercase': 'afjalskf',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'cassandra',
                        'addedAt': '2017-11-19',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-19',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '54b258bb673e38b7159de94a3746ab60f232535364ee05bce0d91bcc215236d7',
                        'skillNameToLowercase': 'cassandra',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    }
                ],
                'isDeleted': null,
                'organisations': [
                    {
                        'organisationId': '0123653943740170242',
                        'updatedBy': null,
                        'addedByName': null,
                        'addedBy': null,
                        'roles': [
                            'CONTENT_CREATION',
                            'PUBLIC'
                        ],
                        'approvedBy': null,
                        'updatedDate': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'approvaldate': null,
                        'isDeleted': false,
                        'isRejected': null,
                        'id': '01236539426110668816',
                        'position': 'ASD',
                        'isApproved': null,
                        'orgjoindate': '2017-10-31 10:47:04:732+0000',
                        'orgLeftDate': null
                    }
                ],
                'provider': null,
                'countryCode': null,
                'id': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'tempPassword': null,
                'email': 'us********@testss.com',
                'rootOrg': {
                    'dateTime': null,
                    'preferredLanguage': 'English',
                    'approvedBy': null,
                    'channel': 'ROOT_ORG',
                    'description': 'Sunbird',
                    'updatedDate': '2017-08-24 06:02:10:846+0000',
                    'addressId': null,
                    'orgType': null,
                    'provider': null,
                    'orgCode': 'sunbird',
                    'theme': null,
                    'id': 'ORG_001',
                    'communityId': null,
                    'isApproved': null,
                    'slug': 'sunbird',
                    'identifier': 'ORG_001',
                    'thumbnail': null,
                    'orgName': 'Sunbird',
                    'updatedBy': 'user1',
                    'externalId': null,
                    'isRootOrg': true,
                    'rootOrgId': null,
                    'approvedDate': null,
                    'imgUrl': null,
                    'homeUrl': null,
                    'isDefault': null,
                    'contactDetail':
                        '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'}]',
                    'createdDate': null,
                    'createdBy': null,
                    'parentOrgId': null,
                    'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
                    'noOfMembers': 1,
                    'status': null
                },
                'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'profileVisibility': {
                    'skills': 'private',
                    'address': 'private',
                    'profileSummary': 'private'
                },
                'thumbnail': null,
                'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'address': [
                    {
                        'country': 'dsfg',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'city': 'dsf',
                        'updatedDate': '2018-02-21 08:54:46:451+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'zipcode': '560015',
                        'addType': 'current',
                        'createdDate': '2018-01-28 17:31:11:677+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressLine1': 'sadf',
                        'addressLine2': 'sdf',
                        'id': '01242858643843481618',
                        'state': 'dsfff'
                    },
                    {
                        'country': 'zxc',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'city': 'dszfx',
                        'updatedDate': '2018-02-21 08:54:46:515+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'zipcode': '560017',
                        'addType': 'current',
                        'createdDate': '2018-01-28 17:30:35:711+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressLine1': 'sdsf',
                        'addressLine2': 'sdf',
                        'id': '01242858632795750422',
                        'state': 'ds'
                    }
                ],
                'jobProfile': [
                    {
                        'jobName': 'hhH',
                        'orgName': 'hhh',
                        'role': 'bnmnghbgg',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endDate': null,
                        'isVerified': null,
                        'subject': [
                            'Assamese'
                        ],
                        'joiningDate': '2017-10-19',
                        'updatedDate': '2018-02-21 08:49:05:880+0000',
                        'isCurrentJob': false,
                        'verifiedBy': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardName': null,
                        'orgId': null,
                        'addressId': null,
                        'createdDate': '2017-12-06 16:15:28:684+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'verifiedDate': null,
                        'isRejected': null,
                        'id': '01239103162216448010'
                    },
                    {
                        'jobName': 'dcv',
                        'orgName': 'dsf',
                        'role': 'dfgdd',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endDate': null,
                        'isVerified': null,
                        'subject': [
                            'Bengali'
                        ],
                        'joiningDate': '2018-02-06',
                        'updatedDate': '2018-02-21 08:49:05:886+0000',
                        'isCurrentJob': false,
                        'verifiedBy': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardName': null,
                        'orgId': null,
                        'addressId': null,
                        'createdDate': '2018-02-18 05:47:58:561+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'verifiedDate': null,
                        'isRejected': null,
                        'id': '0124430985025290242'
                    }
                ],
                'profileSummary': 'asdd',
                'tcUpdatedDate': null,
                'avatar':
                    'https://sunbirddev.blob.core.windows.net/user/874ed8a5-782e-4f6c-8f36-e0288455901e/File-01242833565242982418.png',
                'userName': 'ntptest102',
                'rootOrgId': 'ORG_001',
                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'emailVerified': null,
                'firstName': 'Cretation',
                'lastLoginTime': 1519809987692,
                'createdDate': '2017-10-31 10:47:04:723+0000',
                'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45',
                'phone': '******4412',
                'dob': null,
                'registeredOrg': {
                    'dateTime': null,
                    'preferredLanguage': null,
                    'approvedBy': null,
                    'channel': null,
                    'description': null,
                    'updatedDate': '2017-11-17 09:00:59:342+0000',
                    'addressId': null,
                    'orgType': null,
                    'provider': null,
                    'orgCode': null,
                    'locationId': '0123668622585610242',
                    'theme': null,
                    'id': '0123653943740170242',
                    'communityId': null,
                    'isApproved': null,
                    'slug': null,
                    'identifier': '0123653943740170242',
                    'thumbnail': null,
                    'orgName': 'QA ORG',
                    'updatedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                    'externalId': null,
                    'isRootOrg': false,
                    'rootOrgId': 'ORG_001',
                    'approvedDate': null,
                    'imgUrl': null,
                    'homeUrl': null,
                    'orgTypeId': null,
                    'isDefault': null,
                    'contactDetail': [],
                    'createdDate': '2017-10-31 10:43:48:600+0000',
                    'createdBy': null,
                    'parentOrgId': null,
                    'hashTagId': '0123653943740170242',
                    'noOfMembers': null,
                    'status': 1
                },
                'grade': [
                    'Grade 2'
                ],
                'currentLoginTime': null,
                'location': '',
                'status': 1
            }
        }
    },
    rootOrgSuccess: {
        'id': 'api.user.read',
        'ver': 'v1',
        'ts': '2018-02-28 12:07:33:518+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'bdf695fd-3916-adb0-2072-1d53deb14aea',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'missingFields': [
                    'dob',
                    'location'
                ],
                'lastName': 'User',
                'webPages': [
                    {
                        'type': 'fb',
                        'url': 'https://www.facebook.com/gjh'
                    }
                ],
                'tcStatus': null,
                'loginId': 'ntptest102',
                'education': [
                    {
                        'updatedBy': null,
                        'yearOfPassing': 0,
                        'degree': 'hhj',
                        'updatedDate': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressId': null,
                        'duration': null,
                        'courseName': null,
                        'createdDate': '2017-11-30 13:19:47:276+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardOrUniversity': '',
                        'grade': '',
                        'percentage': null,
                        'name': 'g',
                        'id': '0123867019537448963'
                    },
                    {
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'yearOfPassing': 2000,
                        'degree': 'ahd',
                        'updatedDate': '2017-12-06 13:52:13:291+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressId': null,
                        'duration': null,
                        'courseName': null,
                        'createdDate': '2017-12-06 13:50:59:915+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardOrUniversity': '',
                        'grade': 'F',
                        'percentage': 999,
                        'name': 'djd',
                        'id': '0123909651904757763'
                    }
                ],
                'gender': 'female',
                'regOrgId': '0123653943740170242',
                'subject': [
                    'Gujarati',
                    'Kannada'
                ],
                'roles': [
                    'public',
                    'ORG_ADMIN',
                    'SYSTEM_ADMINISTRATION'
                ],
                'language': [
                    'Bengali'
                ],
                'updatedDate': '2018-02-21 08:54:46:436+0000',
                'completeness': 88,
                'skills': [
                    {
                        'skillName': 'bnn',
                        'addedAt': '2018-02-17',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-02-17',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'f2f8f18e45d2ede1eb93f40dd53e11290814fd5999d056181d919f219c9fda03',
                        'skillNameToLowercase': 'bnn',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'as',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '8ef363f359f68c7db0e1422f29e97632229d2ce92ad95cbd2525b068f8cbc2cf',
                        'skillNameToLowercase': 'as',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'java',
                        'addedAt': '2017-11-19',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-19',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '9f96b0187dff50353a1ca9bb5177324f61d6c725fe7f050938b0c530ad2d82d8',
                        'skillNameToLowercase': 'java',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'kafka123',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'abefe2638ec556faad62ca18d9214e8175584e87ff70c27e566c74727789790f',
                        'skillNameToLowercase': 'kafka123',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asllfhsal',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'e00543bb0c0fc0822136eaf17223be0d7c2fc8f4b5f5c2a0a2c902c5aaed4a1f',
                        'skillNameToLowercase': 'asllfhsal',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'purescript',
                        'addedAt': '2017-11-17',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-17',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'ee5c047f3b2f552f7cd31dffefc87bdcd34d9adac9a44ed79e44498136ff821d',
                        'skillNameToLowercase': 'purescript',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'angular',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '65fc8fb2cc0f5a54f30d3fe412631184820abc73a390ee66bea000680af2b0ff',
                        'skillNameToLowercase': 'angular',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'graph database - neo4g',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '5bdf5759b63e106897a22ce960fdeca108da759e105d25cf2ccb0fb8e8fb54b8',
                        'skillNameToLowercase': 'graph database - neo4g',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'kafka',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '17759f5c8024ab470190c2b2da1554ed693a2a5d93aba9bcc27c42889146eaea',
                        'skillNameToLowercase': 'kafka',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'apis design',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'a05fc5f9e82344b4adbc8b5a51b10f7133946667e1724bf7df1705e8b8c1e462',
                        'skillNameToLowercase': 'apis design',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asflashf',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '0f419edad82dd10f6d49b0f38622a12365a8ce8356100004fa4aa17352b7a32f',
                        'skillNameToLowercase': 'asflashf',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asfajsfh',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '50985029eea591602cc64e243ceb2679688639fe5f3cdccde79eb94248dfc303',
                        'skillNameToLowercase': 'asfajsfh',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'akka',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '8f8ced5c48869be76c3fde50be6221a7cd34ddae4887959f612ddb3e7ba34ed9',
                        'skillNameToLowercase': 'akka',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'test',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'cdbfc1812b172e1362e384bdd42ea13360333d8ad6140064a5a81d8ec3d72002',
                        'skillNameToLowercase': 'test',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'afjalskf',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '28acdc61a6865a2cf571083dbc50684878f718efde54502c12e0b02c729a932b',
                        'skillNameToLowercase': 'afjalskf',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'cassandra',
                        'addedAt': '2017-11-19',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-19',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '54b258bb673e38b7159de94a3746ab60f232535364ee05bce0d91bcc215236d7',
                        'skillNameToLowercase': 'cassandra',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    }
                ],
                'isDeleted': null,
                'organisations': [
                    {
                        'organisationId': 'ORG_001',
                        'updatedBy': null,
                        'addedByName': null,
                        'addedBy': null,
                        'roles': [
                            'CONTENT_CREATION',
                            'PUBLIC',
                            'ORG_ADMIN'
                        ],
                        'approvedBy': null,
                        'updatedDate': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'approvaldate': null,
                        'isDeleted': false,
                        'isRejected': null,
                        'id': '01236539426110668816',
                        'position': 'ASD',
                        'isApproved': null,
                        'orgjoindate': '2017-10-31 10:47:04:732+0000',
                        'orgLeftDate': null
                    }
                ],
                'provider': null,
                'countryCode': null,
                'id': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'tempPassword': null,
                'email': 'us********@testss.com',
                'rootOrg': {
                    'dateTime': null,
                    'preferredLanguage': 'English',
                    'approvedBy': null,
                    'channel': 'ROOT_ORG',
                    'description': 'Sunbird',
                    'updatedDate': '2017-08-24 06:02:10:846+0000',
                    'addressId': null,
                    'orgType': null,
                    'provider': null,
                    'orgCode': 'sunbird',
                    'theme': null,
                    'id': 'ORG_001',
                    'communityId': null,
                    'isApproved': null,
                    'slug': 'sunbird',
                    'identifier': 'ORG_001',
                    'thumbnail': null,
                    'orgName': 'Sunbird',
                    'updatedBy': 'user1',
                    'externalId': null,
                    'isRootOrg': true,
                    'rootOrgId': null,
                    'approvedDate': null,
                    'imgUrl': null,
                    'homeUrl': null,
                    'isDefault': null,
                    'contactDetail':
                        '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'}]',
                    'createdDate': null,
                    'createdBy': null,
                    'parentOrgId': null,
                    'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
                    'noOfMembers': 1,
                    'status': null
                },
                'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'profileVisibility': {
                    'skills': 'private',
                    'address': 'private',
                    'profileSummary': 'private'
                },
                'thumbnail': null,
                'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'address': [
                    {
                        'country': 'dsfg',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'city': 'dsf',
                        'updatedDate': '2018-02-21 08:54:46:451+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'zipcode': '560015',
                        'addType': 'current',
                        'createdDate': '2018-01-28 17:31:11:677+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressLine1': 'sadf',
                        'addressLine2': 'sdf',
                        'id': '01242858643843481618',
                        'state': 'dsfff'
                    },
                    {
                        'country': 'zxc',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'city': 'dszfx',
                        'updatedDate': '2018-02-21 08:54:46:515+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'zipcode': '560017',
                        'addType': 'current',
                        'createdDate': '2018-01-28 17:30:35:711+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressLine1': 'sdsf',
                        'addressLine2': 'sdf',
                        'id': '01242858632795750422',
                        'state': 'ds'
                    }
                ],
                'jobProfile': [
                    {
                        'jobName': 'hhH',
                        'orgName': 'hhh',
                        'role': 'bnmnghbgg',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endDate': null,
                        'isVerified': null,
                        'subject': [
                            'Assamese'
                        ],
                        'joiningDate': '2017-10-19',
                        'updatedDate': '2018-02-21 08:49:05:880+0000',
                        'isCurrentJob': false,
                        'verifiedBy': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardName': null,
                        'orgId': null,
                        'addressId': null,
                        'createdDate': '2017-12-06 16:15:28:684+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'verifiedDate': null,
                        'isRejected': null,
                        'id': '01239103162216448010'
                    },
                    {
                        'jobName': 'dcv',
                        'orgName': 'dsf',
                        'role': 'dfgdd',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endDate': null,
                        'isVerified': null,
                        'subject': [
                            'Bengali'
                        ],
                        'joiningDate': '2018-02-06',
                        'updatedDate': '2018-02-21 08:49:05:886+0000',
                        'isCurrentJob': false,
                        'verifiedBy': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardName': null,
                        'orgId': null,
                        'addressId': null,
                        'createdDate': '2018-02-18 05:47:58:561+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'verifiedDate': null,
                        'isRejected': null,
                        'id': '0124430985025290242'
                    }
                ],
                'profileSummary': 'asdd',
                'tcUpdatedDate': null,
                'avatar':
                    'https://sunbirddev.blob.core.windows.net/user/874ed8a5-782e-4f6c-8f36-e0288455901e/File-01242833565242982418.png',
                'userName': 'ntptest102',
                'rootOrgId': 'ORG_001',
                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'emailVerified': null,
                'firstName': 'Cretation',
                'lastLoginTime': 1519809987692,
                'createdDate': '2017-10-31 10:47:04:723+0000',
                'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45',
                'phone': '******4412',
                'dob': null,
                'registeredOrg': {
                    'dateTime': null,
                    'preferredLanguage': null,
                    'approvedBy': null,
                    'channel': null,
                    'description': null,
                    'updatedDate': '2017-11-17 09:00:59:342+0000',
                    'addressId': null,
                    'orgType': null,
                    'provider': null,
                    'orgCode': null,
                    'locationId': '0123668622585610242',
                    'theme': null,
                    'id': '0123653943740170242',
                    'communityId': null,
                    'isApproved': null,
                    'slug': null,
                    'identifier': '0123653943740170242',
                    'thumbnail': null,
                    'orgName': 'QA ORG',
                    'updatedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                    'externalId': null,
                    'isRootOrg': false,
                    'rootOrgId': 'ORG_001',
                    'approvedDate': null,
                    'imgUrl': null,
                    'homeUrl': null,
                    'orgTypeId': null,
                    'isDefault': null,
                    'contactDetail': [],
                    'createdDate': '2017-10-31 10:43:48:600+0000',
                    'createdBy': null,
                    'parentOrgId': null,
                    'hashTagId': '0123653943740170242',
                    'noOfMembers': null,
                    'status': 1
                },
                'grade': [
                    'Grade 2'
                ],
                'currentLoginTime': null,
                'location': '',
                'status': 1
            }
        }
    },
    feedSuccessResponse: {
        'id': null,
        'ver': null,
        'ts': null,
        'params': null,
        'responseCode': 'OK',
        'result': {
            'response': {
                'userFeed': [
                    {
                        'expireOn': 1574611273492,
                        'feedData': {
                            'channel': [
                                'TN',
                                'RJ',
                                'AP'
                            ],
                            'order': 1
                        },
                        'createdBy': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
                        'closable': false,
                        'channel': 'TN',
                        'feedAction': 'unRead',
                        'id': '01289921810742476874',
                        'category': 'orgMigrationAction',
                        'priority': 1,
                        'userId': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
                        'createdOn': 1574611273492
                    }
                ]
            }
        }
    },

    migrateSuccessResponse: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:02:28:841+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS',
            'errors': []
        }
    },

    contributorOrgAdminDetails: {
        "tcStatus": null,
        "maskedPhone": null,
        "rootOrgName": "Vidya2",
        "channel": "V12",
        "updatedDate": "2020-08-12 00:14:54:265+0000",
        "managedBy": null,
        "flagsValue": 6,
        "id": "48dc0e70-2775-474b-9b78-def27d047836",
        "recoveryEmail": "",
        "identifier": "48dc0e70-2775-474b-9b78-def27d047836",
        "thumbnail": null,
        "profileVisibility": {},
        "updatedBy": "48dc0e70-2775-474b-9b78-def27d047836",
        "accesscode": null,
        "externalIds": [],
        "registryId": null,
        "roleList": [{
            "name": "Content Curation",
            "id": "CONTENT_CURATION"
        }, {
            "name": "Content Creator",
            "id": "CONTENT_CREATOR"
        }, {
            "name": "Official TextBook Badge Issuer",
            "id": "OFFICIAL_TEXTBOOK_BADGE_ISSUER"
        }, {
            "name": "Admin",
            "id": "ADMIN"
        }, {
            "name": "Course Mentor",
            "id": "COURSE_MENTOR"
        }, {
            "name": "Org Admin",
            "id": "ORG_ADMIN"
        }, {
            "name": "Content Review",
            "id": "CONTENT_REVIEW"
        }, {
            "name": "Flag Reviewer",
            "id": "FLAG_REVIEWER"
        }, {
            "name": "Announcement Sender",
            "id": "ANNOUNCEMENT_SENDER"
        }, {
            "name": "System Administration",
            "id": "SYSTEM_ADMINISTRATION"
        }, {
            "name": "Book Creator",
            "id": "BOOK_CREATOR"
        }, {
            "name": "Course Creator",
            "id": "COURSE_CREATOR"
        }, {
            "name": "Report Viewer",
            "id": "REPORT_VIEWER"
        }, {
            "name": "Flag Reviewer",
            "id": "FLAG_REVIEWER "
        }, {
            "name": "Membership Management",
            "id": "MEMBERSHIP_MANAGEMENT"
        }, {
            "name": "Content Creation",
            "id": "CONTENT_CREATION"
        }, {
            "name": "Book Reviewer",
            "id": "BOOK_REVIEWER"
        }, {
            "name": "Teacher Badge Issuer",
            "id": "TEACHER_BADGE_ISSUER"
        }, {
            "name": "Org Management",
            "id": "ORG_MANAGEMENT"
        }, {
            "name": "Course Admin",
            "id": "COURSE_ADMIN"
        }, {
            "name": "Org Moderator",
            "id": "ORG_MODERATOR"
        }, {
            "name": "Public",
            "id": "PUBLIC"
        }, {
            "name": "Content Reviewer",
            "id": "CONTENT_REVIEWER"
        }, {
            "name": "Report Admin",
            "id": "REPORT_ADMIN"
        }],
        "rootOrgId": "012983850117177344161",
        "prevUsedEmail": "",
        "firstName": "Kayal new as old not there",
        "tncAcceptedOn": "2020-07-21T09:45:47.622Z",
        "phone": "",
        "currentLoginTime": null,
        "userType": "OTHER",
        "status": 1,
        "lastName": null,
        "tncLatestVersion": "v1",
        "roles": ["PUBLIC"],
        "prevUsedPhone": "",
        "stateValidated": true,
        "isDeleted": false,
        "organisations": [{
            "updatedBy": null,
            "organisationId": "012983850117177344161",
            "orgName": "Vidya2",
            "addedByName": null,
            "addedBy": null,
            "roles": ["BOOK_CREATOR", "ORG_ADMIN", "PUBLIC"],
            "approvedBy": null,
            "channel": "V12",
            "locationIds": [],
            "updatedDate": "2020-07-16 10:30:01:562+0000",
            "userId": "48dc0e70-2775-474b-9b78-def27d047836",
            "approvaldate": null,
            "isDeleted": false,
            "parentOrgId": null,
            "hashTagId": "012983850117177344161",
            "isRejected": false,
            "locations": [],
            "position": null,
            "id": "0130653848562401280",
            "orgjoindate": "2020-07-16 10:29:20:739+0000",
            "isApproved": false,
            "orgLeftDate": null
        }],
        "provider": null,
        "tncLatestVersionUrl": "https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html",
        "maskedEmail": "ka******@yopmail.com",
        "tempPassword": null,
        "email": "ka******@yopmail.com",
        "rootOrg": {
            "dateTime": null,
            "preferredLanguage": null,
            "keys": {},
            "channel": "V12",
            "approvedBy": null,
            "description": "Preprod Kayal Org",
            "updatedDate": null,
            "addressId": null,
            "orgType": null,
            "provider": null,
            "orgCode": null,
            "locationId": null,
            "theme": null,
            "id": "012983850117177344161",
            "isApproved": null,
            "communityId": null,
            "slug": "v12",
            "email": null,
            "isSSOEnabled": false,
            "identifier": "012983850117177344161",
            "thumbnail": null,
            "updatedBy": null,
            "orgName": "Vidya2",
            "address": {},
            "locationIds": [],
            "externalId": null,
            "isRootOrg": true,
            "rootOrgId": "012983850117177344161",
            "imgUrl": null,
            "approvedDate": null,
            "orgTypeId": null,
            "homeUrl": null,
            "isDefault": null,
            "createdDate": "2020-03-23 05:48:49:660+0000",
            "parentOrgId": null,
            "createdBy": null,
            "hashTagId": "012983850117177344161",
            "noOfMembers": null,
            "status": 1
        },
        "profileSummary": null,
        "phoneVerified": false,
        "tcUpdatedDate": null,
        "userLocations": [],
        "recoveryPhone": "",
        "userName": "kayalnew",
        "userId": "48dc0e70-2775-474b-9b78-def27d047836",
        "promptTnC": false,
        "emailVerified": true,
        "framework": {},
        "createdDate": "2020-07-16 10:29:16:509+0000",
        "createdBy": "8454cb21-3ce9-4e30-85b5-fade097880d8",
        "tncAcceptedVersion": "v1",
        "skills": [],
        "rootOrgAdmin": true,
        "userRoles": ["PUBLIC", "BOOK_CREATOR", "ORG_ADMIN"],
        "orgRoleMap": {
            "012983850117177344161": ["BOOK_CREATOR", "ORG_ADMIN", "PUBLIC"]
        },
        "organisationIds": ["012983850117177344161"],
        "hashTagIds": ["012983850117177344161"],
        "userRegData": {
            "User": {
                "lastName": "",
                "osUpdatedAt": "2020-07-17T00:54:17.566Z",
                "firstName": "kayal",
                "osCreatedAt": "2020-07-17T00:54:17.566Z",
                "enrolledDate": "2020-07-17T00:54:16.773Z",
                "@type": "User",
                "channel": "012983850117177344161",
                "osid": "d27d83cd-4e20-4d1d-902a-0d148ad87afe",
                "userId": "48dc0e70-2775-474b-9b78-def27d047836"
            },
            "User_Org": {
                "osUpdatedAt": "2020-08-11T14:01:10.738Z",
                "osCreatedAt": "2020-08-11T14:01:10.738Z",
                "@type": "User_Org",
                "roles": ["admin"],
                "osid": "b25d93c7-7cb9-4e87-adf0-95a850404e8f",
                "userId": "d27d83cd-4e20-4d1d-902a-0d148ad87afe",
                "orgId": "e0ab89f4-0fcb-47ea-9b70-3ed0f12b1b7a"
            },
            "Org": {
                "osUpdatedAt": "2020-08-11T14:01:10.690Z",
                "code": "VIDYA2",
                "osCreatedAt": "2020-08-11T14:01:10.690Z",
                "createdBy": "d27d83cd-4e20-4d1d-902a-0d148ad87afe",
                "@type": "Org",
                "name": "Vidya2",
                "description": "Vidya2",
                "osid": "e0ab89f4-0fcb-47ea-9b70-3ed0f12b1b7a",
                "type": ["contribute", "sourcing"],
                "orgId": "012983850117177344161"
            }
        },
        "roleOrgMap": {
            "BOOK_CREATOR": ["012983850117177344161"],
            "ORG_ADMIN": ["012983850117177344161"],
            "PUBLIC": ["012983850117177344161"]
        }
    },

    contributingOrgContributorDetails: {
        "tcStatus": null,
        "maskedPhone": null,
        "rootOrgName": "Vidyanikethan",
        "subject": [],
        "channel": "VID123",
        "language": [],
        "updatedDate": null,
        "managedBy": null,
        "flagsValue": 6,
        "id": "1b0cd97d-e2b8-4bb8-8c19-7bf9a37b4a56",
        "recoveryEmail": "",
        "identifier": "1b0cd97d-e2b8-4bb8-8c19-7bf9a37b4a56",
        "thumbnail": null,
        "profileVisibility": {
            "lastName": "public",
            "webPages": "private",
            "jobProfile": "private",
            "address": "private",
            "education": "private",
            "gender": "private",
            "profileSummary": "public",
            "subject": "private",
            "language": "private",
            "avatar": "private",
            "userName": "public",
            "skills": "private",
            "firstName": "public",
            "badgeAssertions": "private",
            "phone": "private",
            "countryCode": "private",
            "dob": "private",
            "grade": "private",
            "location": "private",
            "email": "private"
        },
        "updatedBy": null,
        "accesscode": null,
        "externalIds": [],
        "registryId": null,
        "roleList": [{
            "name": "Content Curation",
            "id": "CONTENT_CURATION"
        }, {
            "name": "Content Creator",
            "id": "CONTENT_CREATOR"
        }, {
            "name": "Official TextBook Badge Issuer",
            "id": "OFFICIAL_TEXTBOOK_BADGE_ISSUER"
        }, {
            "name": "Admin",
            "id": "ADMIN"
        }, {
            "name": "Course Mentor",
            "id": "COURSE_MENTOR"
        }, {
            "name": "Org Admin",
            "id": "ORG_ADMIN"
        }, {
            "name": "Content Review",
            "id": "CONTENT_REVIEW"
        }, {
            "name": "Flag Reviewer",
            "id": "FLAG_REVIEWER"
        }, {
            "name": "Announcement Sender",
            "id": "ANNOUNCEMENT_SENDER"
        }, {
            "name": "System Administration",
            "id": "SYSTEM_ADMINISTRATION"
        }, {
            "name": "Book Creator",
            "id": "BOOK_CREATOR"
        }, {
            "name": "Course Creator",
            "id": "COURSE_CREATOR"
        }, {
            "name": "Report Viewer",
            "id": "REPORT_VIEWER"
        }, {
            "name": "Flag Reviewer",
            "id": "FLAG_REVIEWER "
        }, {
            "name": "Membership Management",
            "id": "MEMBERSHIP_MANAGEMENT"
        }, {
            "name": "Content Creation",
            "id": "CONTENT_CREATION"
        }, {
            "name": "Book Reviewer",
            "id": "BOOK_REVIEWER"
        }, {
            "name": "Teacher Badge Issuer",
            "id": "TEACHER_BADGE_ISSUER"
        }, {
            "name": "Org Management",
            "id": "ORG_MANAGEMENT"
        }, {
            "name": "Course Admin",
            "id": "COURSE_ADMIN"
        }, {
            "name": "Org Moderator",
            "id": "ORG_MODERATOR"
        }, {
            "name": "Public",
            "id": "PUBLIC"
        }, {
            "name": "Content Reviewer",
            "id": "CONTENT_REVIEWER"
        }, {
            "name": "Report Admin",
            "id": "REPORT_ADMIN"
        }],
        "rootOrgId": "0130659746662727680",
        "prevUsedEmail": "",
        "firstName": "lily10",
        "tncAcceptedOn": "2020-09-08T10:04:47.264Z",
        "phone": "",
        "dob": null,
        "grade": [],
        "currentLoginTime": null,
        "userType": "OTHER",
        "status": 1,
        "lastName": null,
        "tncLatestVersion": "v1",
        "gender": null,
        "roles": ["PUBLIC"],
        "prevUsedPhone": "",
        "stateValidated": true,
        "badgeAssertions": [],
        "isDeleted": false,
        "organisations": [{
            "updatedBy": null,
            "organisationId": "0130659746662727680",
            "orgName": "Vidyanikethan",
            "addedByName": null,
            "addedBy": null,
            "roles": ["CONTENT_REVIEWER", "BOOK_REVIEWER", "PUBLIC"],
            "approvedBy": null,
            "channel": "VID123",
            "locationIds": [],
            "updatedDate": "2020-07-17 06:30:33:073+0000",
            "userId": "1b0cd97d-e2b8-4bb8-8c19-7bf9a37b4a56",
            "approvaldate": null,
            "isDeleted": false,
            "parentOrgId": null,
            "hashTagId": "0130659746662727680",
            "isRejected": false,
            "locations": [],
            "position": null,
            "id": "01306598073661030410",
            "orgjoindate": "2020-07-17 06:30:32:373+0000",
            "isApproved": false,
            "orgLeftDate": null
        }],
        "provider": null,
        "countryCode": null,
        "tncLatestVersionUrl": "https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html",
        "maskedEmail": "li****@yopmail.com",
        "tempPassword": null,
        "email": "li****@yopmail.com",
        "rootOrg": {
            "dateTime": null,
            "preferredLanguage": null,
            "keys": {},
            "channel": "VID123",
            "approvedBy": null,
            "description": "Dev",
            "updatedDate": null,
            "addressId": null,
            "orgType": null,
            "provider": null,
            "orgCode": null,
            "locationId": null,
            "theme": null,
            "id": "0130659746662727680",
            "isApproved": null,
            "communityId": null,
            "slug": "vid123",
            "email": null,
            "isSSOEnabled": false,
            "identifier": "0130659746662727680",
            "thumbnail": null,
            "updatedBy": null,
            "orgName": "Vidyanikethan",
            "address": {},
            "locationIds": [],
            "externalId": null,
            "isRootOrg": true,
            "rootOrgId": "0130659746662727680",
            "imgUrl": null,
            "approvedDate": null,
            "orgTypeId": null,
            "homeUrl": null,
            "isDefault": null,
            "createdDate": "2020-07-17 06:26:52:318+0000",
            "parentOrgId": null,
            "createdBy": null,
            "hashTagId": "0130659746662727680",
            "noOfMembers": null,
            "status": 1
        },
        "defaultProfileFieldVisibility": "private",
        "profileSummary": null,
        "phoneVerified": false,
        "tcUpdatedDate": null,
        "userLocations": [],
        "recoveryPhone": "",
        "userName": "lily10@yopmail.com",
        "userId": "1b0cd97d-e2b8-4bb8-8c19-7bf9a37b4a56",
        "promptTnC": false,
        "emailVerified": true,
        "framework": {},
        "createdDate": "2020-07-17 06:30:32:099+0000",
        "createdBy": "347606ea-cf25-41b2-8c45-a78242695014",
        "location": null,
        "tncAcceptedVersion": "v1",
        "skills": [],
        "rootOrgAdmin": false,
        "userRoles": ["PUBLIC", "CONTENT_REVIEWER", "BOOK_REVIEWER"],
        "orgRoleMap": {
            "0130659746662727680": ["CONTENT_REVIEWER", "BOOK_REVIEWER", "PUBLIC"]
        },
        "organisationIds": ["0130659746662727680"],
        "hashTagIds": ["0130659746662727680"],
        "userRegData": {
            "User": {
                "lastName": "",
                "osUpdatedAt": "2020-07-17T07:54:47.713Z",
                "firstName": "lily10",
                "osCreatedAt": "2020-07-17T07:54:47.713Z",
                "enrolledDate": "2020-07-17T07:54:47.243Z",
                "@type": "User",
                "channel": "0130659746662727680",
                "osid": "c20f7a12-4b01-43d3-86ab-1335edbac50b",
                "userId": "1b0cd97d-e2b8-4bb8-8c19-7bf9a37b4a56"
            },
            "User_Org": {
                "osUpdatedAt": "2020-08-10T10:32:51.284Z",
                "osCreatedAt": "2020-08-10T10:32:51.284Z",
                "@type": "User_Org",
                "roles": ["user", "sourcing_reviewer"],
                "osid": "fd949c24-ab2c-4777-b575-98acb63e67bc",
                "userId": "c20f7a12-4b01-43d3-86ab-1335edbac50b",
                "orgId": "13495698-a117-460b-920c-41007923c764"
            },
            "Org": {
                "osUpdatedAt": "2020-08-12T13:00:28.145Z",
                "code": "VIDYANIKETHAN",
                "osCreatedAt": "2020-08-12T13:00:28.145Z",
                "createdBy": "470df59e-8bf2-40ac-a51d-c751b04ddbc2",
                "@type": "Org",
                "name": "Vidyanikethan",
                "description": "Vidyanikethan",
                "osid": "13495698-a117-460b-920c-41007923c764",
                "type": ["contribute", "sourcing"],
                "orgId": "0130659746662727680"
            }
        },
        "roleOrgMap": {
            "CONTENT_REVIEWER": ["0130659746662727680"],
            "BOOK_REVIEWER": ["0130659746662727680"],
            "PUBLIC": ["0130659746662727680"]
        }
    },

    individualContributorDetails : {
        "tncLatestVersion": "v1",
        "maskedPhone": "******4144",
        "rootOrgName": null,
        "roles": ["PUBLIC"],
        "channel": "custchannel",
        "stateValidated": false,
        "isDeleted": false,
        "organisations": [{
            "orgJoinDate": "2020-09-01 04:21:19:643+0000",
            "organisationId": "01285019302823526477",
            "orgName": "CustROOTOrg10",
            "isDeleted": false,
            "hashTagId": "01285019302823526477",
            "roles": ["PUBLIC"],
            "channel": "custchannel",
            "locationIds": [],
            "locations": [],
            "id": "013098470981632000186",
            "userId": "19ba0e4e-9285-4335-8dd0-f674bf03fa4d"
        }],
        "countryCode": "+91",
        "flagsValue": 1,
        "tncLatestVersionUrl": "https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html",
        "id": "19ba0e4e-9285-4335-8dd0-f674bf03fa4d",
        "email": "",
        "rootOrg": {
            "dateTime": null,
            "preferredLanguage": null,
            "keys": {},
            "channel": "custchannel",
            "approvedBy": null,
            "description": null,
            "updatedDate": null,
            "addressId": null,
            "orgType": null,
            "provider": "custchannel",
            "orgCode": null,
            "locationId": null,
            "theme": null,
            "id": "01285019302823526477",
            "isApproved": null,
            "communityId": null,
            "slug": "custchannel",
            "email": null,
            "identifier": "01285019302823526477",
            "thumbnail": null,
            "updatedBy": null,
            "orgName": "CustROOTOrg10",
            "address": {},
            "locationIds": [],
            "externalId": "custexternalid",
            "isRootOrg": true,
            "rootOrgId": "01285019302823526477",
            "imgUrl": null,
            "approvedDate": null,
            "orgTypeId": null,
            "homeUrl": null,
            "isDefault": null,
            "createdDate": "2019-09-16 09:40:27:984+0000",
            "parentOrgId": null,
            "createdBy": null,
            "hashTagId": "01285019302823526477",
            "noOfMembers": null,
            "status": 1
        },
        "identifier": "19ba0e4e-9285-4335-8dd0-f674bf03fa4d",
        "profileVisibility": {
            "lastName": "public",
            "webPages": "private",
            "jobProfile": "private",
            "address": "private",
            "education": "private",
            "gender": "private",
            "profileSummary": "public",
            "subject": "private",
            "language": "private",
            "avatar": "private",
            "userName": "public",
            "skills": "private",
            "firstName": "public",
            "badgeAssertions": "private",
            "phone": "private",
            "countryCode": "private",
            "dob": "private",
            "grade": "private",
            "location": "private",
            "email": "private"
        },
        "defaultProfileFieldVisibility": "private",
        "phoneVerified": true,
        "userLocations": [],
        "externalIds": [],
        "userName": "anusha_87mu",
        "roleList": [{
            "name": "Content Curation",
            "id": "CONTENT_CURATION"
        }, {
            "name": "Content Creator",
            "id": "CONTENT_CREATOR"
        }, {
            "name": "Official TextBook Badge Issuer",
            "id": "OFFICIAL_TEXTBOOK_BADGE_ISSUER"
        }, {
            "name": "Admin",
            "id": "ADMIN"
        }, {
            "name": "Course Mentor",
            "id": "COURSE_MENTOR"
        }, {
            "name": "Org Admin",
            "id": "ORG_ADMIN"
        }, {
            "name": "Content Review",
            "id": "CONTENT_REVIEW"
        }, {
            "name": "Flag Reviewer",
            "id": "FLAG_REVIEWER"
        }, {
            "name": "Announcement Sender",
            "id": "ANNOUNCEMENT_SENDER"
        }, {
            "name": "System Administration",
            "id": "SYSTEM_ADMINISTRATION"
        }, {
            "name": "Book Creator",
            "id": "BOOK_CREATOR"
        }, {
            "name": "Course Creator",
            "id": "COURSE_CREATOR"
        }, {
            "name": "Report Viewer",
            "id": "REPORT_VIEWER"
        }, {
            "name": "Flag Reviewer",
            "id": "FLAG_REVIEWER "
        }, {
            "name": "Membership Management",
            "id": "MEMBERSHIP_MANAGEMENT"
        }, {
            "name": "Content Creation",
            "id": "CONTENT_CREATION"
        }, {
            "name": "Book Reviewer",
            "id": "BOOK_REVIEWER"
        }, {
            "name": "Teacher Badge Issuer",
            "id": "TEACHER_BADGE_ISSUER"
        }, {
            "name": "Org Management",
            "id": "ORG_MANAGEMENT"
        }, {
            "name": "Course Admin",
            "id": "COURSE_ADMIN"
        }, {
            "name": "Org Moderator",
            "id": "ORG_MODERATOR"
        }, {
            "name": "Public",
            "id": "PUBLIC"
        }, {
            "name": "Content Reviewer",
            "id": "CONTENT_REVIEWER"
        }, {
            "name": "Report Admin",
            "id": "REPORT_ADMIN"
        }],
        "userId": "19ba0e4e-9285-4335-8dd0-f674bf03fa4d",
        "rootOrgId": "01285019302823526477",
        "promptTnC": true,
        "firstName": "anusha",
        "emailVerified": false,
        "createdDate": "2020-09-01 04:21:19:614+0000",
        "phone": "******4144",
        "userType": "OTHER",
        "status": 1,
        "skills": [],
        "rootOrgAdmin": false,
        "userRoles": ["PUBLIC"],
        "orgRoleMap": {
            "01285019302823526477": ["PUBLIC"]
        },
        "organisationIds": ["01285019302823526477"],
        "hashTagIds": ["01285019302823526477"],
        "userRegData": {
            "User": {
                "lastName": "",
                "osUpdatedAt": "2020-09-01T04:21:42.644Z",
                "firstName": "anusha",
                "osCreatedAt": "2020-09-01T04:21:42.644Z",
                "enrolledDate": "2020-09-01T04:21:40.531Z",
                "@type": "User",
                "channel": "01285019302823526477",
                "osid": "bcc23eec-5290-4ca2-8f3e-144a24f03b6d",
                "userId": "19ba0e4e-9285-4335-8dd0-f674bf03fa4d"
            }
        },
        "roleOrgMap": {
            "PUBLIC": ["01285019302823526477"]
        }
    },

    nominationDetails: {
		"id": 13165,
		"program_id": "14423170-ee78-11ea-a157-278232e1d499",
		"user_id": "149d152e-9192-4721-9e69-01e1e47f9b70",
		"organisation_id": "13495698-a117-460b-920c-41007923c764",
		"status": "Approved",
		"content_types": ["FocusSpot", "PedagogyFlow"],
		"collection_ids": ["do_11310065488551116811802", "do_11310065488553574411804"],
		"feedback": null,
		"rolemapping": {
			"CONTRIBUTOR": ["1b0cd97d-e2b8-4bb8-8c19-7bf9a37b4a56"],
			"REVIEWER": ["1b0cd97d-e2b8-4bb8-8c19-7bf9a37b4a56"]
		},
		"createdby": "470df59e-8bf2-40ac-a51d-c751b04ddbc2",
		"updatedby": "5a587cc1-e018-4859-a0a8-e842650b9d64",
		"createdon": "2020-09-04T07:02:01.962Z",
		"updatedon": "2020-09-08T07:33:09.350Z",
		"userData": {
			"lastName": "",
			"osUpdatedAt": "2020-07-17T07:54:46.573Z",
			"firstName": "lily1",
			"osCreatedAt": "2020-07-17T07:54:46.573Z",
			"enrolledDate": "2020-07-17T07:54:46.568Z",
			"@type": "User",
			"channel": "0130659746662727680",
			"osid": "470df59e-8bf2-40ac-a51d-c751b04ddbc2",
			"userId": "149d152e-9192-4721-9e69-01e1e47f9b70"
		},
		"orgData": {
			"osUpdatedAt": "2020-08-12T13:00:28.145Z",
			"code": "VIDYANIKETHAN",
			"osCreatedAt": "2020-08-12T13:00:28.145Z",
			"createdBy": "470df59e-8bf2-40ac-a51d-c751b04ddbc2",
			"@type": "Org",
			"name": "Vidyanikethan",
			"description": "Vidyanikethan",
			"osid": "13495698-a117-460b-920c-41007923c764",
			"type": ["contribute", "sourcing"],
			"orgId": "0130659746662727680"
		}
	}
};

