import type { PackageJson } from '../types.js';

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getTitle(packageJson: null | PackageJson | undefined): false | string {
  if (!packageJson) {
    return false;
  }
  if (!packageJson.name) {
    return false;
  }

  return packageJson.name.split('_').join(' ');
}
