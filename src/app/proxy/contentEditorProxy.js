const proxyUtils = require("./proxyUtils.js");
const proxy = require("express-http-proxy");
const bodyParser = require("body-parser");
const permissionsHelper = require("./../helpers/permissionsHelper.js");
const envHelper = require("./../helpers/environmentVariablesHelper.js");
const contentProxyUrl = envHelper.CONTENT_PROXY_URL;
const learnerServiceBaseUrl = envHelper.LEARNER_URL;
const learner_Service_Local_BaseUrl = envHelper.learner_Service_Local_BaseUrl;
const contentServiceBaseUrl = envHelper.CONTENT_URL;
const reqDataLimitOfContentUpload = "30mb";
const telemetryHelper = require("../helpers/telemetryHelper");
const learnerURL = envHelper.LEARNER_URL;
const kp_content_service_base_url = envHelper.kp_content_service_base_url;
const kp_learning_service_base_url = envHelper.kp_learning_service_base_url;
const kp_assessment_service_base_url = envHelper.kp_assessment_service_base_url;
const localDev = envHelper.LOCAL_DEVELOPMENT;

module.exports = function (app) {
  const proxyReqPathResolverMethod = function (req) {
    return require("url").parse(contentProxyUrl + req.originalUrl).path;
  };
  app.use(
    "/plugins/v1/search",
    proxy(contentServiceBaseUrl, {
      preserveHostHdr: true,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/", "");
        return require("url").parse(contentServiceBaseUrl + originalUrl).path;
      },
    })
  );

  app.use(
    "/content-plugins/*",
    proxy(contentProxyUrl, {
      preserveHostHdr: true,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: proxyReqPathResolverMethod,
    })
  );

  app.use(
    "/plugins/*",
    proxy(contentProxyUrl, {
      preserveHostHdr: true,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: proxyReqPathResolverMethod,
    })
  );

  app.use(
    "/assets/public/*",
    proxy(contentProxyUrl, {
      preserveHostHdr: true,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: proxyReqPathResolverMethod,
    })
  );

  app.use(
    "/content/preview/*",
    proxy(contentProxyUrl, {
      preserveHostHdr: true,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: proxyReqPathResolverMethod,
    })
  );

  // Log telemetry for action api's
  app.all("/action/*", telemetryHelper.generateTelemetryForProxy);

  const contentURL = envHelper.CONTENT_URL;
  app.use(
    [
      "/action/questionset/v1/read/*",
      "/action/question/v1/read/*",
      '/action/question/v1/retire/*',
      "/action/questionset/v1/hierarchy/*",
      "/action/questionset/v1/retire/*",
      "/action/question/v1/list",
      "/action/questionset/v1/copy/*",
    ],
    proxy(contentURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        console.log(
          "learnerURLss ",
          contentURL,
          "  ===  ",
          require("url").parse(learnerURL + originalUrl).path
        );
        return require("url").parse(contentURL + originalUrl).path;
      },
      userResDecorator: userResDecorator,
    })
  );
  app.post(
    [
      "/action/questionset/v1/create",
      "/action/questionset/v1/review/*",
      "/action/questionset/v1/publish/*",
      "/action/question/v1/create",
      "/action/question/v1/review/*",
      "/action/question/v1/publish/*",
      "/action/questionset/v1/reject/*",
      '/action/question/v1/reject/*',
    ],
    proxy(contentURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "");
        return require("url").parse(contentURL + originalUrl).path;
      },
      userResDecorator: userResDecorator,
    })
  );
  app.patch(
    [
      "/action/questionset/v1/hierarchy/update",
      "/action/questionset/v1/update/*",
      "/action/questionset/v1/add/*",
      "/action/question/v1/update/*",
      '/action/questionset/v1/add',
      '/action/questionset/v1/remove',
    ],
    proxyUtils.verifyToken(),
    proxy(contentURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "");
        return require("url").parse(contentURL + originalUrl).path;
      },
      userResDecorator: userResDecorator,
    })
  );
  // Proxy for content create ,update & review Start
  // @Todo deprecated
  app.use(
    [
      "/action/content/v3/create",
      "/action/content/v3/hierarchy/add",
      "/action/content/v3/hierarchy/remove",
      "/action/content/v3/hierarchy/*",
      "/action/content/v3/import",
    ],
    bodyParser.json({ limit: "50mb" }),
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );
  // Proxy for content create ,update & review Start
  app.get("/action/collection/v4/hierarchy/*",
    bodyParser.json({ limit: "50mb" }),
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        if (localDev) {
          originalUrl = originalUrl.replace("/v4/", "/v1/");
        }
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  // @Todo deprecated
  app.use(
    ["/action/content/v3/update/*"],
    bodyParser.json({ limit: "50mb" }),
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  // @Todo deprecated
  app.post(
    "/action/content/v3/upload/*",
    proxy(kp_content_service_base_url, {
      preserveHostHdr: true,
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
      userResDecorator: userResDecorator,
    })
  );

  app.post("/action/content/v4/import",
    bodyParser.json({ limit: "50mb" }),
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  app.get("/action/content/v4/read/*",
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  app.post("/action/content/v4/create",
    bodyParser.json({ limit: "50mb" }),
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  app.post(
    "/action/content/v4/upload/*",
    proxy(kp_content_service_base_url, {
      preserveHostHdr: true,
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
      userResDecorator: userResDecorator,
    })
  );

  app.patch(
    "/action/collection/v4/hierarchy/add",
    bodyParser.json({ limit: "50mb" }),
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        if (localDev) {
          originalUrl = originalUrl.replace("/v4/", "/v1/");
        }
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  app.delete(
    "/action/collection/v4/hierarchy/remove",
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        if (localDev) {
          originalUrl = originalUrl.replace("/v4/", "/v1/");
        }
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  app.patch("/action/content/v4/update/*",
    bodyParser.json({ limit: "50mb" }),
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  // @Todo deprecated(only few)
  app.use(
    [
      "/action/content/v3/review/*",
      "/action/assessment/v3/items/*",
      "/action/content/v3/publish/*",
      "/action/content/v3/reject/*",
      "/action/content/v3/retire/*",
      "/action/assessment/v3/items/retire/*",
      "/action/system/v3/content/update/*",
    ],
    proxy(kp_learning_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_learning_service_base_url + originalUrl)
          .path;
      },
    })
  );
  
  app.post("/action/content/v4/publish/*",
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );
  
  app.post("/action/content/v4/review/*",
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  app.post("/action/content/v4/reject/*",
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  app.delete("/action/content/v4/retire/*",
    proxy(kp_content_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(kp_content_service_base_url + originalUrl)
          .path;
      },
    })
  );

  app.use(
    [
      "/action/itemset/v3/create",
      "/action/itemset/v3/update/*",
      "/action/itemset/v3/read/*",
      "/action/itemset/v3/review/*",
      "/action/itemset/v3/retire/*",
      "/action/questionset/v4/system/update/*",
      "/action/question/v4/system/update/*",
    ],
    bodyParser.json({ limit: "50mb" }),
    proxy(kp_assessment_service_base_url, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(
          kp_assessment_service_base_url + originalUrl
        ).path;
      },
    })
  );

  app.use(
    ["/action/object/category/*"],
    proxy(contentServiceBaseUrl, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(contentServiceBaseUrl + originalUrl).path;
      },
    })
  );

  app.use(
    [
      "/action/program/v1/process/create",
      "/action/program/v1/process/update",
      "/action/program/v1/process/search",
      "/action/question/v1/bulkUpload",
      "/action/question/v1/bulkUploadStatus",
    ],
    proxy(contentURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        console.log(
          "bulkUpload ",
          contentURL,
          "  ===  ",
          require("url").parse(contentURL + originalUrl).path
        );
        return require("url").parse(contentURL + originalUrl).path;
      },
      userResDecorator: userResDecorator,
    })
  );
  // Proxy for content create , update & review END

  app.use(
    ["/action/asset/v1/*"],
    proxy(contentURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        console.log(
          "asset ",
          contentURL,
          "  ===  ",
          require("url").parse(contentURL + originalUrl).path
        );
        return require("url").parse(contentURL + originalUrl).path;
      },
      userResDecorator: userResDecorator,
    })
  );

  app.use(
    "/action/content/v3/unlisted/publish/:contentId",
    permissionsHelper.checkPermission(),
    bodyParser.json(),
    proxy(contentProxyUrl, {
      preserveHostHdr: true,
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: proxyReqPathResolverMethod,
      proxyReqBodyDecorator: function (bodyContent, srcReq) {
        if (bodyContent && bodyContent.request && bodyContent.request.content) {
          bodyContent.request.content.baseUrl =
            srcReq.protocol + "://" + srcReq.headers.host;
        }
        return bodyContent;
      },
    })
  );

  app.use(
    "/action/data/v1/page/assemble",
    proxy(learnerServiceBaseUrl, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(learnerServiceBaseUrl + originalUrl).path;
      },
    })
  );

  app.use(
    "/action/data/v1/form/read",
    proxy(learnerURL, {
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace("/action/", "");
        return require("url").parse(learnerURL + originalUrl).path;
      },
    })
  );

  app.use(
    "/action/framework/v3/read/*",
    proxy(learnerURL, {
      proxyReqOptDecorator: proxyUtils.decorateSunbirdRequestHeaders(),
      proxyReqPathResolver: function (req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace(
          "/action/framework/v3/",
          "framework/v1/"
        );
        return require("url").parse(learnerURL + originalUrl).path;
      },
    })
  );

  const addCorsHeaders = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,PATCH,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization," +
        "cid, user-id, x-auth, Cache-Control, X-Requested-With, *"
    );

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  };

  app.use(
    "/action/review/comment/*",
    addCorsHeaders,
    proxy(envHelper.PORTAL_EXT_PLUGIN_URL, {
      proxyReqPathResolver: (req) => {
        return req.originalUrl.replace("/action", "/plugin");
      },
      userResDecorator: userResDecorator,
    })
  );
  app.use(
    "/action/textbook/v1/toc/*",
    addCorsHeaders,
    proxy(learnerURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: (req) => {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace(
          "/action/textbook/v1/",
          "textbook/v1/"
        );
        return require("url").parse(learnerURL + originalUrl).path;
      },
      userResDecorator: userResDecorator,
    })
  );
  app.post(
    "/action/user/v1/search",
    addCorsHeaders,
    proxyUtils.verifyToken(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "");
        return require("url").parse(learnerURL + originalUrl).path;
      },
      userResDecorator: userResDecorator,
    })
  );

  app.post(
    "/action/user/v3/search",
    addCorsHeaders,
    proxyUtils.verifyToken(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "");
        return require("url").parse(learnerURL + originalUrl).path;
      },
      userResDecorator: userResDecorator,
    })
  );

  app.use(
    "/action/*",
    permissionsHelper.checkPermission(),
    proxy(contentProxyUrl, {
      preserveHostHdr: true,
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        return require("url").parse(contentProxyUrl + req.originalUrl).path;
      },
      userResDecorator: userResDecorator,
    })
  );

  app.use(
    "/v1/url/fetchmeta",
    proxy(contentProxyUrl, {
      proxyReqPathResolver: proxyReqPathResolverMethod,
    })
  );
};
const userResDecorator = (proxyRes, proxyResData, req, res) => {
  try {
    const data = JSON.parse(proxyResData.toString("utf8"));
    if (
      req.method === "GET" &&
      proxyRes.statusCode === 404 &&
      typeof data.message === "string" &&
      data.message.toLowerCase() ===
        "API not found with these values".toLowerCase()
    )
      res.redirect("/");
    else
      return proxyUtils.handleSessionExpiry(
        proxyRes,
        proxyResData,
        req,
        res,
        data
      );
  } catch (err) {
    console.log(
      "content api user res decorator json parse error",
      proxyResData
    );
    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
  }
};
