const envHelper = require('./../helpers/environmentVariablesHelper.js')
const _ = require('lodash')
//var azure = require('azure-storage')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
//const blobService = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);
const logger = require('sb_logger_util_v2');

const validateSlug = (allowedFolders = []) => {
    return (req, res, next) => {
        console.log('session object in validate slug method', _.get(req, 'session'));
        logger.info({session: _.get(req, 'session')});
        console.log('validateSlug method called', { allowedFolders, sessionRootOrgDetails: _.get(req, 'session.rootOrg') || 'null', params: _.get(req, 'params') });
        if (_.includes([...allowedFolders, _.get(req, 'session.rootOrg.slug')], _.get(req, 'params.slug'))) {
            logger.info({ msg: 'validate slug passed' })
            next();
        } else {
            logger.error({ msg: 'validate slug failed', allowedFolders, sessionRootOrgDetails: _.get(req, 'session.rootOrg'), params: _.get(req, 'params') })
            const response = {
                responseCode: "FORBIDDEN",
                params: {
                    err: "FORBIDDEN",
                    status: "failed",
                    errmsg: "FORBIDDEN"
                },
                result: {}
            }
            res.status(403).send(apiResponse(response))
        }
    }
}

const validateRoles = (allowedRoles = []) => {
    return (req, res, next) => {
        const userRoles = _.get(req, 'session.roles');
        console.log('validateRoles method called', { sessionRoles: _.get(req, 'session.roles') || 'null', allowedRoles })
        if (_.intersection(userRoles, allowedRoles).length > 0) {
            logger.info({ msg: 'validate roles passed' })
            next();
        } else {
            logger.error({ msg: 'validate roles failed', sessionRoles: _.get(req, 'session.roles'), allowedRoles })
            const response = {
                responseCode: "FORBIDDEN",
                params: {
                    err: "FORBIDDEN",
                    status: "failed",
                    errmsg: "FORBIDDEN"
                },
                result: {}
            }
            res.status(403).send(apiResponse(response))
        }
    }
}

const apiResponse = ({ responseCode, result, params: { err, errmsg, status } }) => {
    return {
        'id': 'api.report',
        'ver': '1.0',
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'params': {
            'resmsgid': uuidv1(),
            'msgid': null,
            'status': status,
            'err': err,
            'errmsg': errmsg
        },
        'responseCode': responseCode,
        'result': result
    }
}

module.exports = {
    validateRoles,
    validateSlug
}
