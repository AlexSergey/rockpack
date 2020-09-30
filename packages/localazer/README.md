<p align="right">
  <img src="http://www.natrube.net/localazer/assets/logo.png" alt="This module can help you organize localization in your application" />
</p>

# @rockpack/localazer

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README_RU.md">Readme (Russian version)</a>
</p>

Most application localization approaches use JSON files as the storage location. JSON is a convenient format for a developer but not for a localizer. The localizer works in specialized software that must maintain correct spelling, find typos, and combine GIT-style developments between versions of the application to form a dictionary.

The most common approach for localizing applications is **gettext**. This is a set of localization programs that organize spell checking, merge different versions of application localizations, and delete unnecessary text data. This application has been used by most of the desktop developers since the 90s.

In order to organize the communication of our **React** application with **gettext** and back, **@rockpack/compiler** and **@rockpack/localizer** can help us.

**@rockpack/localazer** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

## How it works
Stage 1. We need to add localization and make it friends with our application.
Stage 2. Extract all the data for the dictionary from our application and pass it in the gettext format to the translator.
Stage 3. Having received the finished translation, we must overtake it into JSON and insert it into our application.

<p align="right">
  <img src="http://www.natrube.net/localazer/assets/approach.jpg" alt="Localization approach" />
</p>

## Using

1. Installation:

```sh
# NPM
npm install @rockpack/localaser --save
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/localaser
yarn add @rockpack/compiler --dev
```

2. In order for language switching to work correctly, you need to wrap the application in a *<LocalizationObserver>* component

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

3. In the components where you need to translate, you need to add components with the default language:

```jsx
import Localization, { LocalizationObserver, l, nl, sprintf, useI18n } from '@rockpack/localaser';

...

<h2><Localization>{l('Hello')}</Localization></h2>
```

If you want to use variables in translation, you need to use:

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

For plural forms:

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

As a result, with count = 0, the text will be displayed 0 clicks, with count = 1 - 1 click.

5. After the text for localization has been added to the application, you need to extract the dictionary with these text fragments.

5.1 Make **makePOT.js** in the root of project
```js
const { localazer } = require('@rockpack/compiler');

localazer.makePot({
    dist: './po',
    src: './src'
});
```
Run the script
```sh
node makePOT.js
```
As a result, a dictionary with all text fragments for translation will be created.

To translate a dictionary, you must use <a href="https://poedit.net/download">POEdit tool</a>:

<p align="right">
  <img src="http://www.natrube.net/localazer/assets/poedit.png" alt="POEdit" />
</p>

5.2 After translating the dictionary through POEdit, you need to save the **mo** file with the created translation. This file must be added to the project. Then it needs to be converted to JSON:

Make **po2json.js** in the root of project
```js
const { localazer } = require('@rockpack/compiler');

localazer.po2json({
    dist: './json',
    src: './po'
});
```

Run the script
```shell script
node po2json.js
```

6. When you convert the translated snippets to JSON, you can add them to the component with *<LocalizationObserver>* and create a way to switch the language.

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

**@rockpack/localazer** is not responsible for passing translations to the app. You can do this of your choice, for example through dynamic imports, backend API, Redux, Local Storage, etc.

An example of receiving converted transfers via the Backend API:

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

## Properties

- \<LocalizationObserver /> properties:

| Property | Type | Description |
| --- | --- | --- |
| active | String | Set active language |
| default | String['en'] | Default language |
| languages | Object | Object with JSON translations |

## Q&A

How do I use gettext on Windows?
- *It needs to install **gettext** version no earlier than 0.20 (for supporting JS)*
- You can download the latest gettext Windows version [here](https://mlocati.github.io/articles/gettext-iconv-windows.html)
- Before running localazer makePOT, you need to make sure that gettext, xgettext are available in the console
- To edit PO and POT files, you need to install [POEdit](https://poedit.net/download)
***

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
