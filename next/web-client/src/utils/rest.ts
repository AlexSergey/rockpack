/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch';

interface Opts {
  [key: string]: unknown;
}

export interface RestInterface {
  get: (url: string) => Promise<any>;
  post: (url: string, body?: Opts | FormData, options?: Opts) => Promise<any>;
  put: (url: string, body?: Opts | FormData, options?: Opts) => Promise<any>;
  delete: (url: string) => Promise<any>;
}

const commonHeaders = (token: string): { Authorization: string } | Record<string, never> => {
  if (token) {
    return {
      Authorization: token
    };
  }
  return {};
};

export const createRestClient = (getToken: () => string): RestInterface => (
  {
    get: (url) => (
      fetch(url, {
        headers: commonHeaders(getToken()),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        credentials: 'include',
      })
        .then(res => res.json())
        .then(res => {
          if (res.domain) {
            // eslint-disable-next-line promise/no-return-wrap
            return Promise.resolve(res);
          }
          return (
            res.statusCode !== 200 ?
              Promise.reject(res.message) :
              Promise.resolve(res)
          );
        })
    ),

    post: (url, body?, options?) => {
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return fetch(url, Object.assign({}, {
        headers,
        method: 'POST',
        credentials: 'include',
      }, typeof body === 'object' ? {
        body: isFormData ? body : JSON.stringify(body)
      } : {}))
        .then(res => res.json())
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then(res => (
          res.statusCode !== 200 ?
            Promise.reject(res.message) :
            Promise.resolve(res)
        ));
    },

    put: (url, body?, options?) => {
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return fetch(url, Object.assign({}, {
        headers,
        method: 'PUT',
        credentials: 'include',
      }, typeof body === 'object' ? {
        body: isFormData ? body : JSON.stringify(body)
      } : {}))
        .then(res => res.json())
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then(res => (
          res.statusCode !== 200 ?
            Promise.reject(res.message) :
            Promise.resolve(res)
        ));
    },

    delete: (url, options?) => {
      const headers = commonHeaders(getToken());

      if (options && typeof options.headers === 'object') {
        Object.assign(headers, options.headers);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return fetch(url, Object.assign({}, {
        headers,
        method: 'DELETE',
        credentials: 'include',
      }))
        .then(res => res.json())
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then(res => (
          res.statusCode !== 200 ?
            Promise.reject(res.message) :
            Promise.resolve(res)
        ));
    }
  }
);
