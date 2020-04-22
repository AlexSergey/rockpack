import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { render } from 'react-dom';
import './assets/example.css';
import Examples from './Examples';
import Props from './sections/Props';
import Title from './sections/Title';
import Description from './sections/Description';
import WhatIsIt from './sections/What_is_is';
import Approach from './sections/Approach';
import Usage from './sections/Usage';
import BrowserCompatibility from './sections/BrowserCompatibility';
import Features from './sections/Features';
import License from './sections/License';

render(
    <>
        <div className="jumbotron">
            <div className="container text-center">
                <Title />
                <Description />
                <p><a className="btn btn-primary btn-lg" href="https://github.com/AlexSergey/logrock" role="button" target="_blank">Github</a></p>
            </div>
        </div>
        <div id="wrapper">
            <WhatIsIt />
            <hr/>
            <Approach />
            <hr/>
            <Usage />
            <hr/>
            <Props />
            <hr/>
            <Examples />
            <hr/>
            <BrowserCompatibility />
            <hr/>
            <License />
        </div>
    </>,
    document.getElementById('root')
);