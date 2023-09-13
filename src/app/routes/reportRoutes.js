const proxyUtils = require('../proxy/proxyUtils.js')
const reportHelper = require('../helpers/reportHelper.js')
const StorageService = require('../helpers/cloudStorage/index');

module.exports = function (app) {
  app.get('/reports/:reportPrefix?/:slug/:filename',
  proxyUtils.verifyToken(),
  reportHelper.validateSlug(['public']),
  reportHelper.validateRoles(['ORG_ADMIN', 'REPORT_VIEWER']),
  (req, res, next) => {
    if(req.params.reportPrefix) {
      req.params.slug = req.params.reportPrefix + '/' + req.params.slug;
    }
    console.log("req.params ", req.params)
    next()
  },
  StorageService.CLOUD_CLIENT.fileReadStream());
}
