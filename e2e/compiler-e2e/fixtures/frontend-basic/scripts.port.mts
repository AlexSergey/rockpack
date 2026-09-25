import { frontendCompiler } from '@rockpack/compiler';

void frontendCompiler({ port: Number(process.env['FIXTURE_PORT']) });
