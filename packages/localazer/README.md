<div align="center">
    <a href="http://www.natrube.net/localazer/index.html">
        <img src="http://www.natrube.net/localazer/assets/logo.png" alt="This module can help you organize localization in your application" />
    </a>
</div>
<div align="center">
    <a href="http://www.natrube.net/localazer/index.html">Website</a>
</div>

## Table of Contents

- [What is it](#what-is-it)
- [Articles](#articles)
- [Usage](#usage)
- [Props](#props)
- [Browser Compatibility](#browser-compatibility)
- [License](#license)

## What is it?

We have had many articles for localization our applications. ...

<div align="center">
    <img src="http://www.natrube.net/localazer/assets/approach.jpg" alt="Localization approach" />
</div>

## Articles

More information in my article:

<p>
    English (work in progress)
</p>
<p>
    <a href="">
        Russian
    </a>
</p>

## Usage

1. Installation:

```sh
# NPM
npm install localazer --save
npm install localazer-compiler --save-dev

# YARN
yarn add localazer
yarn add localazer-compiler --dev
```

2. ES6 and CommonJS builds are available with each distribution. For example:

```js
import Localization, { LocalizationObserver, l, nl, sprintf, useI18n } from '@rockpack/localaser';
```

3. You need to wrap your app with <LocalizationObserver>

```jsx
class Root extends Component {
  render() {
    return (
      <LocalizationObserver active={this.state.active} languages={this.state.languages}>
        <App/>
      </LocalizationObserver>)
  }
}
```

4. You need add your localization text to JSX markup:

```jsx
import Localization, { LocalizationObserver, l, nl, sprintf, useI18n } from '@rockpack/localaser';

...

<h2><Localization>{l('Hello')}</Localization></h2>
```

If you need use variables inside your localization string you can yse sprintf method, like this:

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

You can use plural forms:

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

5. After you add localizations in your application you need to get dictionary to translator.

5.1 Create makePO.js in root of your project
```js
const { localazer } = require('@rockpack/compiler');

localazer.makePo({
    dist: './po',
    src: './src'
});
```
Run it!
```sh
node makePO.js
```
Make PO compile hole of your localization nodes to one PO dictionary for translator.

After you get PO file your translator can work with it use POEdit tool:

<div align="center">
    <img src="http://www.natrube.net/localazer/assets/poedit.png" alt="POEdit" />
</div>

You can send this PO file to translator.

5.2 After your translator sent translations you need add these to the GIT and convert to JSON:

Create po2json.js in root of your project
```js
const { localazer } = require('@rockpack/compiler');

localazer.po2json({
    dist: './json',
    src: './po'
});
```

6. When your translations almost have converted you need import it to your application
```jsx
import ru from '../json/ru.json';

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      languages: { ru }
    }
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

You can use it from backend. Just make route that will move JSON's to client.

```jsx
class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      languages: {}
    }
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

  render() {
    return (
      <LocalizationObserver active={this.state.active} languages={this.state.languages}>
        <App/>
      </LocalizationObserver>
    )
  }
}
```

## Props

- \<LocalizationObserver /> props:

| Prop | Type | Description |
| --- | --- | --- |
| active | String | Set active language |
| default | String['en'] | Default application's language |
| languages | Object | JSON's localization files after PO -> JSON converted |

## Browser Compatibility

| Browser | Works? |
| :------ | :----- |
| Chrome  | Yes    |
| Firefox | Yes    |
| Safari  | Yes    |
| IE 11   | Yes    |


## License

<a href="https://github.com/AlexSergey/rock/blob/master/LICENSE.md" target="_blank">MIT</a>
