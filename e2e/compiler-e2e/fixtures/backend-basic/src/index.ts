import deepmerge from 'deepmerge';

// Production builds drop console calls unless `debug` is on, so the output goes to stdout directly.
process.stdout.write(`${JSON.stringify(deepmerge({ from: 'backend' }, { merged: true }))}\n`);
