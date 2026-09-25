import checkbox from '@inquirer/checkbox';
import latestVersion from 'latest-version';
import { parse, satisfies, valid } from 'semver';
import { writeFileSync, readFileSync } from 'node:fs';
import { matchesGlob } from 'node:path';
import sortPackageJson from 'sort-package-json';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getWorkspacePackageJsons } from './tools/workspaces';

type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

type VersionEntry = {
  name: string;
  version: string;
};

type VersionsJson = Record<string, Record<string, Record<string, VersionEntry[]>>>;

type RegistryVersionMeta = {
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
};

type PlanEntry = {
  current: ReadonlySet<string>;
  next: string;
};

type Plan = ReadonlyMap<string, PlanEntry>;

type PeerConflict = {
  dep: string;
  version: string;
  peer: string;
  peerVersion: string;
  range: string;
};

const DEP_FIELDS: ReadonlyArray<'dependencies' | 'devDependencies'> = ['dependencies', 'devDependencies'];
const REGISTRY_CONCURRENCY = 8;

const argv = yargs(hideBin(process.argv))
  .options({
    'dry-run': { default: false, describe: 'Print the plan without writing files', type: 'boolean' },
    filter: { array: true, describe: 'Update only the dependencies matching these globs (@babel/*)', type: 'string' },
    interactive: { default: false, describe: 'Choose which major updates to apply', type: 'boolean' },
    major: { default: true, describe: 'Allow major updates (--no-major skips and lists them)', type: 'boolean' },
  })
  .strict()
  .parseSync();

const dryRun = argv['dry-run'];
const allowMajor = argv.major;
const filters = argv.filter ?? [];
const interactive = argv.interactive;

const isSelected = (dep: string): boolean => filters.length === 0 || filters.some((glob) => matchesGlob(dep, glob));

// The majors the user picks; everything else is skipped. Without --interactive all majors pass.
async function chooseMajors(majors: ReadonlyArray<string>, describe: (major: string) => string): Promise<Set<string>> {
  if (!interactive || majors.length === 0) {
    return new Set(majors);
  }
  const chosen = await checkbox({
    choices: majors.map((major) => ({ name: describe(major), value: major })),
    message: 'Major updates to apply',
  });

  return new Set(chosen);
}

const CHANGELOG = 'CHANGELOG.md';

// One TODO line per applied major under the first "### Changed" of the newest release section.
function writeChangelogStubs(majors: ReadonlyArray<string>): void {
  if (majors.length === 0) {
    return;
  }
  const changelog = readFileSync(CHANGELOG, 'utf8');
  const heading = '### Changed\n';
  const index = changelog.indexOf(heading);
  if (index < 0) {
    console.warn(`No "### Changed" section in ${CHANGELOG}; add the major updates by hand:\n${majors.join('\n')}`);
    return;
  }
  const stubs = majors.map((major) => `- TODO: major update ${major}, describe what changes for users\n`).join('');
  const at = index + heading.length;
  write(CHANGELOG, `${changelog.slice(0, at)}${stubs}${changelog.slice(at)}`);
}

function createLimiter(concurrency: number): <T>(task: () => Promise<T>) => Promise<T> {
  let active = 0;
  const waiting: (() => void)[] = [];

  return async <T>(task: () => Promise<T>): Promise<T> => {
    if (active >= concurrency) {
      await new Promise<void>((resolve) => waiting.push(resolve));
    }
    active += 1;
    try {
      return await task();
    } finally {
      active -= 1;
      waiting.shift()?.();
    }
  };
}

const limitRegistry = createLimiter(REGISTRY_CONCURRENCY);

function write(path: string, content: string): void {
  if (dryRun) {
    console.log(`[dry-run] ${path} would be written`);
    return;
  }
  writeFileSync(path, content);
}

const latestVersionCache = new Map<string, Promise<string>>();
const requiredPeersCache = new Map<string, Promise<Record<string, string>>>();

function getLatestVersion(name: string): Promise<string> {
  let cached = latestVersionCache.get(name);
  if (!cached) {
    cached = limitRegistry(() => latestVersion(name));
    latestVersionCache.set(name, cached);
  }
  return cached;
}

async function fetchRequiredPeers(name: string, version: string): Promise<Record<string, string>> {
  const url = `https://registry.npmjs.org/${name.replace('/', '%2F')}/${version}`;
  const response = await limitRegistry(() => fetch(url));
  if (!response.ok) {
    throw new Error(`Unable to fetch metadata for ${name}@${version}: HTTP ${response.status}`);
  }
  const meta = (await response.json()) as RegistryVersionMeta;
  const peers = meta.peerDependencies ?? {};
  const peersMeta = meta.peerDependenciesMeta ?? {};

  return Object.fromEntries(Object.entries(peers).filter(([peer]) => !peersMeta[peer]?.optional));
}

function getRequiredPeers(name: string, version: string): Promise<Record<string, string>> {
  const key = `${name}@${version}`;
  let cached = requiredPeersCache.get(key);
  if (!cached) {
    cached = fetchRequiredPeers(name, version);
    requiredPeersCache.set(key, cached);
  }
  return cached;
}

