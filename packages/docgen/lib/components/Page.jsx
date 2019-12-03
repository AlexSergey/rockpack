import React, { isValidElement } from 'react';
import findRoutes from '../utils/findRoutes';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const InnerPage = withRouter(props => {
  let component = props.content.component;
  let title = props.content.title;
  let { prev, next } = findRoutes(props.match.path, props.sections);
  return (
    <div>
      <h2>{title}</h2>
      <div>
        {component && Array.isArray(component) ?
          component.map((c, index) => {
            if (c.name) {
              return <div key={index} id={c.name}>
                {isValidElement(c.component) ? c.component : (typeof c.component === 'function' ? c.component() : c.component)}
              </div>
            }
            return <div key={index}>
              {isValidElement(c) ? c : (typeof c === 'function' ? c() : c)}
            </div>
          }) :
          (isValidElement(component) ? component : (typeof component === 'function' ? component() : component))}
      </div>
      {prev && <Link to={prev.url}>Prev {prev.title}</Link>}
      {next && <Link to={next.url}>next {next.title}</Link>}
    </div>
  );
});

const Page = (content, sections) => {
  console.log(content, sections);
  return <InnerPage content={content} sections={sections} />
};

export default Page;
