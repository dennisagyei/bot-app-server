#!/bin/bash
set -e

### Configuration ###

APP_DIR=/var/www/html/potomanto.labs
GIT_URL=git://github.com/dennisagyei/potomantolabs.git
RESTART_ARGS=

# Uncomment and modify the following if you installed Passenger from tarball
#export PATH=/path-to-passenger/bin:$PATH


### Automation steps ###

set -x

# Pull latest code
if [[ -e $APP_DIR/code ]]; then
  cd $APP_DIR/code
  git pull
else
  git clone $GIT_URL $APP_DIR/code
  cd $APP_DIR/code
fi

# Install dependencies
npm install --production

# Restart app
pm2 start $APP_DIR/server.js