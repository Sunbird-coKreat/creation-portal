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
 switch (cloudProvider) {
   case 'azure':
     let azureConfig = {
       identity: envHelper.sunbird_cloud_storage_key,
       credential: envHelper.sunbird_cloud_storage_secret,
       reportsContainer: envHelper.sunbird_cloud_report_container
     };
     let azureClient = cloudService.init(cloudProvider);
     const azureStorage = new azureClient(azureConfig);
     exports.CLOUD_CLIENT = azureStorage;
     break;
   case 'aws':
     let awsConfig = {
       identity: envHelper.sunbird_cloud_storage_key,
       credential: envHelper.sunbird_cloud_storage_secret,
       region: envHelper.sunbird_cloud_storage_region,
       containerName: envHelper.sunbird_cloud_storage_container,
       reportsContainer: envHelper.sunbird_cloud_report_container
     };
     let awsClient = cloudService.init(cloudProvider);
     const awsStorage = new awsClient(awsConfig);
     exports.CLOUD_CLIENT = awsStorage;
     break;
   case 'gcloud':
     let gcpConfig = {
       identity: envHelper.sunbird_cloud_storage_key,
       credential: envHelper.sunbird_cloud_storage_secret,
       projectId: envHelper.sunbird_gcloud_project_id,
       containerName: envHelper.sunbird_cloud_storage_container,
       reportsContainer: envHelper.sunbird_cloud_report_container
     };
     let gcpClient = cloudService.init(cloudProvider);
     const gcpStorage = new gcpClient(gcpConfig);
     exports.CLOUD_CLIENT = gcpStorage;
     break;
   default:
     throw new Error("Cloud Storage Service - Provider is not initialized or supported");
     break;
 }
