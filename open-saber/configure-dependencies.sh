#!/bin/bash -e
echo "Configuring dependencies before build"
cp java/registry/src/main/resources/application.yml.sample java/registry/src/main/resources/application.yml
cp java/registry/src/main/resources/frame.json.sample java/registry/src/main/resources/frame.json
echo "Configuration of dependencies completed"
