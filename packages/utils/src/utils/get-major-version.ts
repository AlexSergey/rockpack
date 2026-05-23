import { minVersion } from 'semver';

export const getMajorVersion = (version: string): number => {
  const result = minVersion(version);
  if (result === null) {
    throw new Error(`Invalid semver range: ${version}`);
  }

  return result.major;
};
