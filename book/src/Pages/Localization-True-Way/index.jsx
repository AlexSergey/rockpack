import React from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeDictionaryExample from 'raw-loader!./code/code-dictionaty.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeInstallationExample from 'raw-loader!./code/code-installation.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeWrapperExample from 'raw-loader!./code/code-wrapper.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeLocalazerImportExample from 'raw-loader!./code/code-localazer-import.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeLocalazerExample from 'raw-loader!./code/code-localazer.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeSprintfExample from 'raw-loader!./code/code-spintf.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeNlExample from 'raw-loader!./code/code-nl.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeMakePotExample from 'raw-loader!./code/code-makepot.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeMakePotOptionsExample from 'raw-loader!./code/code-makepot-options.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codePo2JsonExample from 'raw-loader!./code/code-po2json.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codePo2JsonOptionsExample from 'raw-loader!./code/code-po2json-options.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeRunPo2JsonExample from 'raw-loader!./code/code-run-po2json.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeLocalazerLanguagesExample from 'raw-loader!./code/code-localazer-languages.example';
import img1 from './assets/img-1.png';
import img2 from './assets/img-2.png';
import img3 from './assets/img-3.png';
import approach from '../../../readme_assets/localazer-approach.jpg';
import img4 from './assets/img-4.png';
import img5 from './assets/img-5.png';
import Code from '../../components/Code';

