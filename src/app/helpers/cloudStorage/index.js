/**
 * @file        - Entry file referencing Storage Service
 * @description - Entry file referencing Storage Service
 * @exports     - `AzureStorageService`, `AWSStorageService` and `GoogleStorageService`
 */

 const cloudService  = require('client-cloud-services');
 const envHelper     = require('../../helpers/environmentVariablesHelper');
 const cloudProvider = envHelper.cloud_storage_provider;

 /**
  * Based on Environment Cloud Provider value
  * Export respective Storage Service
  */
 if (!cloudProvider) throw new Error("Cloud Storage Service - Provider is not initialized");
 let cloudConfig = {
  provider: envHelper.cloud_storage_provider,
  identity: envHelper.sunbird_cloud_storage_key,
  credential: envHelper.sunbird_cloud_storage_secret,
  privateObjectStorage: envHelper.sunbird_cloud_report_container,
  publicObjectStorage: envHelper.sunbird_cloud_storage_resourceBundle_bucketname,
  region: envHelper.sunbird_cloud_storage_region,
  projectId: envHelper.sunbird_cloud_project_id,
  endpoint:envHelper.sunbird_cloud_private_storage_endpoint
};

let cloudClient = cloudService.init(cloudConfig);
exports.CLOUD_CLIENT = cloudClient;








