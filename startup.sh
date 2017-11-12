#!/bin/sh
echo 'Ready to running outside web...'
echo 'install libs'
npm install
echo 'build webpack'
cd www && webpack
echo 'Startup the outside web.'