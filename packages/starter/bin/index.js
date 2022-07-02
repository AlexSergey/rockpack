#!/usr/bin/env node

const chalk = require('chalk');

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];
const minVer = 12;

if (major < minVer) {
  console.error(
    chalk.red(`You are running Node ${currentNodeVersion}.
Rockpack requires Node ${minVer} or higher. Please update your version of Node.`)
  );
  process.exit(1);
}

require('./rockpack');
