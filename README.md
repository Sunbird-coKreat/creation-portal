# Sunbird Portal
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5b3a8965fbe9447a9e74967e852c38df)](https://www.codacy.com/app/sunbird-bot/SunbirdEd-portal?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Sunbird-Ed/SunbirdEd-portal&amp;utm_campaign=Badge_Grade)

[![Build Status](https://travis-ci.org/project-sunbird/sunbird-portal.svg?branch=master)](https://travis-ci.org/project-sunbird/sunbird-portal)


## What is Sunbird?
[Sunbird](http://sunbird.org) is a next-generation scalable open-source learning solution for teachers and tutors. Built for the 21st century with [state-of-the-art technology](http://www.sunbird.org/architecture/views/physical/), Sunbird runs natively in [cloud/mobile environments](http://www.sunbird.org/features/). The [open-source governance](LICENSE) of Sunbird allows a massive community of nation-builders to co-create and extend the solution in novel ways.

## What is the project mission?
Project Sunbird has a mission to improve learning outcomes for 200 million children across India. This is a multi-dimensional problem unique to the multi-lingual offline population of India (and other developing countries). It's not a problem of any single organization or stakeholder and it cannot be realistically addressed by individual effort.

Project Sunbird is an [open, iterative and collaborative](http://www.sunbird.org/participate/) approach to bring together the best minds in pursuit of this audacious goal.

## What is the Sunbird portal?
The Sunbird portal is the browser-based interface for the Sunbird application stack. It provides a web-app through which all functionality of Sunbird can be accessed.

## Getting started
To get started with the Sunbird portal, please try out our cloud-based demo site at: https://staging.open-sunbird.org/

### Local Installation
You can also install the Sunbird portal locally on your laptop, please follow the [installation instructions](http://www.sunbird.org/developer-docs/installation/)

## Reporting Issues
We have an open and active [issue tracker](https://github.com/project-sunbird/sunbird-commons/issues). Please report any issues.




## Run Locally

`Use node version 12.16.1`

Fork the project

```bash
  https://github.com/Sunbird-Ed/creation-portal.git
```

#### Starting up frontend app
Go to the project directory

```bash
  cd src/app/client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  ng build --watch
```


#### Starting up backend app

In another terminal tab -

Go to the project directory

```bash
  cd src/app/
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run server
```

The local HTTP server is launched at `http://localhost:3000`


> #### Note:
> Expected errors while start up the backend server
```bash
AssertionError [ERR_ASSERTION]: Host should not be empty
```
#### Solution

If the error is from `accountRecoveryRoute.js`

- Open `<PROJECT-FOLDER>/src/app/helpers/environmentVariablesHelper.js`
- add a fallback value for `SUNBIRD_LEARNER_URL` as below
```bash
  SUNBIRD_LEARNER_URL: env.sunbird_learner_url || 'https://dev.sunbirded.org/api',
```

If the error is from `contentEditorProxy.js`

- Open `<PROJECT-FOLDER>/src/app/helpers/environmentVariablesHelper.js`
- add a fallback value for `kp_learning_service_base_url` as below
```bash
  kp_learning_service_base_url: env.sunbird_kp_learning_service_base_url || `https://dock.sunbirded.org`
```
