#!/usr/bin/env node
import chalk from 'chalk';
import semverSatisfies from 'semver/functions/satisfies.js';

import { packageJson } from '../utils/package-json.js';
import { rockpack } from './rockpack.js';

const currentNodeVersion = process.versions.node;
const requiredNodeVersion = packageJson.engines.node;

if (!semverSatisfies(currentNodeVersion, requiredNodeVersion)) {
  console.error(
    chalk.red(`You are running Node ${currentNodeVersion}.
Rockpack requires Node ${requiredNodeVersion}. Please update your version of Node.`),
  );
  process.exitCode = 1;
} else {
  void rockpack().then((code) => {
    process.exitCode = code;
  });
}
