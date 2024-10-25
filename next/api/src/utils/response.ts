type Data = unknown;

interface ResponseInterface {
  code: number;
  data?: Data;
  message: string;
  status: number;
  statusCode: number;
}

export const ok = (message = 'ok', data?: Data): ResponseInterface => {
  const response: ResponseInterface = {
    code: 200,
    message,
    status: 200,
    statusCode: 200,
  };
  if (typeof data === 'object') {
    response.data = data;
  }

  return response;
};
