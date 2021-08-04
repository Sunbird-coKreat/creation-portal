export const mockData = {
    alluserRes: {
        id: 'api.user.search',
        ver: 'v1',
        ts: '2021-07-05 03:18:29:598+0000',
        params: {
            resmsgid: null,
            msgid: '25b02fd5a7c6890adfd81ecc63da36c2',
            err: null,
            status: 'success',
            errmsg: null
        },
        responseCode: 'OK',
        result: {
            response: {
                count: 1,
                content: [
                    {
                        lastName: null,
                        identifier: '5a587cc1-e018-4859-a0a8-e842650b9d64',
                        firstName: 'N11',
                        rootOrgName: 'NIT',
                        organisations: [
                            {
                                organisationId: '01309282781705830427',
                                updatedBy: null,
                                orgName: 'NIT',
                                addedByName: null,
                                addedBy: null,
                                associationType: 1,
                                roles: [],
                                approvedBy: null,
                                updatedDate: '2021-01-12 10:45:53:408+0000',
                                userId: '5a587cc1-e018-4859-a0a8-e842650b9d64',
                                approvaldate: null,
                                isDeleted: false,
                                hashTagId: '01309282781705830427',
                                isRejected: false,
                                id: '01309283239830323228',
                                position: null,
                                isApproved: false,
                                orgjoindate: '2020-08-24 05:13:18:274+0000',
                                orgLeftDate: null
                            }
                        ],
                        phone: '',
                        roles: [],
                        email: 'n1*@yopmail.com'
                    }
                ]
            }
        }
    },
    userErrorRes: {
        id: 'api.error',
        ver: '1.0',
        ts: '2021-07-05 03:57:14:915+0000',
        params: {
            resmsgid: '158fce40-dd45-11eb-adbf-81ddba34dfdd',
            msgid: null,
            status: 'failed',
            err: 'FORBIDDEN_ERROR',
            errmsg: 'Forbidden: API WHITELIST Access is denied'
        },
        responseCode: 'FORBIDDEN',
        result: {}
    },
    allCollaboratorSuccess: {
        ts: '2021-07-05 03:18:29:598+0000',
        params: {
            resmsgid: null,
            msgid: '25b02fd5a7c6890adfd81ecc63da36c2',
            err: null,
            status: 'successful',
            errmsg: null
        }
    }
};