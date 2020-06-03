import fetch from 'node-fetch';

interface Opts {
  [key: string]: unknown;
}

export interface RestInterface {
  get: (url: string) => Promise<unknown>;
  post: (url: string, body?: Opts, options?: Opts) => Promise<unknown>;
  put: (url: string, body?: Opts, options?: Opts) => Promise<unknown>;
  delete: (url: string) => Promise<unknown>;
}

export const createRestClient = (getToken): RestInterface => (
  {
    get: (url): Promise<unknown> => (
      fetch(url, {
        headers: {
          Authorization: getToken()
        },
        // @ts-ignore
        credentials: 'include',
      })
        .then(res => res.json())
    ),

    post: (url, body?, options?): Promise<unknown> => {
      const isFormData = body instanceof FormData;

      const headers = {
        Authorization: getToken()
      };

      if (typeof body === 'object' && !isFormData) {
        Object.assign(headers, {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        });
      }

      if (options && typeof options.headers === 'object') {
        Object.assign(headers, options.headers);
      }

      return fetch(url, Object.assign({}, {
        headers,
        method: 'POST',
        // @ts-ignore
        credentials: 'include',
      }, typeof body === 'object' ? {
        body: isFormData ? body : JSON.stringify(body)
      } : {}))
        .then(res => res.json());
    },

    put: (url, body?, options?): Promise<unknown> => {
      const isFormData = body instanceof FormData;

      const headers = {
        Authorization: getToken()
      };

      if (typeof body === 'object' && !isFormData) {
        Object.assign(headers, {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        });
      }

      if (options && typeof options.headers === 'object') {
        Object.assign(headers, options.headers);
      }

      return fetch(url, Object.assign({}, {
        headers,
        method: 'PUT',
        // @ts-ignore
        credentials: 'include',
      }, typeof body === 'object' ? {
        body: isFormData ? body : JSON.stringify(body)
      } : {}))
        .then(res => res.json());
    },

    delete: (url, options?): Promise<unknown> => {
      const headers = {
        Authorization: getToken()
      };
      if (options && typeof options.headers === 'object') {
        Object.assign(headers, options.headers);
      }
      return fetch(url, Object.assign({}, {
        headers,
        method: 'DELETE',
        // @ts-ignore
        credentials: 'include',
      }))
        .then(res => res.json());
    }
  }
);
