## @rockpack/tester

**@rockpack/tester** предоставляет настроенный Jest для работы с проектом с Typescript или Babel.

**@rockpack/tester** включает в себя несколько рекомендуемых модулей и генератор отчетов тестирования.

**@rockpack/tester** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rock/blob/master/README.md" target="_blank">здесь</a>

### Expect addons:
- [jest-extended](https://github.com/jest-community/jest-extended)
- [expect-more](https://github.com/JamieMason/expect-more/)
- [jest-generator](https://github.com/doniyor2109/jest-generator)
- [jest-chain](https://github.com/mattphillips/jest-chain)
- [@testing-library/jest-dom/extend-expect](https://github.com/testing-library/jest-dom)

### Reporters
- [jest-html-reporters](https://github.com/Hazyzh/jest-html-reporters)

### How it works

1. Создать **tests.js** в корне проекта

2. Поместить код в **tests.js**

```js
const tests = require('../../index');

tests();
```

3. Запустить скрипт при помощи
```shell script
node tests.js
```
или DEV режим
```shell script
node tests.js --watch
```

*Чтобы установить настройки для enzyme нужно создать в корне проекта файл*
**enzyme.setup.js**
С кодом
```js
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({
  adapter: new Adapter()
});
```

**To see more examples please visit examples folder** - <a href="https://github.com/AlexSergey/rock/blob/master/packages/tester/examples" target="_blank">here</a>

## License

<a href="https://github.com/AlexSergey/rock/blob/master/LICENSE.md" target="_blank">MIT</a>
