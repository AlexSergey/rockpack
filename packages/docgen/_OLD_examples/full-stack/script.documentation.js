const docgen = require('../../index');
const { getWebpack, getArgs, } = require('../../../compiler');

docgen({
    dist: './documentation',
    documentation: {
        backend: [{
            name: 'api',
            src: './backend/api/',
            config: './backend/api/'
        }],
        client: [{
            name: 'app',
            src: './client/src/'
        }]
    }
});
