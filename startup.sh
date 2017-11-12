#!/bin/sh
alias cnpm="npm --registry=https://registry.npm.taobao.org \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npm.taobao.org/dist \
  --userconfig=$HOME/.cnpmrc"
echo 'Ready to running outside web...'
echo 'install libs'
cnpm install
echo 'build webpack'
cd www && webpack
echo 'Startup the outside web.'