import { createServer } from 'node:http';
import { Socket } from 'node:net';

import { config } from '../config';
import { logger } from '../logger';

import { app } from './koa';

const connectedSockets = new Set<Socket>();

const httpServer = createServer();

httpServer.on('request', app.callback());

httpServer.on('connection', (socket) => {
  connectedSockets.add(socket);
  socket.once('close', () => connectedSockets.delete(socket));
});

export async function start(): Promise<void> {
  if (httpServer.listening) throw new Error('HTTP Server is already listening');

  const serverListenPromise = new Promise<void>((resolve, reject) => {
    httpServer.listen(config.http.port, resolve);
    httpServer.once('error', reject);
  });

  await serverListenPromise;
  logger.info(`HTTP server started on ${config.http.port}`);
}

export async function stop(): Promise<void> {
  if (!httpServer.listening) throw new Error('HTTP Server is not listening');

  const serverClosePromise = new Promise((resolve, reject) => {
    httpServer.once('close', resolve);
    httpServer.close((err) => {
      if (err) reject(err);
    });
  });

  connectedSockets.forEach((socket) => socket.destroy());
  await serverClosePromise;
  logger.info('Http server stopped');
}
