import React from 'react';
import dracula from 'prism-react-renderer/themes/dracula';
import Highlight, { defaultProps } from 'prism-react-renderer';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeDictionaryExample from 'raw-loader!./code/code-dictionaty.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeInstallationExample from 'raw-loader!./code/code-installation.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeWrapperExample from 'raw-loader!./code/code-wrapper.example';
import img1 from './assets/img-1.png';
import img2 from './assets/img-2.png';
import img3 from './assets/img-3.png';
import img4 from '../../../readme_assets/localazer-approach.jpg';

const Page = () => (
  <div>
    <p>
      This approach was developed after going a long way from suffering and pain. How I came to this and how to properly
      localize applications will be discussed in this article.
    </p>

    <h3>What is the problem?</h3>

    <p>
      There are hundreds of reports on this topic, thousands of articles. So what can I tell you new, you ask? The fact
      is that many of the articles have nothing to do with the real world and can only confuse us developers.
    </p>

    <p>
      First, I want to tell you a story about how I came a long way doing localization for one of my previous projects.
    </p>

    <h3>Beginning</h3>

    <p>
      And so, 2015. We have developed an application with localization. After reading relevant articles, we made a JSON
      dictionary with Russian and English translations, where in the depth of nesting we had textual representations of
      our strings
    </p>

    <Highlight {...defaultProps} theme={dracula} code={codeDictionaryExample} language="bash">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>
      When switching the language, the root component replaced this huge object, and all child components, as if by
      magic, rendered the correct translation to the user ... Everything worked well, we were very proud of our work
      until it happened ...
    </p>

    <p>
      Our customer decided to add support for a third language - Spanish! After a little thought, we copied the English
      version of JSON, and sent it by mail to the translators.
    </p>

    <p>
      The translator was shocked to receive the JSON. He didn't know how to work with this format. He hadn't software
      for editing JSON, no way to check spelling, view changes, etc. In general, the translator refused to work with
      this.
    </p>

    <img className="flexible-image" src={img1} alt="Fun" />

    <p>
      We began to realize that our path was not entirely correct, but there was nowhere to retreat, we decided to see it
      through to the end, and ... We wrote a JSON-> CSV parser!
    </p>

    <p>
      CSV format was more friendly for our translator, he was able to work with it. Having sent us the edited CSV, we
      wrote a reverse CSV-> JSON parser. Everything seemed to be going well, and then ...
    </p>

    <p>
      The tests have begun! The edits came. There were many of them. We started to send the updated CSV to our
      translator, the translator sent them back to us. All this went through the mail of our manager. At some point, we
      lost the current version, all our edits were mixed into a large pile of different options, which we could no
      longer figure out.
    </p>

    <p>
      Since the JSON was nested, we got <i>undefined</i> fields due to the version difference, and our application
      stopped work!
    </p>

    <p>
      And we developed the wheel! We spent almost a couple of months of our team's time on development. What was it? It
      was a page in the admin area where we could work with the most current locale, changing the translation for
      a friendly interface. English was taken as the default language. This is how it looked like.
    </p>

    <img className="flexible-image" src={img2} alt="Admin area" />

    <p>
      It was a Single Page Application that implemented CRUD to work with our JSONs. We could delete, add lines, and
      update them. There was no spell checker for translators, they had to work on our dev server, after each update we
      manually saved JSON to our GIT repository.
    </p>

    <p>It was nightmare! Now, let's figure it out.</p>

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

    <img className="flexible-image-half" src={img4} alt="Approach" />

    <h3>@rockpack/localazer</h3>

    <p>1. Installation:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeInstallationExample} language="bash">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <ul>
      <li><strong>@rockpack/localaser</strong> React component for translations.</li>
      <li>
        <strong>@rockpack/compiler</strong> is needed to parse our application and generate a dictionary for gettext
        and convert gettext to json.
      </li>
    </ul>

    <p>2. We need to wrap up the application with a component</p>

    <Highlight {...defaultProps} theme={dracula} code={codeWrapperExample} language="bash">
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {/* eslint-disable-next-line sonarjs/no-identical-functions */}
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>

    <p>
      <strong>languages</strong> is a set of JSONs received after translation; you can load it asynchronously from the
      server, or integrate it into your application bundle.
    </p>
  </div>
);

const page = {
  title: 'Localization. True way',
  url: '/localization',
  menuClassName: 'small-menu-item',
  meta: [
    <meta name="description" content="Rockpack ..." />
  ],
  component: Page
};

export default page;
