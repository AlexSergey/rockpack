import { frontendCompiler } from '@rockpack/compiler';

void frontendCompiler().then((result) => {
  if (result.kind === 'build') {
    console.log(`result: ${result.kind} ${String(result.success)}`);
  } else if (result.kind === 'dev-server') {
    console.log(`result: ${result.kind} ${result.url}`);
    void result.stop().then(() => {
      console.log('stopped');
    });
  }
});
