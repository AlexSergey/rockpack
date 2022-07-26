// eslint-disable-next-line no-shadow
export enum Statuses {
  fail = 'fail',
  error = 'error',
  success = 'success',
}

export const getStatus = (statusCode: number): Statuses => {
  if (statusCode < 400) {
    return Statuses.success;
  }

  return statusCode < 500 ? Statuses.fail : Statuses.error;
};
