<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/tester

**@rockpack/tester** is Jest with cool config, add-ons and fully compatible with TS / Babel.

**@rockpack/tester** includes several recommended modules and a test report generator.

**@rockpack/tester** this module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

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

5. Create **something.spec.js** in **src** folder of the project and write Jest test

**Please see "examples" folder** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/tester/examples" target="_blank">here</a>

## Tricks

If you need override *testEnvironment* configuration from JSDom (React App) to Node, you should:

1. Create "jest.extend.js" file in the root of the project

2. Put the code inside:

```js
module.exports = {
  testEnvironment: 'node',
};
```

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
