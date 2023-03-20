'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const stageingEdEnvUrl = 'https://staging.sunbirded.org';
const docStageingEdEnvUrl = 'https://dockstaging.sunbirded.org';


let envVariables = {


  //Mandatory Changes
  PORTAL_API_AUTH_TOKEN: env.dock_api_auth_token || '',
  SUNBIRD_PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token || '',
  LEARNER_URL: env.sunbird_learner_player_url || stageingEdEnvUrl+'/api/',
  CONTENT_URL: env.sunbird_content_player_url || docStageingEdEnvUrl+'/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || docStageingEdEnvUrl+'',
  cloud_storage_provider: env.sunbird_cloud_storage_provider || 'azure', // azure, aws or gcloud
  sunbird_cloud_storage_secret: env.sunbird_cloud_storage_secret || '',
  sunbird_cloud_storage_key: env.sunbird_cloud_storage_key || 'sunbirddev',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || stageingEdEnvUrl+'/auth',

  //Mandatory Default

  PORTAL_PORT: env.sunbird_port || 3000,
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  sunbird_instance_name: env.sunbird_instance || 'Sunbird',
  DEFAULT_CHANNEL: env.sunbird_default_channel,
  PORTAL_API_WHITELIST_CHECK: env.sunbird_enable_api_whitelist || 'true',
  ENABLE_REVIEW_EDIT: env.enable_review_edit || false,
  IS_SEND_REMINDER_ENABLED:env.sunbird_send_reminder_enabled || 'false',

  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  
  EKSTEP_ENV: env.ekstep_env || 'qa',
  DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.open-sunbird.org/v3/device/register/',
  
  sunbird_theme: env.sunbird_theme || 'default',
  BUILD_NUMBER: packageObj.version + '.' + packageObj.buildHash,
  sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
  sunbird_extcont_whitelisted_domains: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',


  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  

  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  PORTAL_EXT_PLUGIN_URL: process.env.sunbird_ext_plugin_url || 'http://player_player:3000/plugin/',
  sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
  sunbird_learner_service_health_status: 'true',
  sunbird_content_service_health_status: 'true',
  sunbird_portal_cassandra_db_health_status: 'true',


  kp_content_service_base_url: env.sunbird_kp_content_service_base_url || 'https://dock.sunbirded.org/api/',
  kp_learning_service_base_url: env.sunbird_kp_learning_service_base_url || 'https://dock.sunbirded.org/api/',
  kp_assessment_service_base_url: env.sunbird_kp_assessment_service_base_url || 'https://dock.sunbirded.org/api/',

  
}

envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
  ? env.sunbird_cassandra_urls.split(',') : ['localhost']

module.exports = envVariables