const proxyUtils = require('../proxy/proxyUtils.js')
const reportHelper = require('../helpers/reportHelper.js')
const StorageService = require('../helpers/cloudStorage/index');

module.exports = function (app) {

    app.get('/courseReports/:slug/:filename',
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['CONTENT_CREATOR']),
        StorageService.CLOUD_CLIENT.fileReadStream());

    app.get('/reports/:reportPrefix?/:slug/:filename',
        proxyUtils.verifyToken(),
        reportHelper.validateSlug(['public']),
        reportHelper.validateRoles(['ORG_ADMIN', 'REPORT_VIEWER']),
        (req, res, next) => {
          req.params.slug = req.params.reportPrefix + '/' + req.params.slug;
          console.log("req.params ", req.params)
          next()
        },
        StorageService.CLOUD_CLIENT.fileReadStream());

    app.get('/admin-reports/:slug/:filename',
        proxyUtils.verifyToken(),
        reportHelper.validateSlug(['geo-summary', 'geo-detail', 'geo-summary-district', 'user-summary', 'user-detail',
            'validated-user-summary', 'validated-user-summary-district', 'validate-user-detail']),
        reportHelper.validateRoles(['ORG_ADMIN']),
        StorageService.CLOUD_CLIENT.fileReadStream());
}
