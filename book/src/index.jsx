import React from 'react';
import createDocumentation from '@rock/dockgen';
import Localization, { l } from '@rock/localazer';
import FlagIconFactory from 'react-flag-icon-css';

const FlagIcon = FlagIconFactory(React, { useCssModules: false });

createDocumentation({
    docgen: [
        {
            title: <Localization>{l('Hello')}</Localization>,
            url: `/`,
            meta: [
                <title>Test aaa</title>,
                <meta name="description" content="Meta test" />
            ]
        }
    ],
    github: 'https://github.com/AlexSergey/rock',
    footer: <div>License MIT, 2019</div>
}, document.getElementById('root'));
