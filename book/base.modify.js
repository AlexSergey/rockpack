const { parse } = require('node-html-parser');
const path = require('path');
const fs = require('fs');

const dist = path.join(__dirname, '..', './docs');
const htmlPath = path.join(dist, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const root = parse(html);
root.querySelector('#html-base').setAttribute('href', '/rockpack/');
fs.writeFileSync(htmlPath, root.toString());
