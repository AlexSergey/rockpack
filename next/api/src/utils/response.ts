interface Data {
  [key: string]: unknown;
}

interface Response {
  code: number;
  status: number;
  statusCode: number;
  message: string;
  data?: Data;
}

export const ok = (message = 'ok', data?: Data): Response => (
  Object.assign({}, {
    code: 200,
    status: 200,
    statusCode: 200,
    message,
  }, { ...typeof data === 'object' ? { data } : {} })
);
