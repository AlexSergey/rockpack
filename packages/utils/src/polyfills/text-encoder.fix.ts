import { TextDecoder, TextEncoder } from 'node:util';

global.TextEncoder = TextEncoder;
// The shared tsconfig includes the DOM lib, whose TextDecoder also accepts SharedArrayBuffer; drop with Plan 2 D3.
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
