import { message } from 'antd';

import { isDevelopment } from './environments';

export const notify = (level: string, text: string, isImportant: boolean): void => {
  if (isDevelopment() && ['error', 'info', 'log', 'warn'].includes(level)) {
    // eslint-disable-next-line no-console
    console[level](text);
  }
  if (isImportant) {
    switch (level) {
      case 'error':
        message.error(text);
        break;
      case 'info':
        message.info(text);
        break;
      case 'log':
        message.success(text);
        break;
      case 'warn':
        message.warn(text);
        break;
      default:
        message.info(text);
        break;
    }
  }
};
