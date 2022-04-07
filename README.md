# Installing Creation Portal on Local Laptop or Desktop

## Pre-requisites

Before you install creation portal on your laptop, examine your environment and gather data to ensure an optimal installation experience. Review the [details](https://app.gitbook.com/o/-Mi9QwJlsfb7xuxTBc0J/s/SjljYc0PyD64vGgDlMl4/use/system-requirements) to ensure that the environment has the necessary resources and compliant target systems to successfully install and run creation portal.

## Project Setup

1. Clone the project

  - Fork the [main source code repository](https://github.com/Sunbird-Ed/creation-portal)
  - Clone the forked repository and add main source code repository as upstream
    ```console
        git clone {SSH URL of FORKED REPOSITORY}
        cd {PROJECT-FOLDER}
        git remote add upstream git@github.com:Sunbird-Ed/creation-portal.git
        git fetch upstream
        git checkout -b {LOCAL-BRANCH-NAME} upstream/{LATEST BRANCH}
    ```
    > ***Note***: Stable versions of the creation portal are available via tags for each release, and the master branch contains latest stable release. For latest stable release [refer](https://github.com/Sunbird-Ed/creation-portal/branches)


2. Add the following environment variables - Required for downloading editors (Via gulp task)
    ```console
        export sunbird_content_editor_artifact_url="https://sunbirddev.blob.core.windows.net/sunbird-content-dev/artefacts/editor/content-editor-iframe-2.6.0.zip"

        export sunbird_collection_editor_artifact_url="https://sunbirddev.blob.core.windows.net/sunbird-content-dev/artefacts/editor/collection-editor-iframe-2.6.0.zip"

        export sunbird_generic_editor_artifact_url="https://sunbirddev.blob.core.windows.net/sunbird-content-dev/artefacts/editor/generic-editor-iframe-2.6.0.zip"
    ```

3. Install required dependencies

    1. Sunbird portal or web application

        1. $ cd {PROJECT-FOLDER}/src/app/client
        2. $ npm install

    2. Sunbird services stack or the backend API interface

        1. $ gulp download:editors
        2. $ cd {PROJECT-FOLDER}/src/app
        3. $ npm install

4. Configuring the Environment and Services Stack

    > Configure the following system environment variables in the terminal which you have opened

          | Environment Variable      |  Value  | Data Type |
          | :------------------------ | ------- | --------- |
          |  sunbird_environment      | local   |   string  |
          |  sunbird_instance         | sunbird |   string  |
          |  sunbird_default_channel  | sunbird |   string  |
          |  sunbird_default_tenant   | sunbird |   string  |

    > The initialization of these environmental variables can take place in a common place like in your **.bashrc** or **.bash_profile**

5. Edit the Application Configuration

    > Open `<PROJECT-FOLDER>/src/app/helpers/environmentVariablesHelper.js` in any available text editor and update the contents of the file so that it contains exactly the following values

    ```console
      module.exports = {
        // Application Start-up - Hosts and PORT Configuration
        ...
        LEARNER_URL: env.sunbird_learner_player_url || <'https://<host for adopter's instance>',
        CONTENT_URL: env.sunbird_content_player_url || <'https://<host for adopter's instance>',
        CONTENT_PROXY_URL: env.sunbird_content_proxy_url || <'https://<host for adopter's instance>',
        PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || <'https://<host for adopter's instance>',
        PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || '',
        ...
        PORTAL_API_AUTH_TOKEN: env.dock_api_auth_token || <User generated API auth token>,
        SUNBIRD_PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token || <User generated Sunbird API auth token>,
        ...
        LOCAL_DEVELOPMENT: env.local_development || true,

      }
      ```
    > Once the file is updated with appropriate values, then you can proceed with running the application


### Running Application

1. Creation portal or web application

    1. Run the following command in the **{PROJECT-FOLDER}/src/app/client** folder
    2. $ nodemon
    3. Wait for the build process to complete before proceeding to the next step. The following messge should appear on the screeen
      ```console
        [nodemon] clean exit - waiting for changes before restart
      ```

2. Services stack or the backend API interface

    1. Run the following command in the **{PROJECT-FOLDER}/src/app** folder
    2. $ node server.js

3. The local HTTP server is launched at `http://localhost:3000`

### Project Structure
    .
    ├── creation-portal
    |   ├── /.circleci                           #
    │   |   └── config.yml                       # Circleci Configuration file
    |   ├── /experiments                         # -|-
    |   ├── /src/app                             # creation portal or web application
    │   |   ├── /client                          # -|-
    │   |   |    └── src                         # -|-
    │   |   ├── /helpers                         # Helpers and Service file
    │   |   ├── /libs                            # Utilities
    │   |   ├── /proxy                           # Redirection to respective services
    │   |   ├── /resourcebundles                 # Language resources
    │   |   ├── /routes                          # Backend Routes
    │   |   ├── /sunbird-plugins                 # Plugins for editors
    │   |   ├── /tests                           # Test case scripts for helpers and routes
    │   |   ├── framework.config.js              # Default framework configuration
    │   |   ├── gulp-tenant.js                   # -|-
    │   |   ├── gulpfile.js                      # Gulp build configuration
    │   |   ├── package.json                     # Contains Node packages as specified as dependencies in package.json
    │   |   └── server.js                        # Main application program file / entry file for services stack or the backend API interface
    └───└── .gitignore                           # git configuration to ignore some files and folder

### Testing

1. Creation portal or web application

        1. $ cd {PROJECT-FOLDER}/src/app/client
        2. $ npm run test
        3. With Coverage $ npm run test-coverage

2. Services stack or the backend API interface

        1. $ cd {PROJECT-FOLDER}/src/app
        2. $ npm run backend-test
        3. With Coverage $ npm run backend-test-with-coverage
