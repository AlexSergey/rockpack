import React from 'react';
import dracula from 'prism-react-renderer/themes/dracula';
import Highlight, { defaultProps } from 'prism-react-renderer';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeAppExample from 'raw-loader!./code/code-app.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeInstallationExample from 'raw-loader!./code/code-installation.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeBuildExample from 'raw-loader!./code/code-build.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeRunExample from 'raw-loader!./code/code-run.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeAppJSXExample from 'raw-loader!./code/code-appjsx.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeClientExample from 'raw-loader!./code/code-client.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeServerExample from 'raw-loader!./code/code-server.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeImportExample from 'raw-loader!./code/code-import.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeUseUssrEffectExample from 'raw-loader!./code/code-use-ussr-effect.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeClientChangesExample from 'raw-loader!./code/code-client-changes.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeServerRenderExample from 'raw-loader!./code/code-server-render.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeSetStateExample from 'raw-loader!./code/code-set-state.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeClientFinalChangesExample from 'raw-loader!./code/code-client-final-changes.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeSerializeExample from 'raw-loader!./code/code-serialize.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeServerFinalExample from 'raw-loader!./code/code-server-final-replace.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeClientStateExample from 'raw-loader!./code/code-client-state.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeCompleteAppExample from 'raw-loader!./code/code-complete-app.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeCompleteClientExample from 'raw-loader!./code/code-complete-client.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeCompleteServerExample from 'raw-loader!./code/code-complete-server.example';
import img1 from '../../../readme_assets/rockpack_ussr_1.png';

