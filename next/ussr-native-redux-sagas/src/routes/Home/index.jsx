import React from 'react';
import Dogs from '../../containers/Dog';
import { MetaTags, withStyles } from '@rock/ussr/client';
import style from './style.modules.scss';

const Home = () => {
    return (
        <>
            <MetaTags key="metatags">
                <title>Home page</title>
                <meta charSet="utf-8" />
                <meta name="theme-color" content="#fff" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="format-detection" content="address=no" />
                <meta httpEquiv="Cache-Control" content="no-cache" />
                <meta name="HandheldFriendly" content="True" />
                <meta name="google" value="notranslate" />
                <meta name="keywords" content="your mega keywords" />
                <meta name="description" content="your mega description" />
                <link rel="canonical" href="https://blabla.com" />
            </MetaTags>
            <div className={style.block}>
                <div>
                    <h1>Home page</h1>
                </div>
                <div>
                    <Dogs />
                </div>
            </div>
        </>
    )
};

export default withStyles(style)(Home);
