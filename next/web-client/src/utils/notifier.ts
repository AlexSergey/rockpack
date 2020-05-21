import { toast } from 'react-toastify';

export const notify = (level, text, isImportant): void => {
  if (isImportant) {
    switch (level) {
      case 'log':
        toast.success(text);
        break;
      case 'info':
        toast.info(text);
        break;
      case 'warn':
        toast.warn(text);
        break;
      case 'error':
        toast.error(text);
        break;
    }
  }
};