function collectDeclaredVersions(pkgs: ReadonlyArray<PackageJson>): Map<string, Set<string>> {
  const declared = new Map<string, Set<string>>();
  for (const pkg of pkgs) {
    for (const field of DEP_FIELDS) {
      for (const [dep, version] of Object.entries(pkg[field] ?? {})) {
        // Aliases (npm:@babel/core@7), paths and git URLs are pinned on purpose and are not registry names.
        if (dep.startsWith('@rockpack/') || version.includes(':') || !isSelected(dep)) {
          continue;
        }
        const versions = declared.get(dep) ?? new Set<string>();
        versions.add(version);
        declared.set(dep, versions);
      }
    }
  }
  return declared;
}

async function buildPlan(pkgs: ReadonlyArray<PackageJson>): Promise<Plan> {
  const entries = await Promise.all(
    [...collectDeclaredVersions(pkgs)].map(
      async ([dep, current]): Promise<[string, PlanEntry]> => [dep, { current, next: await getLatestVersion(dep) }],
    ),
  );
  return new Map(entries);
}

function isMajorUpdate(entry: PlanEntry): boolean {
  const next = parse(entry.next);
  return [...entry.current].some((version) => {
    const current = parse(version);
    return !!current && !!next && current.major !== next.major;
  });
}

function findMajorUpdates(plan: Plan): Set<string> {
  return new Set([...plan].filter(([, entry]) => isMajorUpdate(entry)).map(([dep]) => dep));
}

async function prefetchPeers(plan: Plan): Promise<void> {
  await Promise.allSettled(
    [...plan].flatMap(([dep, entry]) =>
      [entry.next, ...entry.current].filter((version) => valid(version)).map((version) => getRequiredPeers(dep, version)),
    ),
  );
}

function isUpdated(entry: PlanEntry): boolean {
  return [...entry.current].some((version) => version !== entry.next);
}

function effectiveVersions(plan: Plan, dep: string, skipped: ReadonlySet<string>): ReadonlySet<string> {
  const entry = plan.get(dep);
  if (!entry) {
    return new Set();
  }
  return skipped.has(dep) ? entry.current : new Set([entry.next]);
}

async function findPeerConflict(
  plan: Plan,
  dep: string,
  skipped: ReadonlySet<string>,
): Promise<PeerConflict | undefined> {
  for (const version of effectiveVersions(plan, dep, skipped)) {
    if (!valid(version)) {
      continue;
    }
    const peers = await getRequiredPeers(dep, version);
    for (const [peer, range] of Object.entries(peers)) {
      for (const peerVersion of effectiveVersions(plan, peer, skipped)) {
        if (valid(peerVersion) && !satisfies(peerVersion, range)) {
          return { dep, peer, peerVersion, range, version };
        }
      }
    }
  }
  return undefined;
}

function formatConflict({ dep, peer, peerVersion, range, version }: PeerConflict): string {
  return `${dep}@${version} requires ${peer}@"${range}", but ${peer}@${peerVersion} is planned`;
}

/*
 * Every dependency (updated or not) is checked against the peer ranges of the version
 * it will have after the update. When a conflict is found, the update that caused it
 * is skipped: the dependency itself if it is being updated, otherwise its peer.
 * Re-checked until stable, because skipping one update changes the versions
 * available to the others.
 */
async function resolveSkipped(plan: Plan, initiallySkipped: ReadonlySet<string>): Promise<Set<string>> {
  await prefetchPeers(plan);
  const skipped = new Set<string>(initiallySkipped);
  const reported = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const [dep, entry] of plan) {
      const conflict = await findPeerConflict(plan, dep, skipped);
      if (!conflict) {
        continue;
      }
      const culprit = isUpdated(entry) && !skipped.has(dep) ? dep : conflict.peer;
      const culpritEntry = plan.get(culprit);
      if (!culpritEntry || skipped.has(culprit) || !isUpdated(culpritEntry)) {
        const message = `[conflict] ${formatConflict(conflict)}; cannot be resolved automatically`;
        if (!reported.has(message)) {
          reported.add(message);
          console.warn(message);
        }
        continue;
      }
      console.warn(`[skip] ${culprit}@${culpritEntry.next}: ${formatConflict(conflict)}`);
      skipped.add(culprit);
      changed = true;
    }
  }
  return skipped;
}

function fixStarterE2eOrder(sorted: PackageJson): void {
  if (!sorted.devDependencies) {
    return;
  }
  /*
   * eslint-plugin-package-json has different logic of sorting collections:
   * sortPackageJson by default sort the keys like this:
   *  - @types/koa__router
   *  - @types/koa-static
   * eslint-plugin-package-json expects to have order:
   *  - @types/koa-static
   *  - @types/koa__router
   * */
  const orderedKeys = Object.keys(sorted.devDependencies);
  const indexA = orderedKeys.indexOf('@types/koa__router');
  const indexB = orderedKeys.indexOf('@types/koa-static');

  if (indexA >= 0 && indexB >= 0) {
    [orderedKeys[indexA], orderedKeys[indexB]] = [orderedKeys[indexB], orderedKeys[indexA]];
    sorted.devDependencies = Object.fromEntries(
      orderedKeys.map((key) => [key, (sorted.devDependencies as Record<string, string>)[key]]),
    );
  }
}

