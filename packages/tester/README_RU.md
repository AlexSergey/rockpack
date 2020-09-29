# @rockpack/tester

**@rockpack/tester** предоставляет настроенный Jest для работы с проектом с Typescript или Babel.

**@rockpack/tester** включает в себя несколько рекомендуемых модулей и генератор отчетов тестирования.

**@rockpack/tester** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md" target="_blank">здесь</a>

[Readme (English version)](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md)

### Дополнения:
- [jest-extended](https://github.com/jest-community/jest-extended)
- [expect-more](https://github.com/JamieMason/expect-more/)
- [jest-generator](https://github.com/doniyor2109/jest-generator)
- [jest-chain](https://github.com/mattphillips/jest-chain)
- [@testing-library/jest-dom/extend-expect](https://github.com/testing-library/jest-dom)

### Генератор отчетов
- [jest-html-reporters](https://github.com/Hazyzh/jest-html-reporters)

## Использование

1. Установка:

```sh
# NPM
npm install @rockpack/tester --save-dev

# YARN
yarn add @rockpack/tester --dev
```

2. Создать **tests.js** в корне проекта

3. Поместить код в **tests.js**

```js
const tests = require('@rockpack/tester');

tests();
```

4. Запустить скрипт при помощи
```shell script
node tests.js
```
или DEV режим
```shell script
node tests.js --watch
```

Чтобы установить настройки для enzyme нужно создать в корне проекта файл **enzyme.setup.js** c кодом

```js
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({
  adapter: new Adapter()
});
```

**В папке "examples" находится больше примеров** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/tester/examples" target="_blank">here</a>

## Лицензия MIT

<a href="https://github.com/AlexSergey/rockpack#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F-mit" target="_blank">MIT</a>
