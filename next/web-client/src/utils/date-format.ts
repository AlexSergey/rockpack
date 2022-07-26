import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const dateFormatter = (date: Date | string): string => {
  const now = dayjs(date instanceof Date ? date.toString() : date);

  return dayjs().from(now);
};
