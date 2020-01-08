import React, { Component } from 'react';
import Localization, { LocalizationObserver, jed, l, nl, sprintf } from '../../../../../localazer/src';
import ru from '../../json/ru.json';

export default class LocalizationExamples extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            name: 'Vasya',
            active: 'en',
            languages: {
                ru
            }
        }
    }

    notifier = () => {
        const a = 'Alarm!';
        const b = a;
        const c = b;
        const d = c;
        alert(l(d));
    }

    changeLocal = () => {
        this.setState({
            active: this.state.active === 'en' ? 'ru' : 'en'
        }, () => {
            console.log(jed.getJed());
        })
    };

    render() {
        const { count, name, active, languages } = this.state;

        const hello1 = `Hello world`;
        const hello2 = hello1;
        return <LocalizationObserver active={active} languages={languages}>
            <div>

                <p><a onClick={e => {
                    e.preventDefault();
                    this.changeLocal();
                }} className="btn btn-primary btn-lg" href="https://github.com/AlexSergey/react-custom-scroll" role="button">Change localization</a></p>
                <h2>Simple text example:</h2>
                <div>
                    <Localization>{l(hello2)}</Localization>
                </div>
                <h2>Notification example</h2>
                <p><a onClick={e => {
                    e.preventDefault();
                    this.notifier();
                }}>Notification</a></p>
                <br/>

                <div>
                    <h2>Variable to translation</h2>
                    <input type="text" placeholder="Put your name" onChange={e => this.setState({ name: e.target.value })}/>
                    <p>
                        <Localization>
                            {
                                sprintf(
                                    l('Your name is %s and surname is %s', 'USER'),
                                    <span style={{textDecoration: 'underline'}}>
                                        <b>{name}</b>
                                    </span>,
                                    <span style={{textDecoration: 'underline'}}>
                                        <b>Pupkin</b>
                                    </span>
                                )
                            }
                        </Localization>
                    </p>
                </div>

                <h2>Counter example. Plural form + variable</h2>

                <div>
                    <button onClick={() => this.setState({ count: count + 1})}>
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
                        <option>{l('Latest')()}</option>
                        <option>{l('Most Popular')()}</option>
                        <option>{l('Most Viewed')()}</option>
                        <option>{l('Most Commented')()}</option>
                    </select>
                </p>
            </div>
        </LocalizationObserver>
    }
}
