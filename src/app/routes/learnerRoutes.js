const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const healthService = require('../helpers/healthCheckService.js')
const logger = require('sb_logger_util_v2')
var morgan = require('morgan')
const {decrypt} = require('../helpers/crypto');
const {decodeNChkTime} = require('../helpers/utilityService');
const _ = require('lodash');
const logApiStatus = envHelper.dock_api_call_log_status
const isAPIWhitelisted = require('../helpers/apiWhiteList');

module.exports = function (app) {

  require('./accountRecoveryRoute.js')(app) // account recovery route

  // helper route to enable enable admin to update user fields
  app.patch('/learner/portal/user/v1/update',
    proxyUtils.verifyToken(),permissionsHelper.checkPermission(),
    proxy(envHelper.learner_Service_Local_BaseUrl, {
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: (req) => {
        return '/private/user/v1/update';
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
          logger.info({msg: '/learner/portal/user/v1/update called'});
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch(err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData});
            return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        }
      }
  }))

  app.get(['/learner/framework/v1/read/:frameworkId'],
    isAPIWhitelisted.isAllowed(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let urlParam =req.originalUrl.replace('/learner/', '')
        let query = require('url').parse(req.url).query
        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          return require('url').parse(learnerURL + urlParam).path
        }
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
            logger.info({msg: '/learner/framework/v1/read/:frameworkId called'});
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch(err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData})
            return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
  }))


  app.post('/learner/composite/v1/search',
    isAPIWhitelisted.isAllowed(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/learner/', '')
        return require('url').parse(learnerURL + originalUrl).path
      },
      userResDecorator: userResDecorator
    })
  )


  // Generate telemetry fot proxy service
  app.all('/learner/*', telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy)

  if(logApiStatus){
      app.use('/learner/*', morgan(function (tokens, req, res) {
          var message = '';
          if(tokens['response-time'](req, res) < '500'){
              message = 'below 500ms';
          } else if(tokens['response-time'](req, res) >= '500' && tokens['response-time'](req, res) < '1000') {
              message = 'below 1 sec';
          } else if(tokens['response-time'](req, res) >= '1000' && tokens['response-time'](req, res) < '2000') {
              message = 'below 2 sec';
          } else if(tokens['response-time'](req, res) >= '2000') {
              message = 'above 2 sec';
          }
          logger.info({msg: [
              tokens.method(req, res),
              tokens.url(req, res),
              tokens.status(req, res),
              tokens.res(req, res, 'content-length'), '-',
              tokens['response-time'](req, res), 'ms',
              message
              ].join(' ')});
      }))
  }

  app.all('/learner/data/v1/role/read',
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let urlParam = req.originalUrl.replace('/learner/', '')
        let query = require('url').parse(req.url).query
        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          return require('url').parse(learnerURL + urlParam).path
        }
      },
      userResDecorator: function (proxyRes, proxyResData,  req, res) {
        try {
          logger.info({msg: '/learner/data/v1/role/read called'});
          let data = JSON.parse(proxyResData.toString('utf8'))
          if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData})
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))

  app.all('/learner/user/v1/get/phone/*',
    permissionsHelper.checkPermission(),
    proxyObj()
  )

  app.all('/learner/user/v1/get/email/*',
    permissionsHelper.checkPermission(),
    proxyObj()
  )

  app.all('/learner/user/v1/signup',
    healthService.checkDependantServiceHealth(['LEARNER', 'CASSANDRA']),
    permissionsHelper.checkPermission(),
    checkForValidUser()
  )

  app.all('/learner/*',
    healthService.checkDependantServiceHealth(['LEARNER', 'CASSANDRA']),
    isAPIWhitelisted.isAllowed(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let urlParam = req.params['0']
        let query = require('url').parse(req.url).query
        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          return require('url').parse(learnerURL + urlParam).path
        }
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
            logger.info({msg: '/learner/* called'});
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch(err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData})
            return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))
}

function checkForValidUser (){
  return proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      var data = JSON.parse(bodyContent.toString('utf8'));
      var reqEmail = data.request['email'];
      var reqPhone = data.request['phone'];
      var reqValidator = data.request['reqData'];
      var decodedValidator = decodeNChkTime(reqValidator);
      if((decodedValidator['key']) && (reqEmail === decodedValidator['key'] || reqPhone === decodedValidator['key'])){
        data = _.omit(data, 'request.reqData');
        return data;
      } else{
        throw new Error('USER_CANNOTBE_CREATED');
      }
    },
    proxyReqPathResolver: function (req) {
      return require('url').parse(envHelper.LEARNER_URL + req.originalUrl.replace('/learner/', '')).path
    },
    userResDecorator: function (proxyRes, proxyResData,  req, res) {
      try {
        logger.info({msg: 'proxyObj'});
        let data = JSON.parse(proxyResData.toString('utf8'));
        let response = data.result.response;
        data.result.response = {id: '', rootOrgId: '',isUserExists:''};
        if (data.responseCode === 'OK') {
          data.result.response.id = response.id;
          data.result.response.rootOrgId = response.rootOrgId;
          data.result.response.isUserExists = true;
        }
        if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
        else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
      } catch (err) {
        logger.error({msg:'content api user res decorator json parse error:', proxyResData})
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  });
}

function proxyObj (){
  return proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl.replace('/learner/', '')
      let query = require('url').parse(req.url).query
      if (query) {
        logger.info({msg: 'urlParam if '+ require('url').parse(learnerURL + urlParam + '?' + query).path});
        return require('url').parse(learnerURL + urlParam + '?' + query).path
      } else {
        logger.info({msg: 'urlParam else '+ learnerURL + urlParam});
        return require('url').parse(learnerURL + urlParam).path
      }
    },
    userResDecorator: function (proxyRes, proxyResData,  req, res) {
      try {
        logger.info({msg: 'proxyObj'});
        let data = JSON.parse(proxyResData.toString('utf8'));
        let response = data.result.response;
        data.result.response = {id: '', rootOrgId: '',isUserExists:''};
        if (data.responseCode === 'OK') {
          data.result.response.id = response.id;
          data.result.response.rootOrgId = response.rootOrgId;
          data.result.response.isUserExists = true;
        }
        if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
        else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
      } catch (err) {
        logger.error({msg:'content api user res decorator json parse error:', proxyResData})
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  });
}

const userResDecorator = (proxyRes, proxyResData, req, res) => {
  try {
      const data = JSON.parse(proxyResData.toString('utf8'));
      if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
      else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
  } catch(err) {
      console.log('learner api user res decorator json parse error', proxyResData);
      return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
  }
}
