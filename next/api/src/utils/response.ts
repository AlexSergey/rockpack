type Data = unknown;

interface IResponse {
  code: number;
  status: number;
  statusCode: number;
  message: string;
  data?: Data;
}

export const ok = (message = 'ok', data?: Data): IResponse => {
  const response: IResponse = {
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
