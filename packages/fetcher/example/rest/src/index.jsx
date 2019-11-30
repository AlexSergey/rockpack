import React from 'react';
import ReactDOM from 'react-dom';
import { useRest, Headers, Rest, MockRest } from '../../../src';

function InnerApp() {
    let rest = useRest();

    return <div>
        <button onClick={() => rest.post('/getCookies')}>Test request</button>
    </div>
}

function App(props) {
    return <Headers headers={{test: 'testaaa'}}>
            <Rest options={{
                baseURL: 'http://localhost:4000/',
                withCredentials: true
            }}>
                <MockRest
                    mock={mocker => {
                        mocker.onPost('/getCookies').reply(function(config) {
                            console.log('get cookies 4000', config);

                            return [200, {
                                users: [
                                    { id: 1, name: 'John Smith' }
                                ]
                            }];
                        });
                    }}
                >
                    <InnerApp />
                </MockRest>
            </Rest>
        <Rest options={{
            baseURL: 'http://localhost:5000/',
            withCredentials: true
        }}>
            <MockRest
                mock={mocker => {
                    mocker.onPost('/getCookies').reply(function(config) {
                        console.log('get cookies 5000', config);

                        return [200, {
                            users: [
                                { id: 1, name: 'John Smith' }
                            ]
                        }];
                    });
                }}
            >
                <InnerApp />
            </MockRest>
        </Rest>
    </Headers>
}

ReactDOM.render(<App />, document.getElementById('root'));
