'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))

let envVariables = {

  // Environment variables
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  sunbird_instance_name: env.sunbird_instance || 'Sunbird',
  DEFAULT_CHANNEL: env.sunbird_default_channel,
  PORTAL_API_WHITELIST_CHECK: env.sunbird_enable_api_whitelist || 'true',
  ENABLE_REVIEW_EDIT: env.enable_review_edit || false,
  IS_SEND_REMINDER_ENABLED:env.sunbird_send_reminder_enabled || 'false',


  // Application Start-up - Hosts and PORT Configuration
  PORTAL_PORT: env.sunbird_port || 3000,
  LEARNER_URL: env.sunbird_learner_player_url || 'https://staging.open-sunbird.org/api/',
  CONTENT_URL: env.sunbird_content_player_url || 'https://staging.open-sunbird.org/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://staging.open-sunbird.org',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://staging.open-sunbird.org/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  PORTAL_API_AUTH_TOKEN: env.dock_api_auth_token,
  SUNBIRD_PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://staging.open-sunbird.org/api/echo/',
  CONFIG_URL: env.sunbird_config_service_url || 'https://staging.open-sunbird.org/api/config/',
  EKSTEP_ENV: env.ekstep_env || 'qa',
  DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.open-sunbird.org/v3/device/register/',
  DEVICE_PROFILE_API: process.env.sunbird_device_profile_api || 'https://staging.open-sunbird.org/api/v3/device/profile/',
  sunbird_theme: env.sunbird_theme || 'default',
  BUILD_NUMBER: packageObj.version + '.' + packageObj.buildHash,
  sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
  sunbird_extcont_whitelisted_domains: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  sunbird_explore_button_visibility: env.sunbird_explore_button_visibility || 'true',
  sunbird_help_link_visibility: env.sunbird_help_link_visibility || 'false',
  sunbird_portal_user_upload_ref_link: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
  ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,
  CONFIG_SERVICE_ENABLED: env.config_service_enabled || false,
  CRYPTO_ENCRYPTION_KEY: env.crypto_encryption_key || '030702bc8696b8ee2aa71b9f13e4251e',
  CRYPTO_ENCRYPTION_KEY_EXTERNAL: env.crypto_encryption_key_external || '030702me8696b8ee2aa71x9n13l4251e',
  LOG_FINGERPRINT_DETAILS: env.sunbird_log_fingerprint_details || 'true',
  SUNBIRD_PORTAL_BASE_URL: env.sunbird_portal_base_url,
  DOCK_CHANNEL: env.dock_channel || 'sunbird',
  sunbird_device_api: env.sunbird_device_api || 'https://staging.ntp.net.in/api/',
  dock_api_call_log_status: env.dock_api_call_log_status || false,
  SUNBIRD_PORTAL_URL: env.sunbird_portal_url,
  SUNBIRD_LEARNER_URL: env.sunbird_learner_url,
  DOCK_PROGRAM_SERVICE_URL: env.dock_program_service_url,
  DOCK_QUESTIONSET_ENABLE: env.dock_questionSet_enable || 'true',
  DOCK_SMS_URL: env.dock_sms_url || 'https://vdn.diksha.gov.in',
  DOCK_DEFAULT_FILE_SIZE: env.dock_default_file_size || 150,
  DOCK_DEFAULT_VIDEO_SIZE: env.dock_default_video_size || 15000,
  SUNBIRD_PROTO: env.sunbird_base_proto,
  OPENSABER_SERVICE_URL: env.opensaber_service_url || 'http://opensaber-service:8080',
  USE_SUNBIRD_KONG_TOKEN: env.use_sunbird_kong_token || 'true',
  sunbird_kong_refresh_token_api: env.sunbird_kong_refresh_token_api || '',
  LOCAL_DEVELOPMENT: env.local_development || false,
  // generic editor question set and coleections children contents limit
  SUNBIRD_QUESTIONSET_CHILDREN_LIMIT: env.sunbird_questionset_children_limit || 500,
  SUNBIRD_COLLECTION_CHILDREN_LIMIT: env.sunbird_collection_children_limit || 1200,
  SUNBIRD_TRANSCRIPT_SUPPORTED_LANGUAGES: env.sunbird_transcript_supported_languages || '[{"language":"English","languageCode":"en"},{"language":"Hindi","languageCode":"hi"},{"language":"Assamese","languageCode":"as"},{"language":"Bengali","languageCode":"bn"},{"language":"Gujarati","languageCode":"gu"},{"language":"Kannada","languageCode":"ka"},{"language":"Marathi","languageCode":"mr"},{"language":"Odia","languageCode":"or"},{"language":"Tamil","languageCode":"ta"},{"language":"Telugu","languageCode":"te"}]',
  SUNBIRD_TRANSCRIPT_FILE_FORMAT: env.sunbird_transcript_file_format || 'srt',
  SUNBIRD_TRANSCRIPT_REQUIRED: env.sunbird_transcript_required || false,
  SUNBIRD_BULK_UPLOAD_NAME_LENGTH: env.sunbird_bulk_upload_name_length || '50',
  SUNBIRD_BULK_UPLOAD_DESC_LENGTH: env.sunbird_bulk_upload_description_length || '500',
  sunbird_accessibility_guidelines_url: env.sunbird_accessibility_guidelines_url || '',
  ALLOWED_FRAMEWORK_TYPES: env.allowed_framework_types || 'K-12,TPD',
  DOCK_INTERACTIVE_VIDEO_QSET_CATEGORY: env.dock_interactive_video_qset_category || 'Interactive Video Question Set',
  // TTL and Intervals
  CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  CACHE_TTL: env.sunbird_cache_ttl || 1800,
  RESPONSE_CACHE_TTL: env.sunbird_response_cache_ttl || '180', // used in tenant helper to cache the tenant response info
  sunbird_portal_updateLoginTimeEnabled:env.sunbird_portal_updateLoginTimeEnabled || false,
  sunbird_portal_video_max_size: env.sunbird_portal_video_max_size || '50',
  SUNBIRD_CONTEXTUAL_HELP_CONFIG: env.sunbird_contextual_help_config,

  // Telemetry Configuration
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',


  // Keycloak Configuration
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: env.sunbird_google_keycloak_client_id,
    secret: env.sunbird_google_keycloak_secret
  },
  KEYCLOAK_GOOGLE_ANDROID_CLIENT: {
    clientId: env.sunbird_google_android_keycloak_client_id,
    secret: env.sunbird_google_android_keycloak_secret
  },
  KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT: {
    clientId: env.sunbird_trampoline_android_keycloak_client_id,
    secret: env.sunbird_trampoline_android_keycloak_secret
  },
  KEYCLOAK_ANDROID_CLIENT: {
    clientId: env.sunbird_android_keycloak_client_id || 'android',
  },
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_MERGE_AUTH_SERVER_URL: env.sunbird_portal_merge_auth_server_url || 'https://merge.staging.open-sunbird.org/auth',


  // Social login Configuration
  GOOGLE_OAUTH_CONFIG: {
    clientId: env.sunbird_google_oauth_clientId,
    clientSecret: env.sunbird_google_oauth_clientSecret
  },
  sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key,
  google_captcha_private_key: env.google_captcha_private_key,


  // Android Configuration
  ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',


  // BLOB and Storage Configuration
  PORTAL_CLOUD_STORAGE_URL: env.portal_cloud_storage_url,
  CACHE_STORE: env.sunbird_cache_store || 'memory',
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
  PORTAL_CASSANDRA_CONSISTENCY_LEVEL: env.sunbird_cassandra_consistency_level || 'one',
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: env.sunbird_cassandra_replication_strategy || '{"class":"SimpleStrategy","replication_factor":1}',
  sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',

  // START - deprecated below 3 variables from release-5.1.0
  sunbird_azure_report_container_name: env.sunbird_azure_report_container_name || 'reports',
  sunbird_azure_account_name: env.sunbird_azure_account_name || '',
  sunbird_azure_account_key: env.sunbird_azure_account_key || '',
  // END - deprecated above 3 variables from release-5.1.0


  //Cloud Agnostic Changes
  cloud_storage_provider: env.sunbird_cloud_storage_provider, // azure, aws or gcloud
  sunbird_cloud_storage_key: env.sunbird_cloud_storage_key,
  sunbird_cloud_storage_secret: env.sunbird_cloud_storage_secret,
  sunbird_cloud_report_container: env.sunbird_cloud_report_container  || 'reports',
  sunbird_cloud_storage_region: env.sunbird_cloud_storage_region,
  sunbird_cloud_storage_container: env.sunbird_cloud_storage_container || '',
  sunbird_gcloud_project_id: env.sunbird_gcloud_project_id || '',


  // Default Language Configuration
  sunbird_default_language: env.sunbird_portal_default_language || 'en',
  sunbird_primary_bundle_language: env.sunbird_portal_primary_bundle_language || 'en',


  // Service(s) Base URL(s)
  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
  content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content-service:5000',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://staging.open-sunbird.org/api/',
  PORTAL_EXT_PLUGIN_URL: process.env.sunbird_ext_plugin_url || 'http://player_player:3000/plugin/',
  kp_content_service_base_url: env.sunbird_kp_content_service_base_url || 'https://dock.sunbirded.org/api/',
  kp_learning_service_base_url: env.sunbird_kp_learning_service_base_url || 'https://dock.sunbirded.org/api/',
  kp_assessment_service_base_url: env.sunbird_kp_assessment_service_base_url || 'https://dock.sunbirded.org/api/',


  // Health Checks Configuration
  sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
  sunbird_learner_service_health_status: 'true',
  sunbird_content_service_health_status: 'true',
  sunbird_portal_cassandra_db_health_status: 'true',


  // Desktop App Configuration
  sunbird_portal_offline_tenant: env.sunbird_portal_offline_tenant,
  sunbird_portal_offline_supported_languages: env.sunbird_portal_offline_supported_languages,
  sunbird_portal_offline_app_release_date: env.sunbird_portal_offline_app_release_date,
  sunbird_portal_offline_app_version: env.sunbird_portal_offline_app_version,
  sunbird_portal_offline_app_download_url: env.sunbird_portal_offline_app_download_url,
  DESKTOP_APP_STORAGE_URL: env.desktop_app_storage_url,


  // CDN Configuration
  PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  sunbird_portal_preview_cdn_url: env.sunbird_portal_preview_cdn_url,


  // Kafka Configuration
  sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host,
  sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic
}

envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
  ? env.sunbird_cassandra_urls.split(',') : ['localhost']

module.exports = envVariables
