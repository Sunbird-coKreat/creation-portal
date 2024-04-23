#!/bin/bash
# set -euo pipefail

STARTTIME=$(date +%s)
NODE_VERSION=16.19.0
echo "Starting coKreat portal build from build.sh"
set -euo pipefail	
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


# build_tag="$1"
# name=creation-player
# node=$2
# org=$3
# export sunbird_content_editor_artifact_url=$4
# export sunbird_collection_editor_artifact_url=$5
# export sunbird_generic_editor_artifact_url=$6
# commit_hash=$(git rev-parse --short HEAD)

rm -rf src/app/app_dist/
rm -rf src/app/player-dist.tar.gz
nvm install $NODE_VERSION # same is used in client and server
nvm use $NODE_VERSION
cd src/app
npm install -g yarn
# npm set progress=false
# npm install  --unsafe-perm
echo "npm run deployyyyyyyyyyyyyyyyyyyyyyyyyyyy"
npm run deploy

# cd client
# echo "yarn client client client client client client client"
# yarn  --ignore-engines --no-progress --production=true
# echo "yarn client done-------------------------------------------------"

# npm run deploy2
cd app_dist
echo "installing YARN"
# npm i npm@8.19.3
#  echo "NPM Package removed"
# yarn remove src
# echo " package removed"
# rm -rf node_modules package-lock.json
# echo "Package removed"
#  echo "starting YARN install"
yarn  --ignore-engines --no-progress --production=true
 echo "------starting npm install222222222"
sed -i "/version/a\  \"buildHash\": "test"," package.json
echo "starting docker build"
echo 'Compressing assets directory'
cd ..
tar -cvf player-dist.tar.gz app_dist
cd ../..

docker build --no-cache --label commitHash=$(git rev-parse --short HEAD) -t "ekStep"/"Shubham1.0" .

echo {\"image_name\" : \"${name}\", \"image_tag\" : "v15tov16",\"commit_hash\" : "test", \"node_name\" : \"$node\"} > metadata.json
echo "build completed. Took $[$ENDTIME - $STARTTIME] seconds."
