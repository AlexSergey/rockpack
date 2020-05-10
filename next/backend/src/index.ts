import 'reflect-metadata';

import { bootstrap } from './bootstrap';
import * as http from './http';

export async function start() {
  await http.start();
}

export async function stop() {
  await http.stop();
}

if (!module.parent) {
  bootstrap(start, stop);
}
