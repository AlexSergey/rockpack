import React from 'react';
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom";
import { loadableComponent } from '@rock/ussr/client';

const OtherComponent = loadableComponent(() => import('./OtherComponent'));

function HomePage(props) {
    return <>
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
        <div>I am home page</div>
        <h1>I am application</h1>
        <div>
            <Link to="/">Home</Link>
            <Link to="/posts">posts</Link>
        </div>
        <OtherComponent />
    </>
}

export default HomePage;
