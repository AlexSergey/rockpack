#!/usr/bin/env node
import chalk from 'chalk';

import { rockpack } from './rockpack.js';

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = Number(semver[0] ?? '0');
const minVer = 24;

if (major < minVer) {
  console.error(
    chalk.red(`You are running Node ${currentNodeVersion}.
Rockpack requires Node ${minVer} or higher. Please update your version of Node.`),
  );
  process.exitCode = 1;
} else {
  void rockpack().then((code) => {
    process.exitCode = code;
  });
}
