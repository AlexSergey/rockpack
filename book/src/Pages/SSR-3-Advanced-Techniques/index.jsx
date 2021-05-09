import React from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeInstallationExample from 'raw-loader!./code/code-isntallation.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeWebpackConfigExample from 'raw-loader!./code/code-webpack.config.example';
import Code from '../../components/Code';

const Page = () => (
  <div>
    <p>
      If you haven't read the <a href="/ssr-1-creating-simple-ssr-application">first part</a> and
      <a href="/ssr-2-migration-legacy-app-to-ssr">second part</a> of this article, it covers the basic concepts
      and ideas. I ask you to read it first and only then continue reading.
    </p>

    <h3 id="webpack-config"><strong>Webpack.config</strong> from scratch</h3>

    <p>
      <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md">@rockpack/compiler</a> is an optional module for building an SSR application.
      <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md">@rockpack/compiler</a> provides support for CSS modules for isomorphic app, @loadable components and
      USSR. If you have an existing project with webpack configured, or you want to customize it yourself, let's take a
      look at the example of creating a webpack configuration from scratch:
    </p>

    <p><i>in this example we will use webpack 5</i></p>

    <p>1. Installation</p>

    <Code code={codeInstallationExample} language="bash" />

    <p>2. Create webpack.config.js</p>

    <Code code={codeWebpackConfigExample} language="jsx" />

    <p>Important points:</p>

    <ol>
      <li>
        To compile an SSR application, the webpack config file must consist of two configurations (MultiCompilation).
        One for building the server, the other for building the client. We are passing an array to module.exports.
      </li>
      <li>
        To configure the server, we need to set <i>target: 'node'</i>. Target is optional for the client. By
        default, webpack config has <i>target: 'web'</i>. <i>target: 'node'</i> allows webpack to handle server
        code, default modules such as path, child_process, and more.
      </li>
      <li>
        <i>const common</i> - the common part of the settings. Since the server and client code share the same
        application structure, they must handle JS the same way.
      </li>
      <li>You need to add a plugin to babel-loader:</li>
    </ol>

    <p><a href="https://github.com/AlexSergey/rockpack/blob/master/packages/babel-plugin-ussr-marker/README.md">@rockpack/babel-plugin-ussr-marker</a></p>

    <p>
      This is a helper module <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md">@rockpack/ussr</a> to track asynchronous operations in your application. Works great with
      @babel/typescript-preset, other SSR babel plugins such as @loadable, etc.
    </p>

    <h3>SSR and SEO</h3>

    <p>
      An important aspect of working with SEO for SSR applications is the generation of your HTML meta tags. Meta tags
      are HTML tags placed in the header of a page. They are responsible for a short description of what will be posted
      at the specified address so that the search robot understands the content.
    </p>

    <p>
      There are several solutions for these purposes that work fine with <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md">@rockpack/ussr</a>:
    </p>

    <ul>
      <li><a href="https://github.com/s-yadav/react-meta-tags#readme">react-meta-tags</a></li>
      <li><a href="https://github.com/staylor/react-helmet-async">react-helmet-async</a></li>
    </ul>

    <h3>Dynamic imports</h3>

    <p>
      Another problem when building SSR applications is dynamic imports. This code is executed asynchronously and the
      SSR task of the application is to wait until all the dependent parts of the application are loaded. The @loadable
      module does an excellent job with this task.
    </p>

    <p>
      <a href="https://loadable-components.com/docs/server-side-rendering/">This link</a> describes how to use dynamic
      imports in SSR with @loadable
    </p>

    <h3>Dummies</h3>

    <p>
      Certain parts of the page are preferable to ignore altogether when rendering on the server. This applies to
      animation layers, graphics, Canvas, protected information and more. For these purposes, it is recommended to do a
      check - if <i>typeof windows === 'undefined'</i>, then we do not render this component.
    </p>

    <p>
      For secondary and not important for SEO information, we can do content emulation. For example, for a post,
      comments should be loaded. This request may be too large. Comment data may not be important for SEO. Therefore,
      this data can be excluded, or stub blocks can be sent to the client so as not to waste time with server-render and
      load the data already on the client.
    </p>

    <h3>CSS modules</h3>

    <p>
      To handle styles for SSR, you need to use a special webpack loader
      <a href="https://github.com/kriasoft/isomorphic-style-loader">isomorphic-style-loader</a>
    </p>

    <h3>Transfer of token and other data.</h3>

    <p>
      Everything is very simple, we use cookie instead of localStorage.
      Cookies are sent automatically on every request.
      Cookies have many limitations compared to localeStorage such as:
    </p>

    <ol>
      <li>
        cookies are the old way of storing data, they give you a 4096 byte (actually 4095) limit - per cookie. Local
        storage is 5 MB per domain.
      </li>
      <li>
        localStorage is an implementation of the storage interface. It stores data without an expiration date and is
        only cleared by JavaScript or clearing browser cache / locally stored data - as opposed to cookie expiration.
      </li>
    </ol>

    <p>
      Some data should be passed in the URL. For example, if we use localization on the site, then the current language
      will be part of the URL. This approach will improve SEO, since we will have different URLs for different
      localizations of the application and ensure data transfer when requested.
    </p>

    <p>
      If you need to transfer a large amount of data during SSR, you can use auxiliary data stores, for example Redis,
      or NoSQL etc.
    </p>

    <h3>Conclusion</h3>

    <p>
      SSR is a very complex theme. I tried to outline the most popular approaches and concepts for building SSR
      applications. Build quality apps with users care and business care. A collection of examples can be found
      <a href="https://github.com/AlexSergey/rockpack/tree/master/packages/ussr/examples">here</a>.
    </p>
  </div>
);

const page = {
  title: 'SSR part 3. Advanced Techniques',
  url: '/ssr-3-advanced-techniques',
  menuClassName: 'small-menu-item',
  share: true,
  meta: [
    <meta name="description" content="Rockpack ..." key="description" />
  ],
  component: Page
};

export default page;
