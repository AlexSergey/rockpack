export const getStatus = (statusCode) => {
  if (statusCode < 400) {
    return 'success';
  }
  return statusCode < 500 ? 'fail' : 'error';
}
