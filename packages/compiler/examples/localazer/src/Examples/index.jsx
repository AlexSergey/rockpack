import React, { Component, useState } from 'react';
import Localization, { LocalizationObserver, l, nl, sprintf, useI18n } from '../../../../../localazer/dist';
import ru from '../../json/ru.json';

const App = (props) => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const notifier = () => {
    const a = 'Alarm!';
    const b = a;
    const c = b;
    const d = c;
    alert(l(d)(i18n));
  };

  const i18n = useI18n();
  const hello1 = 'Hello world';
  const hello2 = hello1;
  return (
    <div>
      <p>
        <a
          onClick={e => {
            e.preventDefault();
            props.onChangeLocale();
          }}
          className="btn btn-primary btn-lg"
          href="https://github.com/AlexSergey/react-custom-scroll"
          role="button"
        >
          Change localization
        </a>
      </p>
      <h2>Simple text example:</h2>
      <div>
        <Localization>{l(hello2)}</Localization>
      </div>
      <h2>Notification example</h2>
      <p>
        <a
          onClick={e => {
            e.preventDefault();
            notifier();
          }}
          href="#"
          role="button"
        >
          Notification
        </a>
      </p>
      <br />
      <div>
        <h2>Variable to translation</h2>
        <input type="text" placeholder="Put your name" onChange={e => this.setState({ name: e.target.value })} />
        <p>
          <Localization>
            {
              sprintf(
                l('Your name is %s and surname is %s', 'USER'),
                <span style={{ textDecoration: 'underline' }}>
                    <b>{name}</b>
                  </span>,
                <span style={{ textDecoration: 'underline' }}>
                    <b>Pupkin</b>
                  </span>
              )
            }
          </Localization>
        </p>
      </div>
      <div>
        <h2>Variable to translation</h2>
        <input type="text" placeholder="Put your name" onChange={e => setName({ name: e.target.value })} />
        <p>
          <Localization>
            {
              sprintf(
                l('Your name is %s and surname is %s', 'USER'),
                <span style={{ textDecoration: 'underline' }}>
                    <b>{name}</b>
                  </span>,
                <span style={{ textDecoration: 'underline' }}>
                    <b>Pupkin</b>
                  </span>
              )
            }
          </Localization>
        </p>
      </div>

      <h2>Counter example. Plural form + variable</h2>

      <div>
        <button onClick={() => setCount(count + 1)}>
          +1
        </button>
        <p>
          <Localization>
            {
              sprintf(
                nl(
                  '%d click',
                  '%d clicks',
                  count
                ),
                count
              )
            }
          </Localization>
        </p>
      </div>

      <h4><Localization>{l('Sort By')}</Localization></h4>
      <p>
        <select>
          <option>{l('Latest')(i18n)}</option>
          <option>{l('Most Popular')(i18n)}</option>
          <option>{l('Most Viewed')(i18n)}</option>
          <option>{l('Most Commented')(i18n)}</option>
        </select>
      </p>
    </div>
  )
}

/*class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      name: 'Vasya',
      active: 'en',
      languages: {
        ru
      }
    };
  }

  notifier = () => {
    const a = 'Alarm!';
    const b = a;
    const c = b;
    const d = c;
    alert(l(d));
  };

  render() {
    const { count, name, active, languages } = this.state;

    const hello1 = 'Hello world';
    const hello2 = hello1;
    const i18n = useI18n();
    console.log(i18n);
    return (
      <div>
        <p>
          <a
            onClick={e => {
              e.preventDefault();
              this.props.onChangeLocale();
            }}
            className="btn btn-primary btn-lg"
            href="https://github.com/AlexSergey/react-custom-scroll"
            role="button"
          >
            Change localization
          </a>
        </p>
        <h2>Simple text example:</h2>
        <div>
          <Localization>{l(hello2)}</Localization>
        </div>
        <h2>Notification example</h2>
        <p>
          <a
            onClick={e => {
              e.preventDefault();
              this.notifier();
            }}
            href="#"
            role="button"
          >
            Notification
          </a>
        </p>
        <br />
        <div>
          <h2>Variable to translation</h2>
          <input type="text" placeholder="Put your name" onChange={e => this.setState({ name: e.target.value })} />
          <p>
            <Localization>
              {
                sprintf(
                  l('Your name is %s and surname is %s', 'USER'),
                  <span style={{ textDecoration: 'underline' }}>
                    <b>{name}</b>
                  </span>,
                  <span style={{ textDecoration: 'underline' }}>
                    <b>Pupkin</b>
                  </span>
                )
              }
            </Localization>
          </p>
        </div>
        <div>
          <h2>Variable to translation</h2>
          <input type="text" placeholder="Put your name" onChange={e => this.setState({ name: e.target.value })} />
          <p>
            <Localization>
              {
                sprintf(
                  l('Your name is %s and surname is %s', 'USER'),
                  <span style={{ textDecoration: 'underline' }}>
                    <b>{name}</b>
                  </span>,
                  <span style={{ textDecoration: 'underline' }}>
                    <b>Pupkin</b>
                  </span>
                )
              }
            </Localization>
          </p>
        </div>

        <h2>Counter example. Plural form + variable</h2>

        <div>
          <button onClick={() => this.setState({ count: count + 1 })}>
            +1
          </button>
          <p>
            <Localization>
              {
                sprintf(
                  nl(
                    '%d click',
                    '%d clicks',
                    count
                  ),
                  count
                )
              }
            </Localization>
          </p>
        </div>

        <h4><Localization>{l('Sort By')}</Localization></h4>
        <p>
          <select>
            <option><Localization>{l('Latest')}</Localization></option>
            <option><Localization>{l('Most Popular')}</Localization></option>
            <option><Localization>{l('Most Viewed')}</Localization></option>
            <option><Localization>{l('Most Commented')}</Localization></option>
          </select>
        </p>
      </div>
    )
  }
}*/

export default class LocalizationExamples extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 'en',
      languages: {
        ru
      }
    };
  }


  onChangeLocale = () => {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      active: this.state.active === 'en' ? 'ru' : 'en'
    });
  };


  render() {
    const {active, languages } = this.state;
    return (
      <LocalizationObserver active={active} languages={languages}>
        <App onChangeLocale={this.onChangeLocale} />
      </LocalizationObserver>
    )
  }
}
