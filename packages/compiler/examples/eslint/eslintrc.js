module.exports = {
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        },
    },
    "plugins": [
        "react",
        "react-hooks"
    ],
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "mocha": true,
        "commonjs": true
    },
    "parser": "babel-eslint",
    "rules": {
        "jsx-quotes": [2, "prefer-double"], //JSX double quotes
        "react/jsx-uses-react": 2, //no-unused exclude error for import React
        "indent": [2, 4], //4 spaces indent
        "quotes": [2, "single"], //single quote in JS code,
        // Rules of hook - https://reactjs.org/docs/hooks-rules.html
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    }
};