const Page = () => (
  <div>
    <p>
      This approach was developed after going a long way from suffering and pain. How I came to this and how to properly
      localize applications will be discussed in this article.
    </p>

    <h3>What is the problem?</h3>

    <p>
      There are hundreds of reports on this topic, thousands of articles. So what can I tell you new, you are gonna ask?
      The fact is that many of these articles have nothing to do with the real world and can only confuse us as
      developers.
    </p>

    <p>
      Firstly, I want to tell you a story about how I passed a long way doing localization for one of my previous
      projects.
    </p>

    <h3>Beginning</h3>

    <p>
      Let's get back to 2016. We have developed an application with localization. After reading relevant articles, we
      made a JSON dictionary with Russian and English translations, where in the depth of nesting we had textual
      representations of our strings
    </p>

    <Code code={codeDictionaryExample} language="json" />

    <p>
      When switching the language, the root component replaced this huge object, and all child components, as if by
      magic, rendered the correct translation to the user ... Everything worked well, we were very proud of our work
      until it happened ...
    </p>

    <p>
      Our customer decided to add support for a third language - Spanish! After a little thought, we copied the English
      version of JSON, and sent it by mail to the translator.
    </p>

    <p>
      The translator was shocked to receive the JSON. He didn't know how to work with this format. He didn't have
      software for editing JSON, no way to check spelling, view changes, etc. Eventually, the translator refused to work
      with this.
    </p>

    <img className="flexible-image" src={img1} alt="Fun" />

    <p>
      We began to realize that our path was not entirely correct, but there was nowhere to retreat, we decided to see it
      through to the end, and ... We wrote a JSON -> CSV parser!
    </p>

    <p>
      CSV format was more friendly for our translator, he was able to work with it. Having sent us the edited CSV, we
      wrote a reverse CSV -> JSON parser. Everything seemed to be going well, and then ...
    </p>

    <p>
      The tests have begun! The corrections came. There were many of them. We sent the updated CSV to our
      translator oftenly and translator sent it back to us. All this went through the mail of our manager. At some
      point, we lost the current version, all our corrections were mixed into a large pile of different options, which
      we could no longer understand.
    </p>

    <p>
      Since the JSON was nested, we got <i>undefined</i> fields due to the version difference, and our application
      stopped working!
    </p>

    <p>
      And we invented the wheel! We spent almost a couple of months our team's time on development. What was it? It
      was a page in the admin area where we could work with the most current locale, changing the translation to
      a friendly interface. English was taken as the default language. This is how it looked like.
    </p>

    <img className="flexible-image" src={img2} alt="Admin area" />

    <p>
      It was a Single Page Application that implemented CRUD to work with our JSONs. We could delete, add lines, and
      update them. There was no spell checker for translators, they had to work on our dev server, after each update we
      manually saved JSON to our GIT repository.
    </p>

    <p>It was a nightmare! Now, let's figure it out.</p>

    <h3>Concepts</h3>

    <p>
      First, you need to understand what localization is and what internationalization is.
    </p>

    <p>
      <strong>I18N - Internationalization</strong><br />
      It is a set of techniques that make subsequent localization possible, for example:
      RTL (Right To Left)
      Support for special input tools
    </p>

    <p>
      <strong>L10N - Localization</strong><br />
      This is the adaptation of the application at the component level, for example:
      - Text translations
      - Processing of dates, currencies, color palettes
    </p>

    <h3>Gettext as a solution!</h3>

    <p>
      Forget JSON as a format for translators! We are programmers, we need JSON, but translators have to work with
      something else.
    </p>

    <p>
      In order to develop the right localization system, let's see what most translators work with. Many Desktop
      programs use the <strong>Gettext</strong> tool to translate.
    </p>

    <p>
      <strong>Gettext</strong> is a free tool capable of generating translations based on the default language.
    </p>

    <p>Benefits:</p>

    <ul>
      <li>It has been around since the 90s</li>
      <li>Supports many languages, including JS</li>
      <li>
        The text in English is used as ID, it is convenient - if there is no translation - we take the English version
        as a fallback.
      </li>
      <li>
        Support for a git-like merge system. That is, if we have removed or added text nodes in our application, then
        gettext is able to automatically remove or add them from the dictionary.
      </li>
      <li>Support for plural forms in the text.</li>
      <li>Support for variables within the translated text.</li>
      <li>
        Special editor, with support for spelling control, various plugins. It exists for all operating systems and is
        a standard for translators.
      </li>
    </ul>

    <p>Software for working and creating a dictionary (POEdit):</p>

    <img className="flexible-image" src={img3} alt="POEdit" />

    <p>
      Source Text is our default language (English). All other languages are translated from the default language. It is
      also the default language in the application, and if for some reason there is no analogue for a word in Russian in
      the translation, then we will not have an error, a string in English is displayed.
    </p>

    <h3>How it works</h3>

    <p>1. We need to add the default language to the application.</p>

    <p>2. Convert fields with default text to gettext format and send it to the translator.</p>

    <p>3. Having received the finished translation, convert it to JSON and insert it into our application.</p>

    <img className="flexible-image-half" src={approach} alt="Approach" />

    <h3><a href="https://github.com/AlexSergey/localazer/README.md">localazer</a></h3>

    <p>1. Installation:</p>

    <Code code={codeInstallationExample} language="bash" />

    <ul>
      <li>
        <a href="https://github.com/AlexSergey/localazer/README.md">@localaser/component</a> React component for translations.
      </li>
      <li>
        <a href="https://github.com/AlexSergey/localazer/README.md">@localazer/webpack-plugin</a> Webpack plugin to make pot file
      </li>
      <li>
        <a href="https://github.com/AlexSergey/localazer/README.md">@localazer/po2json</a> po2json tool
      </li>
    </ul>

    <p>2. We need to wrap up the application with a component</p>

    <Code code={codeWrapperExample} language="jsx" />

    <p>
      <strong>languages</strong> is a set of JSONs received after translation; you can load it asynchronously from the
      server, or integrate it into your application bundle.
    </p>

    <h3>Using <a href="https://github.com/AlexSergey/localazer/README.md">localazer</a></h3>

    <p>
      In the components of our application where we want to have text localization, we must:
    </p>

    <Code code={codeLocalazerImportExample} language="jsx" />

    <p>And in the JSX markup code, add</p>

    <Code code={codeLocalazerExample} language="jsx" />

    <p>
      The Localization component is needed to communicate with the LocalizationObserver. Thus, when switching one
      language to another, we automatically update all Localizaion components.
    </p>

    <p>
      After that, when forming the dictionary, all values of the <strong>l()</strong> functions of our localaser will be
      taken, namely the text <i>"Hello"</i> for its further localization.
    </p>

    <h3>Localization with variables</h3>

    <p>If we need to pass a variable to localization text:</p>

    <Code code={codeSprintfExample} language="jsx" />

    <p><strong>sprintf</strong> passes the variable into the localization text.</p>

    <h3>Plural forms</h3>

    <p>For example, we have a counter. With a value of 1, we should display - 1 click, with 2 or more - 2 clicks</p>

    <p>
      To do this, pass the count variable to the sprintf function. It serves to transfer variables to the localized
      node. The <strong>nl</strong> method is responsible for choosing a plural or singular form, based on the
      variables passed to this method.
    </p>

    <Code code={codeNlExample} language="jsx" />

    <h3>Dictionary</h3>

    <p>
      Now we need to extract from our application all the texts involved in translation and arrange them in the form of
      a dictionary for the translator so that he can create translations for us in other languages.
    </p>

    <p>
      Let's add @localazer/webpack-plugin to your webpack.config.
    </p>

    <p>
      The purpose of this script is to go through all the <i>JS(x)</i> files of our application and compose a dictionary
      of <strong>l()/nl()</strong> nodes for gettext.
    </p>

    <Code code={codeMakePotExample} language="jsx" />

    <p><strong>@localazer/webpack-plugin</strong> has properties:</p>

    <Code code={codeMakePotOptionsExample} language="jsx" />

    <p>
      <strong>variables</strong> - Variables to process. If you use other localaser variable names in the project,
      you should override
    </p>

    <h3>Creating a gettext dictionary</h3>

    <p>Now, rebuild your app with @localazer/webpack-plugin</p>

    <p>
      After that, a dictionary with the pot extension will be created on the specified path dist. Subsequently, we see
      the generated <strong>messages.pot</strong> file. Which we can open with
      <a href="https://poedit.net/download">PoEdit</a>
    </p>

    <p>We see the <strong>PoEdit</strong> window</p>

    <img className="flexible-image" src={img4} alt="Poedit" />

    <p>
      By clicking on the <strong>Create New Translation</strong> button, we will create a new file with the PO extension
      for the new translation of our application. If this PO already exists, for example, the translator is already
      working with our dictionary, then <strong>makePOT.js</strong> will add new or remove unused lines by synchronizing
      the dictionary with our application.
    </p>

    <p>
      When creating a dictionary, we have a Translation window, where we can add a translation for this text node. On
      the right we see tips for the selected language, for example, the word "Hello" is prompted by the program, which
      can be translated as "Привет".
    </p>

    <p>
      For plural forms, gettext has support according to the selected target language
    </p>

    <img className="flexible-image" src={img5} alt="Poedit" />

    <p>
      For example, in Russian - 1 click - "1 клик", 10 clicks - "10 кликов". We can describe this behavior on our
      own, I recommend that you learn poedit for more efficient work.
    </p>

    <p>
      After we complete the translation, we save it to a PO file. It should be in the GIT repository, in the folder with
      the POT file. In the future, gettext will independently add new or remove unused texts of our application when
      calling <strong>makePOT.js</strong>
    </p>

    <h3>PO -> JSON</h3>

    <p>
      Let's create a second script at the <strong>makePOT.js</strong> level, let's call it <strong>po2json.js</strong>
    </p>

    <Code code={codePo2JsonExample} language="jsx" />

    <p><strong>po2json</strong> has options</p>

    <Code code={codePo2JsonOptionsExample} language="jsx" />

    <p>After that, let's call the script</p>

    <Code code={codeRunPo2JsonExample} language="bash" />

    <p>Our script will generate a JSON version of the translations.</p>

    <h3>JSON connection</h3>

    <p>It remains to connect json to <strong>LocalizationContainer</strong>.</p>

    <p>You can do this in a convenient way for you:</p>

    <ul>
      <li>Using a request to the server</li>
      <li>Integrating into a bundle</li>
      <li>Using localStorage</li>
      <li>Any other</li>
    </ul>

    <p>Just for example:</p>

    <Code code={codeLocalazerLanguagesExample} language="jsx" />

    <h3>Conclusion</h3>

    <p>
      <a href="https://github.com/AlexSergey/localazer/README.md">localazer</a> and <strong>gettext</strong> are very powerful tools for localizing your applications. With this approach, you will be
      able to effectively work with the translator using the format of programs that are convenient for him. You don't
      have to worry about your JSON files being out of date.
    </p>
  </div>
);

const page = {
  title: 'Localization. True way',
  url: '/localization-true-way',
  menuClassName: 'small-menu-item',
  meta: [
    <meta name="description" content="Rockpack ..." key="description" />
  ],
  share: true,
  component: Page
};

export default page;
