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


module.exports = (app) => {

  app.all('/workspace/content/content/v1/create',
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let urlParam = req.originalUrl.replace('/workspace/content/', '')
        console.log(urlParam)
        let query = require('url').parse(req.url).query
        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          return require('url').parse(learnerURL + urlParam).path
        }
      },
      userResDecorator: function (proxyRes, proxyResData, req, res) {
        try {
          logger.info({
            msg: '/workspace/content/content/v1/create called'
          });
          let data = JSON.parse(proxyResData.toString('utf8'))
          if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logger.error({
            msg: 'content api user res decorator json parse error:',
            proxyResData
          })
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))

  app.all('/workspace/content/lock/v1/create',
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let urlParam = req.originalUrl.replace('/workspace/content/', '')
        console.log(urlParam)
        let query = require('url').parse(req.url).query
        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          return require('url').parse(learnerURL + urlParam).path
        }
      },
      userResDecorator: function (proxyRes, proxyResData, req, res) {
        try {
          logger.info({
            msg: '/workspace/content/lock/v1/create called'
          });
          let data = JSON.parse(proxyResData.toString('utf8'))
          if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logger.error({
            msg: 'content api user res decorator json parse error:',
            proxyResData
          })
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))

  app.all('/workspace/*',
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
            logger.info({msg: '/workspace/* called'});
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch(err) {
          logger.error({msg:'workspace api user res decorator json parse error:', proxyResData})
            return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))
}

