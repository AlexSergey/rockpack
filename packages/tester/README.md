# @rockpack/tester

**@rockpack/tester** is Jest with cool config, add-ons and fully compatible with TS / Babel.

**@rockpack/tester** includes several recommended modules and a test report generator.

**@rockpack/tester** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

[Readme (Russian version)](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README_RU.md)

### Add-ons:
- [jest-extended](https://github.com/jest-community/jest-extended)
- [expect-more](https://github.com/JamieMason/expect-more/)
- [jest-generator](https://github.com/doniyor2109/jest-generator)
- [jest-chain](https://github.com/mattphillips/jest-chain)
- [@testing-library/jest-dom/extend-expect](https://github.com/testing-library/jest-dom)

### Reporter:
- [jest-html-reporters](https://github.com/Hazyzh/jest-html-reporters)

## Using

1. Installation:

```sh
# NPM
npm install @rockpack/tester --save-dev

# YARN
yarn add @rockpack/tester --dev
```

2. Make **tests.js** in the root of project

3. Put the code in **tests.js**

```js
const tests = require('@rockpack/tester');

tests();
```

4. Run the script
```shell script
node tests.js
```
or DEV mode
```shell script
node tests.js --watch
```

To set the settings for enzyme, you need to create a file **enzyme.setup.js** with the code in the root of the project:

```js
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({
  adapter: new Adapter()
});
```

**Please see "examples" folder** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/tester/examples" target="_blank">here</a>

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
