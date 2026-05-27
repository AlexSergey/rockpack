import { parse } from 'node-html-parser';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', './docs');
const htmlPath = join(dist, 'index.html');
const html = readFileSync(htmlPath, 'utf-8');
const root = parse(html);
root.querySelector('#html-base')?.setAttribute('href', '/rockpack/');
writeFileSync(htmlPath, root.toString());
