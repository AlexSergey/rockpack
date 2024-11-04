#!/usr/bin/env node
import chalk from 'chalk';

import { rockpack } from './rockpack.js';

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];
const minVer = 18;

if (major < minVer) {
  console.error(
    chalk.red(`You are running Node ${currentNodeVersion}.
Rockpack requires Node ${minVer} or higher. Please update your version of Node.`),
  );
  process.exit(1);
}

rockpack();