async function updateAllDeps(): Promise<Set<string>> {
  const paths = ['package.json', ...getWorkspacePackageJsons()];

  const pkgs = paths.map((p) => ({
    data: JSON.parse(readFileSync(p, 'utf8')) as PackageJson,
    path: p,
  }));

  const plan = await buildPlan(pkgs.map(({ data }) => data));
  const majors = [...findMajorUpdates(plan)];
  const describeMajor = (dep: string): string =>
    `${dep}: ${[...(plan.get(dep)?.current ?? [])].join(', ')} -> ${plan.get(dep)?.next}`;
  const chosenMajors = allowMajor ? await chooseMajors(majors, describeMajor) : new Set<string>();
  const skippedMajors = new Set(majors.filter((dep) => !chosenMajors.has(dep)));
  const skipped = await resolveSkipped(plan, skippedMajors);
  writeChangelogStubs([...chosenMajors].filter((dep) => !skipped.has(dep)).map(describeMajor));

  for (const { data: pkg, path: p } of pkgs) {
    const updated: PackageJson = { ...pkg };
    let hasUpdates = false;

    for (const field of DEP_FIELDS) {
      const deps = pkg[field];
      if (!deps) {
        continue;
      }
      const forUpdate: Record<string, string> = {};
      for (const [dep, oldVersion] of Object.entries(deps)) {
        const entry = plan.get(dep);
        if (!entry || skipped.has(dep) || entry.next === oldVersion) {
          continue;
        }
        const newVersion = entry.next;
        console.log(
          `[${pkg.name}] dependency ${dep} from "${field}" will be updated from ${oldVersion} to ${newVersion}`,
        );
        if (parse(newVersion)?.major !== parse(oldVersion)?.major) {
          console.warn(`Major dependency for ${dep} will be updated`);
        }
        forUpdate[dep] = newVersion;
      }
      if (Object.keys(forUpdate).length > 0) {
        updated[field] = { ...deps, ...forUpdate };
        hasUpdates = true;
      }
    }

    if (!hasUpdates) {
      continue;
    }

    console.warn(`[${pkg.name}] package.json will be updated`);
    const sorted = sortPackageJson(updated);
    // sort-package-json 4 sorts the scripts too; their order is the author's (grouped by task), keep it.
    if (updated.scripts) {
      sorted.scripts = updated.scripts;
    }

    if (p.indexOf('starter-e2e') > 0) {
      fixStarterE2eOrder(sorted);
    }

    write(p, JSON.stringify(sorted, null, 2) + '\n');
  }

  return new Set([...skippedMajors].map(describeMajor));
}

async function updateStarterDeps(): Promise<Set<string>> {
  const pth = './packages/starter/src/versions.json';

  const data = JSON.parse(readFileSync(pth, 'utf8')) as VersionsJson;
  const entries = Object.values(data)
    .flatMap((variations) => Object.values(variations))
    .flatMap((depTypes) => Object.values(depTypes))
    .flat()
    .filter(({ name }) => isSelected(name));

  console.log('---');
  console.log('Dependencies checking in @rockpack/starter');
  console.log('---');

  // One decision per package: the same package appears in several templates.
  const latestMajors = new Map<string, number>();
  for (const { name, version } of entries) {
    const major = parse(await getLatestVersion(name))?.major ?? 0;
    if (major > Number(version)) {
      latestMajors.set(name, major);
    }
  }
  const describe = (name: string): string =>
    `starter versions.json ${name}: ${[...new Set(entries.filter((entry) => entry.name === name).map(({ version }) => version))].join(', ')} -> ${latestMajors.get(name)}`;
  const chosen = allowMajor ? await chooseMajors([...latestMajors.keys()], describe) : new Set<string>();

  for (const entry of entries) {
    const major = latestMajors.get(entry.name);
    if (major !== undefined && chosen.has(entry.name) && major > Number(entry.version)) {
      console.log(`[${entry.name}] will be updated from ${entry.version} to ${major}`);
      entry.version = `${major}`;
    }
  }
  if (chosen.size > 0) {
    write(pth, JSON.stringify(data, null, 2) + '\n');
    writeChangelogStubs([...chosen].map(describe));
  }

  return new Set([...latestMajors.keys()].filter((name) => !chosen.has(name)).map(describe));
}

async function bootstrap(): Promise<void> {
  const skippedMajors = [...(await updateAllDeps()), ...(await updateStarterDeps())];

  if (skippedMajors.length > 0) {
    console.log('---');
    console.log('Major updates skipped (--no-major or not chosen):');
    skippedMajors.forEach((entry) => console.log(`  ${entry}`));
  }
}

void bootstrap();
