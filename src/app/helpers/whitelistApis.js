'use strict';
/**
 * @file - Sourcing Portal Backend API(s) list
 * @description - Whitelisted URL(s)
 * @since release-4.1.0
 * @version 1.0
 */


const API_LIST = {
  URL:  {
    '/content/program/v1/read/:program_id': {
      checksNeeded: []
    },
    '/content/program/v1/create': {
      checksNeeded: []
    },
    '/content/program/v1/update': {
      checksNeeded: []
    },
    '/content/program/v1/publish': {
      checksNeeded: []
    },
    '/content/program/v1/unlist/publish': {
      checksNeeded: []
    },
    '/content/program/v1/delete': {
      checksNeeded: []
    },
    '/content/program/v1/list': {
      checksNeeded: []
    },
    '/content/program/v1/list/download': {
      checksNeeded: []
    },
    '/content/program/v1/report': {
      checksNeeded: []
    },
    '/content/program/v1/search': {
      checksNeeded: []
    },
    '/content/program/v1/nomination/add': {
      checksNeeded: []
    },
    '/content/program/v1/nomination/update': {
      checksNeeded: []
    },
    '/content/program/v1/nomination/remove': {
      checksNeeded: []
    },
    '/content/program/v1/nomination/list': {
      checksNeeded: []
    },
    '/content/program/v1/nomination/list/download': {
      checksNeeded: []
    },
    '/content/program/v1/collection/link': {
      checksNeeded: []
    },
    '/content/program/v1/nomination/contentypes/list': {
      checksNeeded: []
    },
    '/content/program/v1/health': {
      checksNeeded: []
    },
    '/content/program/v1/contributor/search': {
      checksNeeded: []
    },
    '/content/program/v1/collection/copy': {
      checksNeeded: []
    },
    '/content/program/v1/configuration/list': {
      checksNeeded: []
    },
    '/content/program/v1/configuration/create': {
      checksNeeded: []
    },
    '/content/program/v1/configuration/search': {
      checksNeeded: []
    },
    '/content/program/v1/configuration/update': {
      checksNeeded: []
    },
    '/content/program/v1/content/publish': {
      checksNeeded: []
    },
    '/content/program/v1/tenant/list': {
      checksNeeded: []
    },
    '/content/program/v1/sync/registry': {
      checksNeeded: []
    },
    '/content/program/v1/preference/create': {
      checksNeeded: []
    },
    '/content/program/v1/preference/update': {
      checksNeeded: []
    },
    '/content/program/v1/preference/read': {
      checksNeeded: []
    },
    '/content/program/v1/process/create': {
      checksNeeded: []
    },
    '/content/program/v1/process/read/:process_id': {
      checksNeeded: []
    },
    '/content/program/v1/process/update': {
      checksNeeded: []
    },
    '/content/program/v1/process/search': {
      checksNeeded: []
    },
    '/content/program/v1/feed/search': {
      checksNeeded: []
    },
    '/content/reg/search': {
      checksNeeded: []
    },
    '/content/reg/update': {
      checksNeeded: []
    },
    '/content/reg/read': {
      checksNeeded: []
    },
    '/content/reg/add': {
      checksNeeded: []
    },
    '/action/content/v3/create': {
      checksNeeded: []
    },
    '/action/content/v3/hierarchy/add': {
      checksNeeded: []
    },
    '/action/content/v3/hierarchy/remove': {
      checksNeeded: []
    },
    '/action/content/v3/import': {
      checksNeeded: []
    },
    '/action/itemset/v3/create': {
      checksNeeded: []
    },
    '/action/itemset/v3/retire/': {
      checksNeeded: []
    },
    '/action/content/v3/unlisted/publish/:contentId': {
      checksNeeded: []
    },
    '/action/user/v1/search': {
      checksNeeded: []
    },
    '/v1/url/fetchmeta': {
      checksNeeded: []
    },
    '/content/course/v1/search': {
      checksNeeded: []
    },
    '/content/program/v1/print/pdf': {
      checksNeeded: []
    },
    '/api/org/v1/search': {
      checksNeeded: []
    },
    '/learner/user/v2/read/:userId': {
      checksNeeded: []
    },
    '/learner/data/v1/role/read': {
      checksNeeded: []
    },
    '/learner/framework/v1/read/:frameworkId': {
      checksNeeded: []
    },
    '/learner/composite/v1/search': {
      checksNeeded: []
    },
    '/learner/channel/v1/read/:channelId': {
      checksNeeded: []
    },
    '/learner/portal/user/v1/update': {
      checksNeeded: []
    },
    '/learner/user/v1/signup': {
      checksNeeded: []
    },
    '/learner/user/v1/password/reset': {
      checksNeeded: []
    },
    '/learner/otp/v1/verify': {
      checksNeeded: []
    },
    '/learner/user/v1/fuzzy/search': {
      checksNeeded: []
    },
    '/action/content/v3/update/:do_id': {
      checksNeeded: []
    },
    '/action/content/v3/upload/url/:do_id': {
      checksNeeded: []
    },
    '/action/content/v3/upload/:do_id': {
      checksNeeded: []
    },
    '/action/content/v3/review/:do_id': {
      checksNeeded: []
    },
    '/action/content/v3/publish/:do_id': {
      checksNeeded: []
    },
    '/action/content/v3/reject/:do_id': {
      checksNeeded: []
    },
    '/action/content/v3/retire/:do_id': {
      checksNeeded: []
    },
    '/action/assessment/v3/items/retire/:do_id': {
      checksNeeded: []
    },
    '/action/system/v3/content/update/:do_id': {
      checksNeeded: []
    },
    '/action/itemset/v3/update/:do_id': {
      checksNeeded: []
    },
    '/action/itemset/v3/read/:do_id': {
      checksNeeded: []
    },
    '/action/itemset/v3/review/:do_id': {
      checksNeeded: []
    },
    '/action/itemset/v3/retire/:do_id': {
      checksNeeded: []
    },
    '/action/questionset/v4/system/update/:do_id': {
      checksNeeded: []
    },
    '/action/framework/v3/read/:frameworkId': {
      checksNeeded: []
    },
  },
  URL_PATTERN: [
    '/content/program/v1/read/:program_id',
    '/content/program/v1/process/read/:process_id',
    '/action/content/v3/unlisted/publish/:contentId',
    '/learner/user/v2/read/:userId',
    '/learner/framework/v1/read/:frameworkId',
    '/learner/channel/v1/read/:channelId',
    '/action/content/v3/update/:do_id',
    '/action/content/v3/upload/url/:do_id',
    '/action/content/v3/upload/:do_id',
    '/action/content/v3/review/:do_id',
    '/action/content/v3/publish/:do_id',
    '/action/content/v3/reject/:do_id',
    '/action/content/v3/retire/:do_id',
    '/action/assessment/v3/items/retire/:do_id',
    '/action/system/v3/content/update/:do_id',
    '/action/itemset/v3/update/:do_id',
    '/action/itemset/v3/read/:do_id',
    '/action/itemset/v3/review/:do_id',
    '/action/itemset/v3/retire/:do_id',
    '/action/questionset/v4/system/update/:do_id',
    '/action/framework/v3/read/:frameworkId',
  ]
}
module.exports = API_LIST;
