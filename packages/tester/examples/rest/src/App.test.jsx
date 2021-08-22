/**
 * @jest-environment jsdom
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import { Rest, MockRest } from './rest';

let container;

beforeEach(async () => {
  container = document.createElement('div');
  document.body.appendChild(container);

  await act(async () => {
    ReactDOM.render(
      <Rest options={{
        baseURL: 'http://localhost:4000/'
      }}
      >
        <MockRest
          mock={mocker => {
            mocker.onPost('/getData')
              .reply(() => [200, { id: 1, name: 'John Smith' }]);
          }}
        >
          <App />
        </MockRest>
      </Rest>, container
    );
  });
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('Test rest api', () => {
  test('/getData - response should be { id: 1, name: \'John Smith\' }', async () => {
    const button = document.getElementsByTagName('button')[0];
    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(document.getElementById('data').innerHTML)
      .toBe('John Smith');
  });
});
