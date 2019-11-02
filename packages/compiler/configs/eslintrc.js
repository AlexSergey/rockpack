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
    "parser": require.resolve("babel-eslint"),
    "rules": {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    }
};