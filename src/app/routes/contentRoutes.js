const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const contentURL = envHelper.CONTENT_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const healthService = require('../helpers/healthCheckService.js')
const _ = require('lodash')
const logger = require('sb_logger_util_v2')
var morgan = require('morgan')
const logApiStatus = envHelper.dock_api_call_log_status
const programServiceUrl = envHelper.DOCK_PROGRAM_SERVICE_URL
const isAPIWhitelisted = require('../helpers/apiWhiteList');

module.exports = (app) => {
  // Generate telemetry fot proxy service
    app.all('/content/*', telemetryHelper.generateTelemetryForContentService,
        telemetryHelper.generateTelemetryForProxy)

    if(logApiStatus){
        app.use('/content/*', morgan(function (tokens, req, res) {
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

    app.all('/content/course/v1/search',
        healthService.checkDependantServiceHealth(['CONTENT', 'CASSANDRA']),
        permissionsHelper.checkPermission(),
        proxy(contentURL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
            proxyReqPathResolver: (req) => {
                return require('url').parse(contentURL + req.originalUrl.replace('/content/', '')).path
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    logger.info({msg: '/content/course/v1/search called'});
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
                } catch (err) {
                    logger.error({msg: 'content api user res decorator json parse error', proxyResData});
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
                }
            }
        }))

    app.get('/content/program/v1/print/pdf',
        permissionsHelper.checkPermission(),
        proxyUtils.verifyToken(),
        proxy(programServiceUrl, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
            proxyReqPathResolver: (req) => {
              var originalUrl = req.originalUrl
              originalUrl = originalUrl.replace('/content/', '')
              const URl = require('url').parse(programServiceUrl + originalUrl).path.replace('//', '/');
              return URl
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    logger.info({msg: '/content/program/v1/print/pdf called'});
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
                } catch (err) {
                    logger.error({msg: 'content api user res decorator json parse error', proxyResData});
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
                }
            }
        })
    )

    app.post('/content/program/v1/configuration/search',
        isAPIWhitelisted.isAllowed(),
        permissionsHelper.checkPermission(),
        proxy(contentURL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
            proxyReqPathResolver: function (req) {
                let originalUrl = req.originalUrl.replace('/content/', '')
                return require('url').parse(contentURL + originalUrl).path
        },
        userResDecorator: userResDecorator
        })
    )

    app.all('/content/program/*',
        isAPIWhitelisted.isAllowed(),
        permissionsHelper.checkPermission(),
        proxy(contentURL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
            proxyReqPathResolver: (req) => {
                return require('url').parse(contentURL + req.originalUrl.replace('/content/', '')).path
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    logger.info({msg: '/content/program called'});
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
                } catch (err) {
                    logger.error({msg: 'content api user res decorator json parse error', proxyResData});
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
                }
            }
        })
    )

    app.all('/content/reg/*',
        isAPIWhitelisted.isAllowed(),
        permissionsHelper.checkPermission(),
        proxy(contentURL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
            proxyReqPathResolver: (req) => {
                return require('url').parse(contentURL + req.originalUrl.replace('/content/', '')).path
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    logger.info({msg: '/content/reg called'});
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
                } catch (err) {
                    logger.error({msg: 'content api user res decorator json parse error', proxyResData});
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
                }
            }
        })
    )

    app.all('/content/*',
        healthService.checkDependantServiceHealth(['CONTENT', 'CASSANDRA']),
        isAPIWhitelisted.isAllowed(),
        proxyUtils.verifyToken(),
        permissionsHelper.checkPermission(),
        proxy(contentURL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
            proxyReqPathResolver: (req) => {
                let urlParam = req.params['0']
                let query = require('url').parse(req.url).query
                if (query) {
                    return require('url').parse(contentURL + urlParam + '?' + query).path
                } else {
                    return require('url').parse(contentURL + urlParam).path
                }
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    logger.info({msg: '/content/* called'});
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
                } catch (err) {
                    logger.error({msg: 'content api user res decorator json parse error', proxyResData});
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
                }
            }
        })
    )
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
