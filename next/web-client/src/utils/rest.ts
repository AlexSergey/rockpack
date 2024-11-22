/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch';

export interface Rest {
  delete: (url: string) => Promise<any>;
  get: (url: string) => Promise<any>;
  post: (url: string, body?: FormData | IOpts, options?: IOpts) => Promise<any>;
  put: (url: string, body?: FormData | IOpts, options?: IOpts) => Promise<any>;
}

type IOpts = Record<string, unknown>;

const commonHeaders = (token: string): Record<string, never> | { Authorization: string } => {
  if (token) {
    return {
      Authorization: token,
    };
  }

  return {};
};

export const createRestClient = (getToken: () => string): Rest => ({
  delete: <T>(url, options?): Promise<T> => {
    const headers = commonHeaders(getToken());

    if (options && typeof options.headers === 'object') {
      Object.assign(headers, options.headers);
    }

    return fetch(url, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      credentials: 'include',
      headers,
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => (res.statusCode !== 200 ? Promise.reject(res.message) : Promise.resolve(res)));
  },

  get: <T>(url): Promise<T> =>
    fetch(url, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      credentials: 'include',

      headers: commonHeaders(getToken()),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.domain) {
          return Promise.resolve(res);
        }

        return res.statusCode !== 200 ? Promise.reject(res.message) : Promise.resolve(res);
      }),

  post: <T>(url, body?, options?): Promise<T> => {
    const isFormData = body instanceof FormData;

    const headers = commonHeaders(getToken());

    if (typeof body === 'object' && !isFormData) {
      Object.assign(headers, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
    }

    if (options && typeof options.headers === 'object') {
      Object.assign(headers, options.headers);
    }

    return fetch(url, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      credentials: 'include',
      headers,
      method: 'POST',
      ...(typeof body === 'object'
        ? {
            body: isFormData ? body : JSON.stringify(body),
          }
        : {}),
    })
      .then((res) => res.json())
      .then((res) => (res.statusCode !== 200 ? Promise.reject(res.message) : Promise.resolve(res)));
  },

  put: <T>(url, body?, options?): Promise<T> => {
    const isFormData = body instanceof FormData;

    const headers = commonHeaders(getToken());

    if (typeof body === 'object' && !isFormData) {
      Object.assign(headers, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
    }

    if (options && typeof options.headers === 'object') {
      Object.assign(headers, options.headers);
    }

    return fetch(url, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      credentials: 'include',
      headers,
      method: 'PUT',
      ...(typeof body === 'object'
        ? {
            body: isFormData ? body : JSON.stringify(body),
          }
        : {}),
    })
      .then((res) => res.json())
      .then((res) => (res.statusCode !== 200 ? Promise.reject(res.message) : Promise.resolve(res)));
  },
});
