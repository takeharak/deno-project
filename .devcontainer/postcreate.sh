#!/bin/sh
# vim:sw=4:ts=4:et

set -e

# set git safe directory
git config --global --add safe.directory $PWD

# install global packages
npm install -g editorconfig npm

# install commitlint
npm install -g @commitlint/cli @commitlint/config-conventional
npx -y husky install
