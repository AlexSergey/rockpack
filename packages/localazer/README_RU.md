<p align="right">
  <img src="http://www.natrube.net/localazer/assets/logo.png" alt="This module can help you organize localization in your application" />
</p>

# @rockpack/localazer

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README.md">Readme (English version)</a>
</p>

Большинство подходов локализации приложения используют в качестве места хранения JSON файлы. JSON удобный формат для разработчика но не для локализатора. Локализатор работает в специализированном софте, который должен поддерживать корректность правописания, находить опечатки а также объеденять наработки в GIT-о подобном стиле между версиями приложения для формаирования словарика.

Самым распространенным подходом для локализации приложений есть - **gettext**. Это набор программ локализации, которые организовывают проверку орфографии, объединение разных версия локализаций приложения, удаление ненужных текстовых данных. Это приложение используется большинством десктоп разработчиков начиная с 90-ых годов.

Для того, чтобы организовать связь нашего **React** приложения с **gettext** и обратно нам могут помочь **@rockpack/compiler** и **@rockpack/localizer**

**@rockpack/localazer** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md" target="_blank">здесь</a>

## Как это работает
Этап 1. Нам нужно добавить локализацию и подружить её с нашим приложением.
Этап 2. Извлечь все данные для словарика из нашего приложения и передать их в формате gettext переводчику.
Этап 3. Получив готовый перевод, мы должны его перегнать в JSON и вставить в наше приложение.

<p align="right">
  <img src="http://www.natrube.net/localazer/assets/approach.jpg" alt="Localization approach" />
</p>

## Использование

1. Установка:

```sh
# NPM
npm install @rockpack/localaser --save
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/localaser
yarn add @rockpack/compiler --dev
```

2. Для того, чтобы переключение языков работало корректно, нужно обернуть приложение в *<LocalizationObserver>* компонент

```jsx
import { LocalizationObserver } from '@rockpack/localaser';

class Root extends Component {
  render() {
    return (
      <LocalizationObserver active={this.state.active} languages={this.state.languages}>
        <App/>
      </LocalizationObserver>
    )
  }
}
```

3. В компонентах, где необходимо осуществить перевод, нужно добавить компоненты с языком по умолчанию:

```jsx
import Localization, { LocalizationObserver, l, nl, sprintf, useI18n } from '@rockpack/localaser';

...

<h2><Localization>{l('Hello')}</Localization></h2>
```

Если вы хотите использовать переменные в переводе, нужно использовать:

```jsx
<Localization>
  {
    sprintf(
      l('Your name is %s', 'USER'),
      name
    )
  }
</Localization>
```

Для множественной формы:

```jsx
<Localization>
  {
    sprintf(
      nl(
        '%d click',
        '%d clicks',
        count
      ),
      count
    )
  }
</Localization>
```

В результате при count = 0, будет выведен текст 0 clicks, при count = 1 - 1 click.

5. После того, как текст для локализации был добавлен в приложение, нужно извлечь словарик с данными текстовыми фрагментами.

5.1 Создайте **makePOT.js** в корне проекта
```js
const { localazer } = require('@rockpack/compiler');

localazer.makePot({
    dist: './po',
    src: './src'
});
```
Запустите скрипт при помощи nodejs:
```sh
node makePOT.js
```
В результате будет создан словарик со всеми текстовыми фрагментами для перевода.

Для перевода словарика необходимо использовать <a href="https://poedit.net/download">POEdit tool</a>:

<p align="right">
  <img src="http://www.natrube.net/localazer/assets/poedit.png" alt="POEdit" />
</p>

5.2 После перевода словарика через POEdit, необходимо сохранить **mo** файл с созданным переводом. Этот файл должен быть добавлен в проект. После чего его нужно преобразовать в JSON:

Создайте **po2json.js** в корне вашего проекта
```js
const { localazer } = require('@rockpack/compiler');

localazer.po2json({
    dist: './json',
    src: './po'
});
```

Запустите скрипт
```shell script
node po2json.js
```

6. Когда вы сконвертируете переведенные фрагменты в JSON их можно добавить в компонент с *<LocalizationObserver>* а также создать способ переключения языка.

```jsx
import ru from '../json/ru.json';

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLanguage: 'en',
      languages: { ru }
    }
  }

  setActiveLanguage = (activeLanguage) => {
    this.setState({ activeLanguage })
  }

  render() {
    return (
      <LocalizationObserver active={this.state.active} languages={this.state.languages}>
        <App setActiveLanguage={setActiveLanguage} />
      </LocalizationObserver>
    )
  }
}
```

**@rockpack/localazer** не отвечает за передачу переводов в приложение. Вы можете сделать это на ваш выбор, например через динамические импорты, через backend API, Redux, Local Storage и т.д.

Пример получения сконвертированных переводов через Backend API может выглядеть как то так:

```jsx
class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLanguage: 'en',
      languages: {}
    }
  }

  componentDidMount() {
    this.getLanguages();
  }

  getLanguages = () => {
    fetch('http://localhost:8000/api/languages')
      .then(response => {
        return response.json();
      })
      .then(({ languages }) => {
        this.setState({ languages });
      });
  }

  setActiveLanguage = (activeLanguage) => {
    this.setState({ activeLanguage })
  }

  render() {
    return (
      <LocalizationObserver active={this.state.active} languages={this.state.languages}>
        <App/>
      </LocalizationObserver>
    )
  }
}
```

## Свойства

- \<LocalizationObserver /> свойства:

| Свойство | Тип | Описание |
| --- | --- | --- |
| active | String | Установить активный язык |
| default | String['en'] | Язык по умолчанию |
| languages | Object | Объект с переводами JSON |

## Вопросы/Ответы

Как использовать gettext под Windows?
- *Для создания словарика, извлечения текстовых фрагментов из приложения, нужно установить gettext под windows версии не ранее 0.20, так как в ранних версиях нет поддержки JavaScript*
- Скачать последнюю актуальную версию можно [здесь](https://mlocati.github.io/articles/gettext-iconv-windows.html)
- Прежде чем запускать localazer makePOT нужно убедиться, что в консоли доступны gettext, xgettext
- Для редактирования PO и POT файлов нужно установить [POEdit](https://poedit.net/download)
***

## Лицензия MIT

<a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F-mit" target="_blank">MIT</a>
