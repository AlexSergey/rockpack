const { TextDecoder, TextEncoder } = require('node:util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
