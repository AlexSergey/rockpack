import React, { Component, useState } from 'react';
import Localization, { LocalizationObserver, l, nl, sprintf, LocalizationString } from '../../../../../localazer/src';
import ru from '../../json/ru.json';

const App = (props) => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const notifier = () => {
    alert(l('Alarm!')());
  };
  console.log(name);

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
        <Localization>{l('Hello world')}</Localization>
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
        <input type="text" placeholder="Put your name" onChange={e => {
          setName(e.target.value);
        }} />
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
    </div>
  )
}

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
      <LocalizationObserver currentLanguage={active} languages={languages}>
        <App onChangeLocale={this.onChangeLocale} />
      </LocalizationObserver>
    )
  }
}
