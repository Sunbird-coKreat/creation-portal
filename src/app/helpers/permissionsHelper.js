const request = require('request')
const _ = require('lodash')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const envHelper = require('./environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const openSaberServiceUrl = envHelper.OPENSABER_SERVICE_URL
const enablePermissionCheck = envHelper.ENABLE_PERMISSION_CHECK
const apiAuthToken = envHelper.SUNBIRD_PORTAL_API_AUTH_TOKEN
const telemetryHelper = require('./telemetryHelper')
const logger = require('sb_logger_util_v2');
const { getAuthToken } = require('../helpers/kongTokenHelper')

let PERMISSIONS_HELPER = {
  ROLES_URLS: {
    'course/create': ['CONTENT_CREATOR', 'CONTENT_CREATION', 'CONTENT_REVIEWER'],
    'course/update': ['CONTENT_CREATOR', 'CONTENT_CREATION', 'CONTENT_REVIEWER'],
    'course/review': ['CONTENT_CREATOR', 'CONTENT_CREATION', 'CONTENT_REVIEWER', 'CONTENT_REVIEW'],
    'course/publish': ['CONTENT_REVIEWER', 'CONTENT_REVIEW'],
    'content/retire': ['CONTENT_REVIEWER', 'CONTENT_REVIEW', 'FLAG_REVIEWER'],
    'content/reject': ['CONTENT_REVIEWER', 'CONTENT_REVIEW'],
    'content/create': ['CONTENT_CREATOR', 'CONTENT_CREATION', 'CONTENT_REVIEWER', 'BOOK_CREATOR'],
    'content/update': ['CONTENT_CREATOR', 'CONTENT_CREATION', 'CONTENT_REVIEWER', 'BOOK_CREATOR'],
    'content/review': ['CONTENT_CREATOR', 'CONTENT_CREATION', 'CONTENT_REVIEWER', 'CONTENT_REVIEW',
      'BOOK_CREATOR', 'BOOK_REVIEWER', 'FLAG_REVIEWER'],
    'content/publish': ['CONTENT_REVIEWER', 'CONTENT_REVIEW'],
    'content/flag/accept': ['FLAG_REVIEWER'],
    'content/flag/reject': ['FLAG_REVIEWER'],
    'organisation/update': ['ADMIN', 'ORG_MANAGEMENT'],
    'user/create': ['ADMIN',
      'ORG_MANAGEMENT',
      'ORG_ADMIN',
      'MEMBERSHIP_MANAGEMENT',
      'ORG_MODERATOR'
    ],
    'user/upload': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'],
    'user/assign/role': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'],
    'user/block': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'],
    'dashboard/creation': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'],
    'dashboard/progress': ['COURSE_MENTOR'],
    'dashboard/consumption': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION', 'CONTENT_CREATOR'],
    'org/upload': ['SYSTEM_ADMINISTRATION'],
    'upload/status/': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'],
    'type/create': ['SYSTEM_ADMINISTRATION'],
    'type/update': ['SYSTEM_ADMINISTRATION'],
    'portal/user/v1/update': ['ORG_ADMIN']
  },

  getPermissions: function (reqObj) {
    var options = {
      method: 'GET',
      url: learnerURL + 'data/v1/role/read',
      headers: {
        'x-device-id': 'middleware',
        'x-msgid': uuidv1(),
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + apiAuthToken
      },
      json: true
    }
    const telemetryData = {reqObj: reqObj,
      options: options,
      uri: 'data/v1/role/read',
      userId: reqObj.session.userId}
    // telemetryHelper.logAPICallEvent(telemetryData)

    request(options, function (error, response, body) {
      telemetryData.statusCode = _.get(response, 'statusCode')
      if (!error && body && body.responseCode === 'OK') {
        // module.exports.setRoleUrls(body.result)
      } else {
        telemetryData.resp = body
        telemetryHelper.logAPIErrorEvent(telemetryData)
      }
    })
  },
  setRoleUrls: function (roleData) {
    var roles = _.cloneDeep(roleData.roles)
    _.forEach(roles, function (role) {
      var roles = [role.id]
      _.forEach(role.actionGroups, function (actionGroup) {
        roles.push(actionGroup.id)
        _.forEach(actionGroup.actions, function (action) {
          _.forEach(action.urls, function (url) {
            module.exports.ROLES_URLS[url] = module.exports.ROLES_URLS[url] || []
            module.exports.ROLES_URLS[url] = _.union(module.exports.ROLES_URLS[url], roles)
          })
        })
      })
    })
  },

  setUserSessionData (reqObj, body) {
    try {
      if (body.responseCode === 'OK') {
        reqObj.session.userId = body.result.response.identifier
        reqObj.session.roles = _.map(body.result.response.roles, (e) => e.role);
        if (body.result.response.organisations) {
          _.forEach(body.result.response.organisations, function (org) {
            if (org.roles && _.isArray(org.roles)) {
              reqObj.session.roles = _.union(reqObj.session.roles, org.roles)
            }
            if (org.organisationId) {
              reqObj.session.orgs.push(org.organisationId)
            }
          })
        }
        reqObj.session.orgs = _.uniq(reqObj.session.orgs);
        reqObj.session.orgs = _.compact(reqObj.session.orgs);
        reqObj.session.roles = _.uniq(reqObj.session.roles)
        if (body.result.response.rootOrg && body.result.response.rootOrg.id) {
          reqObj.session.rootOrgId = body.result.response.rootOrg.id
          reqObj.session.rootOrghashTagId = body.result.response.rootOrg.hashTagId
          reqObj.session.rootOrg = body.result.response.rootOrg
        }
        if (!_.includes(reqObj.session.roles, 'PUBLIC')) {
          reqObj.session.roles.push('PUBLIC');
        }
      }
    } catch (e) {
      logger.error({msg: 'error while saving user session data', err: e})
      console.log(e)
    }
  },

  getCurrentUserRoles: function (reqObj, callback) {
    var userId = reqObj.session.userId
    var options = {
      method: 'GET',
      url: learnerURL + 'user/v5/read/' + userId,
      headers: {
        'x-msgid': uuidv1(),
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': 'Bearer ' + apiAuthToken
      },
      json: true
    }

    let xAuthUserToken = getAuthToken(reqObj);
    if (xAuthUserToken) {
      options.headers['x-authenticated-user-token'] = xAuthUserToken
    }

    const telemetryData = {reqObj: reqObj,
      options: options,
      uri: 'user/v5/read',
      type: 'user',
      id: userId,
      userId: userId}
    // telemetryHelper.logAPICallEvent(telemetryData)

    request(options, function (error, response, body) {
      logger.info({msg: 'user/v5/read api response', error, requestOptions: options});
      telemetryData.statusCode = _.get(response, 'statusCode');
      reqObj.session.roles = [];
      reqObj.session.orgs = [];
      if (error) {
        logger.error({msg: 'error while user/v5/read', error});
        callback(error, null)
      } else if (!error && body) {
        module.exports.setUserSessionData(reqObj, body);
        logger.info({msg: 'getCurrentUserRoles session obj', session: reqObj.session});
        reqObj.session.save(function (error) {
          if (error) {
            callback(error, null)
          } else {
            callback(null, body)
          }
        });
      } else {
        logger.error({msg: 'error while user/v5/read', error});
        callback(error, null)
      }
    })
  },

  getRequest: function(option) {
      return new Promise(function (success, failure) {
        request(option, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  success(body);
              } else {
                  failure(error);
              }
          });
      });
  },

  getSourcingUserRoles: function(reqObj, callback) {
    const userRegData = {};
    var userId = reqObj.session.userId
    const option = {
      url: `${openSaberServiceUrl}/search`,
      headers: {
        'x-msgid': uuidv1(),
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': 'Bearer ' + apiAuthToken,
        'x-authenticated-user-token': reqObj.kauth.grant.access_token.token
      },
      method: 'POST',
      json: true,
      body: { id: 'open-saber.registry.search', ver: '1.0', ets: '11234', params: { did: '', key: '', msgid: '' } }
    };

    option.body['request'] = { entityType: ['User'], filters: { userId: {eq: userId} } };

    module.exports.getRequest(option)
      .then(function (userSearchResponse) {
        const User = _.get(userSearchResponse, 'result.User');
        if (!_.isEmpty(User) && User.length) {
          userRegData['User'] = User[0];
          option.body['request'] = {
            entityType: ['User_Org'],
            filters: {
              userId: {eq: User[0].osid}
            }
          };
          return module.exports.getRequest(option);
        }
        else {
          return null;
        }
      }).then((userOrgSearchResponse) => {
        if (userOrgSearchResponse && userOrgSearchResponse.result.User_Org.length) {
          const userOrg = _.find(userOrgSearchResponse.result.User_Org, function(o) { return o.roles.includes('user') || o.roles.includes('admin') });
          if (userOrg) {
            userRegData['User_Org'] = userOrg;
            const orgOsid = userOrg.orgId;
            option.body['request'] = {
              entityType: ['Org'],
              filters: {
                osid: {or: [orgOsid]}
              }
            };
            return module.exports.getRequest(option)
          } else {
            return null
          }
        } else {
          return null
        }
      }).then(orgSearchResponse => {
        if (orgSearchResponse && orgSearchResponse.result.Org.length) {
          userRegData['Org'] = orgSearchResponse.result.Org[0];
        }
        module.exports.setSourcingUserSessionData(reqObj, userRegData, callback)
        logger.info({msg: 'getSourcingUserRoles registry obj', userRegData: userRegData});
      }).catch(error => {
        console.log(error)
        callback(error, null)
      })
  },

  setSourcingUserSessionData (reqObj, userRegData, callback) {
    try {
      const userLevelKeys = _.keys(userRegData);
      const isOrgCreated = (_.has(userRegData, 'User_Org') && _.has(userRegData, 'Org'))
      if(userLevelKeys.length === 1 && _.first(userLevelKeys, 'User')) {
        reqObj.session.roles.push('INDIVIDUAL_USER')
      } else if (isOrgCreated && _.includes(_.get(userRegData, 'User_Org.roles'), 'admin') && _.includes(reqObj.session.roles, 'ORG_ADMIN')) {
        reqObj.session.roles.push('CONTRIBUTE_ORG_ADMIN')
      } else if (isOrgCreated && _.includes(_.get(userRegData, 'User_Org.roles'), 'admin') && !_.includes(reqObj.session.roles, 'ORG_ADMIN')) {
        reqObj.session.roles.push('CONTRIBUTE_ORG_ADMIN')
      } else if(isOrgCreated && _.includes(userRegData['Org'].type, 'sourcing')) {
        reqObj.session.roles.push('SOURCING_USER')
      } else if(isOrgCreated &&
        (_.includes(userRegData['Org'].type, 'contribute') && !_.includes(userRegData['Org'].type, 'sourcing')) ||
        !_.get(userRegData, 'Org.type')
        ) {
          reqObj.session.roles.push('CONTRIBUTE_ORG_USER')
      }
      reqObj.session.save(function (error) {
        if (error) {
          callback(error, null)
        } else {
          callback(null, userRegData)
        }
      });
      } catch(error) {
        logger.error({msg: 'setSourcingUserSessionData :: Error while saving user session data', err: error});
        callback(error, null)
    }
  },

  checkPermission: function () {
    return function (req, res, next) {
      if (enablePermissionCheck && req.session['roles'] && req.session['roles'].length) {
        var roles = module.exports.checkURLMatch(req.originalUrl)
        if (_.isArray(roles)) {
          if (_.intersection(roles, req.session['roles']).length > 0) {
            next()
          } else {
            res.status(401)
            res.send({
              'id': 'api.error',
              'ver': '1.0',
              'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
              'params': {
                'resmsgid': uuidv1(),
                'msgid': null,
                'status': 'failed',
                'err': 'UNAUTHORIZED_ERROR',
                'errmsg': 'Unauthorized: Access is denied'
              },
              'responseCode': 'UNAUTHORIZED',
              'result': {}
            })
            res.end()
          }
        } else {
          next()
        }
      } else {
        next()
      }
    }
  },
  checkURLMatch: function (url) {
    var roles = []
    _.forEach(module.exports.ROLES_URLS, function (value, key) {
      if (url.indexOf(key) > -1) {
        roles = value
        return false
      }
    })
    if (roles.length) {
      return roles
    }
    return false
  }
}
module.exports = PERMISSIONS_HELPER
