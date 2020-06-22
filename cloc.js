const { spawn } = require('child_process');

const exclude_folders = [
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
  'test-reports'
];

const exclude_ext = ['json'];

const cl = spawn('cloc', [`--exclude-dir=${exclude_folders.join(',')}`, `--exclude-ext=${exclude_ext.join(',')}`, '.']);

cl.stdout.on('data', data => {
  console.log(`stdout: ${data}`);
});

cl.stderr.on('data', data => {
  console.log(`stderr: ${data}`);
});

cl.on('close', code => {
  console.log(`child process exited with code ${code}`);
});
