const _ = require('lodash');
const bodyParser = require('body-parser')
const envHelper = require('./../helpers/environmentVariablesHelper.js')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const proxy = require('express-http-proxy')
const proxyUtils = require('../proxy/proxyUtils.js')
const logger = require('sb_logger_util_v2');
const {encrypt} = require('../helpers/crypto');

module.exports = (app) => {

  app.post('/learner/user/v1/fuzzy/search', proxy(envHelper.SUNBIRD_PORTAL_URL, {
    proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
    proxyReqPathResolver: (req) => {
      logger.info({msg: '/learner/user/v1/fuzzy/search called'});
      return require('url').parse(envHelper.SUNBIRD_PORTAL_URL.replace('/api/', '')+ req.originalUrl).path
    }
  }))

  app.post('/learner/user/v1/password/reset', bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }), 
    proxy(envHelper.LEARNER_URL, {
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: (req) => {
        logger.info({msg: '/learner/user/v1/password/reset called'});
        return envHelper.LEARNER_URL + 'private/user/v1/password/reset'
        // return require('url').parse(envHelper.LEARNER_URL.replace('/api/', '')+ req.originalUrl).path
      }
  }))

  app.all('/learner/otp/v1/verify',
    bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }), 
    proxy(envHelper.LEARNER_URL, {
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: (req) => {
        return require('url').parse(envHelper.LEARNER_URL + req.originalUrl.replace('/learner/', '')).path
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        logger.info({msg: '/learner/otp/v1/verify called'});
        try {
            const data = JSON.parse(proxyResData.toString('utf8'));
            if (data.responseCode === 'OK') {
              req.session.otpVerifiedFor = req.body;
              var validator = getEncyptedQueryParams({'key':req.body.request.key});
              data['validator'] = validator;
            }
            return proxyResData;
        } catch(err) {
          logger.error({
            body: JSON.stringify(req.body),
            resp: JSON.stringify(data),
            msg: 'otp verification failed',
            error: JSON.stringify(err)
          });
          return proxyResData;
        }
      }
  }));
  /**
 * To generate session for state user logins
 * using server's time as iat and exp time as 5 min
 * Session will not be created if exp is expired
 * @param data object to encrypt data
 * @returns {string}
 */
const getEncyptedQueryParams = (data) => {
  data.exp = Date.now() + (5 * 60 * 1000);  // adding 5 minutes
  return JSON.stringify(encrypt(JSON.stringify(data)));
};

}
