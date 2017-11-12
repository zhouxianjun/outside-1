#!/bin/sh
echo 'Ready to running outside web...'
echo 'install libs'
cnpm install
echo 'build webpack'
cd www && webpack
echo 'Startup the outside web.'