const Page = () => (
  <div>
    <p>
      Working for a long time in outsource, a person grows outsourcer-syndrome. What it is? We create
      products without worrying about their future fate. A customer came, ordered an application, a website, whatever,
      we happily did it, assembled it using ultra-modern technologies, approaches, putting our souls into this project
      ... But after completing the work, the customer leaves. On his place comes another. With another product, etc.
      This is a pipeline! In such situation, we do not know whether the customer's business is successful after
      release, and if we achieved the business goals. Does the audience like the product, etc?
    </p>

    <p>
      I also had an outsourcer-syndrome. When we were making our product, I had 8+ years of
      experience in outsource. And now the time has come to realize this. We have released our product <a href="http://cleverbrush.com/">Cleverbrush</a>. As
      time passed, I noticed that the main site, our selling platform, was simply not searched. Nobody visited it. It
      was absent in Google and other search engines results.
    </p>

    <p>
      It's time to understand that when we finish a project, business starts and all our technical solutions can both
      positively and negatively affect profits.
    </p>

    <p>
      What was the problem, why users couldn't find the site? It was just a simple Single Page React application, making
      multiple requests, rendering a nice landing page. So what? Most of the modern web is Single Page applications.
      Yes! But, wondering why this is happening, I looked at Google PageSpeed and the results were pure.
    </p>

    <h3>The problem</h3>

    <p>
      The main problem with Single Page applications is that the server serves a blank HTML page to the client. It's
      formation occurs only after all JS has been downloaded (this is all your code, libraries, framework). It is
      advisable to load the styles as well so that the page does not "jump". In most cases, this is more than 2
      megabytes in size + code processing delays.
    </p>

    <p>
      Even if a Google bot is able to parse a Single Page application, it only receives content after some time, which
      is critical for the ranking of the site. The Google bot simply sees a white, blank page for a few seconds! This is
      a bad thing!
    </p>

    <p>
      {/* eslint-disable-next-line max-len */}
      Our audience was not limited to the US market. Residents of Russia, Ukraine, Belarus, etc. can become our clients to.
      In these countries, the Yandex search engine is widely used, which does not know how to render Single Page
      applications (by that time when we encountered the problem). There are many other search engines out there, and I
      was surprised that the traffic from them is very, very high. I never thought about it before! These people will
      never know about our product, we will not get potential customers, etc.
    </p>

    <p>
      Google starts issuing red cards if your site takes more than 3 seconds to render. <i>First Contentful Paint</i>,
      <i>Time to Interactive</i> are metrics that will necessarily be underestimated with Single Page Application.
    </p>

    <p>
      But where does this figure of 2-3 seconds come from? I heard about it somewhere, hmm... Many articles in UX refer
      to this figure. And the answer covered in the people. In the modern world, everyone has become a little lazy.
      Everyone was overfilled with information. And the person no longer intends to wait more than two seconds for
      your site to load! What is it, we are wasting time of his life while he watching the loading process of our
      stunning site!
    </p>

    <p>
      A bunch of factors are also related to site rankings. I will tell you about them in other articles. Let's focus on
      the rendering issue.
    </p>

    <h3>Solving...</h3>

    <p>So, there are several ways to solve the problem of a blank page when loading.</p>

    <p>
      {/* eslint-disable-next-line max-len */}
      <strong>Solution 1</strong>. This should be done by the site pre-renderer before uploading it to the server. A very simple and
      effective solution. If we do not need to download additional important information during the execution of the
      application. What I mean is, for example, we have an API to get a list of posts on a page. When executed, the
      application makes an API request, gets a list of posts, and displays them. With a pre-renderer, we will not be
      able to make such a request. Therefore, only the frame of the page will be available without
      <u>USEFUL INFORMATION</u>. And it is really necessary for both the user and the search engines (it makes sense
      for search bots to crawl our site if there is no information that is needed there).
    </p>

    <p>
      {/* eslint-disable-next-line max-len */}
      <strong>Solution 2</strong>. Render content at runtime on the server (Server Side Rendering). With this approach, we will be able
      to make requests where needed and serve HTML along with the necessary content.
    </p>

    <p>
      There are also other ways, but we will not consider them. These 2 solutions clearly demonstrate one of the
      problems.
    </p>

    <h3>Server Side Rendering (SSR)</h3>

    <p>Let's take a closer look at how SSR works:</p>

    <ul>
      <li>
        We need to have a server that executes our application exactly as a user would do in a browser. Making requests
        for the necessary resources, rendering all the necessary HTML, filling in the state.
      </li>
      <li>
        The server gives the client the full HTML, the full state, and also gives all the necessary JS, CSS and other
        resources.
      </li>
      <li>
        The client receives HTML and resources and works with the application as a normal Single Page Application. The
        important point here is that the state must be synchronized.
      </li>
    </ul>

    <h3>Problems</h3>

    <p>From the above described SSR application work, we can highlight the problems:</p>

    <ul>
      <li>
        The application is divided into server and client. That is, we essentially get 2 applications. In order for this
        to be supported, this separation must be minimal
      </li>
      <li>
        The server must be able to query data. For example, we have an API with posts, we need to make a request to this
        API, get the data, insert the data into the application, and get the HTML with the current state. The problem at
        this point is that the <strong>renderToString</strong> supplied with React is synchronous. And the operations
        are asynchronous.
      </li>
      <li>
        Our server is essentially a React application. This means that it will contain import/export features, JSX,
        possibly TypeScript and so on. The server will also have to be handled through Babel or TS just like the main
        application.
      </li>
      <li>
        On the client, the application must sync state and continue to work like a normal SPA application.
      </li>
    </ul>

    <h3>API requests</h3>

    <p>
      Let's talk about this topic in more detail. The point is that such requests can depend on each other. And after
      each request, we have to update the state of the application and rerun it through <strong>renderToString</strong>.
    </p>

    <p>Example:</p>

    <p>
      We have a request for posts to the API, we receive data, after which we need to make a request for brief
      information for each post. This behavior is called the <i>effect queue</i>. Thus, we need to pass our application
      through <strong>renderToString</strong> until all the necessary data has been downloaded.
    </p>

    <p>Schematically it looks like this:</p>

    <img className="flexible-image" src={img1} alt="Server Side Rendering" />

    <h3>Go!</h3>

    <p>
      All these problems are covered by the <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md">rockpack/ussr</a> module and <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md">rockpack/compiler</a>. For example, we will create
      an application from a simple, simple SSR application.
    </p>

    <p>Suppose we have a simple application with asynchronous logic</p>

    <Highlight {...defaultProps} theme={dracula} code={codeAppExample} language="jsx">
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

    <p>In place of the <strong>asyncFn</strong> method, we can have a request to the server.</p>

    <h3>Let's make this application asynchronous!</h3>

    <p>1. Installation</p>

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

    <p>
      Let's create a build.js file at the root of our project. It will allow us to compile our client and server,
      processing TS, JSX, various resources such as SVG, images, and more.
    </p>

    <Highlight {...defaultProps} theme={dracula} code={codeBuildExample} language="jsx">
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

    <p><i>Launch commands:</i></p>

    <Highlight {...defaultProps} theme={dracula} code={codeRunExample} language="bash">
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
      Let's move the general logic of our application into a separate file <strong>App.jsx</strong>. This is necessary
      so that only the rendering logic remains in the client.jsx and server.jsx files, nothing else. Thus, the entire
      application code will be common to us.
    </p>

    <p><strong>App.jsx:</strong></p>

    <Highlight {...defaultProps} theme={dracula} code={codeAppJSXExample} language="jsx">
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

    <p><strong>client.jsx:</strong></p>

    <Highlight {...defaultProps} theme={dracula} code={codeClientExample} language="jsx">
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
      We changed the default React render method to hydrate, which works for SSR applications.
    </p>

    <p><strong>server.jsx:</strong></p>

    <Highlight {...defaultProps} theme={dracula} code={codeServerExample} language="jsx">
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

    <p>It is not yet an SSR application, but it will soon be.</p>

    <h3><a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md">@rockpack/ussr</a></h3>

    <p>
      We separated the logic by bringing out the common part, connected the compiler for the client and server parts of
      the application, taking into account JSX / TS and so on. Now let's solve the rest of the problems associated with
      asynchronous calls and state.
    </p>

    <p>In <strong>App.jsx</strong> add:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeImportExample} language="jsx">
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

    <p>Replace <strong>useEffect</strong> with <strong>useUssrEffect</strong>:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeUseUssrEffectExample} language="jsx">
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

    <p>Let's make changes to <strong>client.jsx</strong>:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeClientChangesExample} language="jsx">
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

    <p>In <strong>server.jsx</strong>, replace the standard renderToString with:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeServerRenderExample} language="jsx">
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
      If you run the application now, nothing will happen! We will not see the result of executing the async function
      <strong>asyncFn</strong>. Why is this happening? We forgot to sync state. Let's fix this.
    </p>

    <p>In <strong>App.jsx</strong>, replace the standard setState with:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeSetStateExample} language="jsx">
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

    <p>It allows you to take the state from the cache sent from the server.</p>

    <p>Let's replace in <strong>client.jsx</strong>:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeClientFinalChangesExample} language="jsx">
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
      <strong>window.USSR_DATA</strong> is an object passed from the server with a cached state for front-end
      synchronization.
    </p>

    <p><strong>server.jsx:</strong></p>

    <p>Add the module:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeSerializeExample} language="jsx">
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

    <p>And replace:</p>

    <Highlight {...defaultProps} theme={dracula} code={codeServerFinalExample} language="jsx">
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
      As we can see, <strong>serverRender</strong> returns state in addition to html. We cache it in the HTML template,
      in the field
    </p>

    <Highlight {...defaultProps} theme={dracula} code={codeClientStateExample} language="jsx">
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
      This way, the state will be populated on the server and passed to the client as a regular object, where it will be
      used by the <strong>setUssrState</strong> method and returned as the default value.
    </p>

    <p>
      That's it! We now have an SSR-enabled application. For a more realistic example, where not setState will be used,
      but Redux, please read the <a href="/ssr-2-migration-legacy-redux-app-to-ssr">continuation</a>.
    </p>

    <h3>Complete code</h3>

    <p><strong>App.jsx:</strong></p>

    <Highlight {...defaultProps} theme={dracula} code={codeCompleteAppExample} language="jsx">
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

    <p><strong>client.jsx:</strong></p>

    <Highlight {...defaultProps} theme={dracula} code={codeCompleteClientExample} language="jsx">
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

    <p><strong>server.jsx:</strong></p>

    <Highlight {...defaultProps} theme={dracula} code={codeCompleteServerExample} language="jsx">
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

    <p>Also the code is available <a href="https://github.com/AlexSergey/rockpack/tree/master/packages/ussr/examples/2-simple-express">here</a></p>
  </div>
);

const page = {
  title: 'SSR part 1. Creating simple SSR application',
  url: '/ssr-1-creating-simple-ssr-application',
  menuClassName: 'small-menu-item',
  share: true,
  meta: [
    <meta name="description" content="Rockpack ..." />
  ],
  component: Page
};

export default page;
