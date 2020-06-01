import { message } from 'antd';

export const notify = (level, text, isImportant): void => {
  if (isImportant) {
    switch (level) {
      case 'log':
        message.success(text);
        break;
      case 'info':
        message.info(text);
        break;
      case 'warn':
        message.warn(text);
        break;
      case 'error':
        message.error(text);
        break;
    }
  }
};
