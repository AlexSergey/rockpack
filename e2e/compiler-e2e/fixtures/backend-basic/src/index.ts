import deepmerge from 'deepmerge';

// Node.js production builds keep console calls: they are the server logs.
console.log(JSON.stringify(deepmerge({ from: 'backend' }, { merged: true })));
