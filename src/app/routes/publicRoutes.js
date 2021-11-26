const proxyHeaders = require('../proxy/proxyUtils.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const contentProxyUrl = envHelper.CONTENT_PROXY_URL
const learnerURL = envHelper.LEARNER_URL
const reqDataLimitOfContentUpload = '50mb'
const contentServiceBaseUrl = envHelper.CONTENT_URL
const logger = require('sb_logger_util_v2')
const isAPIWhitelisted = require('../helpers/apiWhiteList');

module.exports = function (app) {
    const proxyReqPathResolverMethod = function (req) {
      console.log(' proxyReqPathResolverMethod (/api/*) (req.originalUrl)', req.originalUrl);
        return require('url').parse(contentProxyUrl + req.originalUrl).path
    }

    app.post('/api/data/v1/page/*',
        permissionsHelper.checkPermission(),
        proxy(learnerURL, {
        proxyReqOptDecorator: proxyHeaders.decorateSunbirdRequestHeaders(),
        proxyReqPathResolver: function (req) {
            let urlParam = req.originalUrl.replace('/api/', '')
            let query = require('url').parse(req.url).query
            if (query) {
            return require('url').parse(learnerURL + urlParam + '?' + query).path
            } else {
            return require('url').parse(learnerURL + urlParam).path
            }
        },
        userResDecorator: function (proxyRes, proxyResData,  req, res) {
            try {
                logger.info({msg: '/api/data/v1/page'});
                const data = JSON.parse(proxyResData.toString('utf8'));
                if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch(err) {
                logger.error({msg:'content api user res decorator json parse error:', proxyResData})
                    return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
        })
    )

    app.post(['/api/org/v1/search'],
        isAPIWhitelisted.isAllowed(),
        permissionsHelper.checkPermission(),
        proxy(learnerURL, {
        limit: reqDataLimitOfContentUpload,
        proxyReqOptDecorator: proxyHeaders.decorateSunbirdRequestHeaders(),
        proxyReqPathResolver: function (req) {
            let urlParam = req.originalUrl.replace('/api/', '')
            let query = require('url').parse(req.url).query
            if (query) {
            return require('url').parse(learnerURL + urlParam + '?' + query).path
            } else {
            return require('url').parse(learnerURL + urlParam).path
            }
        },
        userResDecorator: function (proxyRes, proxyResData,  req, res) {
            try {
            logger.info({msg: '/api/org/v1/search'});
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch(err) {
            logger.error({msg:'content api user res decorator json parse error:', proxyResData})
                return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
        })
    )

    app.use(['/api/object/*', '/api/composite/*' ],
      permissionsHelper.checkPermission(),
      proxy(contentProxyUrl, {
        proxyReqOptDecorator: proxyHeaders.decorateSunbirdRequestHeaders(),
        proxyReqPathResolver: function (req) {
          let urlParam = req.originalUrl.replace('/api/', '')
          let query = require('url').parse(req.url).query
          console.log('/api/object  ', require('url').parse(contentProxyUrl + urlParam).path);
          console.log('/api/object/*,  /api/composite/* ', req.url);
          if (query) {
            return require('url').parse(contentProxyUrl + urlParam + '?' + query).path
          } else {
            return require('url').parse(contentProxyUrl + urlParam).path
          }
        },
        userResDecorator: (proxyRes, proxyResData, req, res) => {
          try {
            logger.info({msg: '/api/object'});
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
          } catch(err) {
            logger.error({msg:'content api user res decorator json parse error:', proxyResData})
                return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res);
          }
        }
    }))

    app.use(['/api/framework/*', '/api/channel/*'],
      permissionsHelper.checkPermission(),
      proxy(learnerURL, {
        proxyReqOptDecorator: proxyHeaders.decorateSunbirdRequestHeaders(),
        proxyReqPathResolver: function (req) {
          let urlParam = req.originalUrl.replace('/api/', '')
          let query = require('url').parse(req.url).query
          console.log('/api/framework  ', learnerURL, require('url').parse(learnerURL + urlParam).path);
          if (query) {
            return require('url').parse(learnerURL + urlParam + '?' + query).path
          } else {
            return require('url').parse(learnerURL + urlParam).path
          }
        },
        userResDecorator: (proxyRes, proxyResData, req, res) => {
          try {
            logger.info({msg: '/api/questionset'});
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
          } catch(err) {
            logger.error({msg:'content api user res decorator json parse error:', proxyResData})
                return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res);
          }
        }
    }))

    app.use(['/api/questionset/*', '/api/question/*' ],
        proxy(contentProxyUrl, {
        proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
        proxyReqPathResolver: function (req) {
            let urlParam = req.originalUrl.replace('/api/', '')
            let query = require('url').parse(req.url).query
            console.log('/api/questionset  ', require('url').parse(contentProxyUrl + urlParam).path);
            if (query) {
              return require('url').parse(contentProxyUrl + urlParam + '?' + query).path
            } else {
              return require('url').parse(contentProxyUrl + urlParam).path
            }
        },
        userResDecorator: function (proxyRes, proxyResData,  req, res) {
            try {
            logger.info({msg: '/api/questionset'});
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch(err) {
            logger.error({msg:'content api user res decorator json parse error:', proxyResData})
                return proxyHeaders.handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
        })
    )

    app.use('/api/*',
    isAPIWhitelisted.isAllowed(),
    permissionsHelper.checkPermission(),
    proxy(contentProxyUrl, {
        proxyReqPathResolver: proxyReqPathResolverMethod
    }))
}

