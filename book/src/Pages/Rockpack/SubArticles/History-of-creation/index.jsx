import React from 'react';

const Page = () => (
  <div>
    <p>
      It was a long way of building Rockpack. It all started in mid-2017 when my friend and I decided to create our
      product - <a href="https://cleverbrush.com/">Cleverbrush</a>.
    </p>
    <p>
      <a href="https://cleverbrush.com/">Cleverbrush</a> is a vector graphic editor and collage builder. The product consists of 5 applications:
    </p>
    <ul>
      <li>Landing page</li>
      <li>Editor</li>
      <li>Collage</li>
      <li>Admin</li>
      <li>API</li>
    </ul>
    <p>
      When we started development, we had to configure webpack, eslint, jest for all 5 types ... When changing
      something in the configs, we changed it in 5 places. Then we got clients. The client versions also required
      support. Configs multiplied, support became more complicated. And then the idea came to my mind, if the config is
      just an object, then you can describe it once and use it in all applications. Don't waste time on support,
      customization, and if something is updated or changed, it can be done in one place.
    </p>
    <p>
      Rockpack proved to be excellent in solving problems of our project and I thought that it might be useful not only
      for us.
    </p>
  </div>
);

export default {
  title: 'History of creation',
  name: 'history-of-creation',
  component: Page
};
