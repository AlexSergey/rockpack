import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { render } from 'react-dom';
import Examples from './Examples';
import './assets/example.css';
import { LoggerContainerProps } from './sections/Props';
import Description from './sections/Description';
import Features from './sections/Features';
import License from './sections/License';
import Code from './components/Code';

render(
    <>
        <div className="jumbotron">
            <div className="container text-center">
                <h1>localazer</h1>
                <Description />
                <Features />
                <p><a className="btn btn-primary btn-lg" href="https://github.com/AlexSergey/react-custom-scroll" role="button">Github</a></p>
            </div>
        </div>
        <div id="wrapper">
            <LoggerContainerProps />
            <h1>Example:</h1>
            <Examples />
            <Code value={`<TextOverflow width={60}>Lorem i</TextOverflow>`} width="500px" height="250px" />
            <br/>
            <License />
        </div>
    </>,
    document.getElementById('root')
);
