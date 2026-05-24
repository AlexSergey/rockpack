import type { PackageJson } from '../types.js';

export const capitalize = (s: string): string => {
  if (typeof s !== 'string') {
    return '';
  }

  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function getMajorVersion(version: string): false | string {
  return typeof version === 'string' && version.includes('.') ? (version.split('.')[0] ?? false) : false;
}

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

  return `${packageJson.name.split('_').join(' ')}`;
}
