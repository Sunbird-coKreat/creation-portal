const _ = require('lodash');
const bodyParser = require('body-parser')
const envHelper = require('./../helpers/environmentVariablesHelper.js')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const proxy = require('express-http-proxy')
const proxyUtils = require('../proxy/proxyUtils.js')
const logger = require('sb_logger_util_v2');
const {encrypt, encriptWithTime} = require('../helpers/crypto');


module.exports = (app) => {

  app.post('/learner/user/v1/fuzzy/search', proxy(envHelper.SUNBIRD_LEARNER_URL, {
    proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
<<<<<<< HEAD
    proxyReqPathResolver: (req) => {
      logger.info({msg: '/learner/user/v1/fuzzy/search called'});
      return envHelper.SUNBIRD_LEARNER_URL + 'private/user/v1/search';
      // return require('url').parse(envHelper.SUNBIRD_LEARNER_URL.replace('/api/', '')+ req.originalUrl).path
    }
=======
      proxyReqPathResolver: (req) => {
      logger.info({msg: '/learner/user/v1/fuzzy/search called'});
      return envHelper.SUNBIRD_LEARNER_URL + 'private/user/v1/search';
       // return require('url').parse(envHelper.SUNBIRD_LEARNER_URL.replace('/api/', '')+ req.originalUrl).path
     }
>>>>>>> 65a09842cb11dff04455a468fe9bed179d398622
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
              const encrypt = {
                key: req.body.request.key
              }
              if (req.body.request.userId) {
                encrypt['id'] = req.body.request.userId
              }
              var timeInMin = 5;
              var validator = encriptWithTime(encrypt, timeInMin);
              data['reqData'] = validator;
            }
            return data;
        } catch(err) {
          logger.error({
            body: JSON.stringify(req.body),
            msg: 'otp verification failed',
            error: JSON.stringify(err)
          });
          return proxyResData;
        }
      }
  }));

}
