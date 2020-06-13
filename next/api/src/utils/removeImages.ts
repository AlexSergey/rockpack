import path from 'path';
import childProcess from 'child_process';
import { logger } from '../logger';
import { config } from '../config';

const storageFolder = path.resolve(path.resolve('./'), config.storage);

export const removeImages = (files: string[]): void => {
  const workerProcess = childProcess.exec(`node ${config.workers.removeImages} --storage=${storageFolder} --prefix=${config.files.thumbnailPrefix} --images=${files.join()}`, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error code: ${error.code}`);
      logger.error(`Signal received: ${error.signal}`);
    }
    if (stdout) {
      logger.info(`stdout: ${stdout}`);
    }
    if (stderr) {
      logger.error(`stderr: ${stderr}`);
    }
  });

  workerProcess.on('exit', (code) => {
    logger.info(`RemoveImages worker process exited with exit code ${code}`);
  });
};
