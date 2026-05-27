import { spawn } from 'node:child_process';

const excludeFolders = [
  'node_modules',
  '.git',
  '.idea',
  'NO_COMMIT',
  'prototypes',
  'build',
  'dist',
  'public',
  'markup',
  '.cache',
  'migrations',
  'fixtures',
  'seeders',
  'coverage',
  'seo_report',
  '.storybook',
  'test-reports',
];

const excludeExt = ['json'];

const cl = spawn('cloc', [`--exclude-dir=${excludeFolders.join(',')}`, `--exclude-ext=${excludeExt.join(',')}`, '.']);

cl.stdout.on('data', (data: Buffer) => {
  console.log(`stdout: ${data}`);
});

cl.stderr.on('data', (data: Buffer) => {
  console.log(`stderr: ${data}`);
});

cl.on('close', (code: number | null) => {
  console.log(`child process exited with code ${code}`);
});
