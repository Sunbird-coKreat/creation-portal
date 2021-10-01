/**
 * @file - Responsible for generating and accessing user kong token
 * @since release-4.3.0
 * @version 1.0
 */
'use strict';
const _                                     = require('lodash');
const { logger }                            = require('@project-sunbird/logger');
const { sendRequest }                       = require('./httpRequestHandler');
const KONG_LOGGEDIN_DEVICE_REGISTER_TOKEN   = require('./environmentVariablesHelper.js').SUNBIRD_PORTAL_API_AUTH_TOKEN;
const KONG_REFRESH_TOKEN_API                = require('./environmentVariablesHelper.js').sunbird_kong_refresh_token_api;
const KONG_ACCESS_TOKEN                     = 'userAccessToken';

/**
 * @param  { Object } req     - API Request object
 * @param  { String } message - Log message
 */
const _log = (req, message) => {
  logger.info({
    msg: message,
    route: _.get(req, 'path') || 'no_route',
    originalUrl: _.get(req, 'originalUrl') || 'no_originalUrl',
    baseUrl: _.get(req, 'baseUrl') || 'no_baseUrl',
    sessionId: _.get(req, 'sessionID')
  });
};

/**
 * @param  { Object } req - API Request object
 * @param  { Callback } next - Request callback
 * @description getKongAccessToken
 * 1. Generate x-auth-token for user
 */
const getKongAccessToken = (req, cb) => {
  try {
    _log(req, 'KONG_TOKEN refresh_token:: requesting kong auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]');
    const keycloakObj = JSON.parse(_.get(req, 'session.keycloak-token'));
    // Use default token in case of VDN; as there is no anonymous session workflow for VDN
    const _bearerKey = KONG_LOGGEDIN_DEVICE_REGISTER_TOKEN;
    var options = {
      method: 'POST',
      url: KONG_REFRESH_TOKEN_API,
      headers: {
        'Authorization': 'Bearer ' + _bearerKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        refresh_token: keycloakObj['refresh_token']
      }
    };
    sendRequest(options).then((response) => {
      const responseData = JSON.parse(response);
      if (_.get(responseData, 'params.status') === 'successful') {
        _log(req, 'KONG_TOKEN refresh_token :: Successfully generated kong refresh auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]');
        req.session.cookie.maxAge = _.get(responseData.result, 'expires_in') * 1000;
        req.session.cookie.expires = new Date(Date.now() +  (_.get(responseData.result, 'expires_in') * 1000));
        req.session[KONG_ACCESS_TOKEN] = _.get(responseData, 'result.access_token');
        req.session.save(function (error) {
          if (error) {
            cb(error, null)
          } else {
            cb();
          }
        });
      } else {
        _log(req, 'KONG_TOKEN refresh_token :: Failed to generate kong auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]');
        cb(true);
      }
    }).catch((error) => {
      _log(req, 'KONG_TOKEN refresh_token :: API Failed to generate kong auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]. Error => ' + error);
      cb(error);
    });
  } catch (error) {
    _log(req, 'KONG_TOKEN refresh_token :: Method failed to generate kong auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]. Error => ' + error);
    cb(error);
  }
};

module.exports = {
  getKongAccessToken,
};
