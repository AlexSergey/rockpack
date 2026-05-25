import { TextDecoder, TextEncoder } from 'node:util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
