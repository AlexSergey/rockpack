import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React, { isValidElement, createElement } from 'react';
import { Link, useLocation, useMatch, useRoutes } from 'react-router-dom';
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';

import stylesHeader from '../assets/jss/material-dashboard-react/components/headerStyle';
import { DocgenRouteInterface, LayoutInterface } from '../types';
import findRoutes from '../utils/findRoutes';

import MDXLayout from './MDXLayout';

const useStylesPage = makeStyles(stylesHeader);

const renderInside = (content, index: number | null, props): JSX.Element => {
  if (!content) {
    return null;
  }
  let component = null;
  if (isValidElement(content)) {
    component = content;
  } else if (typeof component === 'function') {
    component = content;
  } else if (content.isMDXComponent) {
    component = content;
  } else if (content.component) {
    component = content.component;
  }
  const { name } = content;
  const { title } = content;

  const opt = {
    id: null,
    key: null,
  };
  if (typeof index === 'number') {
    opt.key = index;
  }
  if (typeof name === 'string') {
    opt.id = name;
  }
  const block =
    component && component.isMDXComponent ? (
      <MDXLayout key={index} {...props}>
        {createElement(component)}
      </MDXLayout>
    ) : isValidElement(component) ? (
      component
    ) : typeof component === 'function' ? (
      component()
    ) : (
      component
    );

  return (
    <div {...{ ...opt }}>
      {!content.menuOnly && title && <h2>{title}</h2>}
      {block}
      {content.share && (
        <ul className="share-links">
          <li>
            <TwitterShareButton url={document.location.href}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </li>
          <li>
            <FacebookShareButton url={document.location.href}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
          </li>
          <li>
            <LinkedinShareButton url={document.location.href}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </li>
          <li>
            <RedditShareButton url={document.location.href}>
              <RedditIcon size={32} round />
            </RedditShareButton>
          </li>
          <li>
            <TelegramShareButton url={document.location.href}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>
          </li>
          <li>
            <EmailShareButton url={document.location.href}>
              <EmailIcon size={32} round />
            </EmailShareButton>
          </li>
        </ul>
      )}
    </div>
  );
};

interface PageAndRouterInterface extends LayoutInterface {
  toggleOpenId: () => void;
  content: unknown;
  docgen: DocgenRouteInterface | DocgenRouteInterface[];
}

const InnerPage = (props: PageAndRouterInterface): JSX.Element => {
  const { pathname } = useLocation();
  const { pattern } = useMatch(pathname);
  const classesPage = useStylesPage();

  const current =
    typeof props.activeLang === 'string' ? pattern.path.replace(`/${props.activeLang}`, '') : pattern.path;

  const { prev, next } = findRoutes(current, props.docgen);

  return (
    <Paper style={{ padding: '20px' }}>
      <div className="page-content">
        {props.content && Array.isArray(props.content)
          ? props.content.map((c, index) => renderInside(c, index, props))
          : renderInside(props.content, null, props)}
      </div>
      <Toolbar className={classesPage.container} style={{ justifyContent: 'space-between', marginTop: '20px' }}>
        {!prev && <span />}
        {prev && (
          <Link
            to={typeof props.activeLang === 'string' ? `/${props.activeLang}${prev.url}` : prev.url}
            onClick={(): void => props.toggleOpenId()}
          >
            <Tooltip placement="top-start" title={prev.title ? prev.title : 'Previous page'}>
              <Button variant="outlined" color="primary">
                <ArrowBackIosIcon style={{ margin: '0 -4px 0 4px' }} />
              </Button>
            </Tooltip>
          </Link>
        )}
        {next && (
          <Link
            to={typeof props.activeLang === 'string' ? `/${props.activeLang}${next.url}` : next.url}
            onClick={(): void => props.toggleOpenId()}
          >
            <Tooltip placement="top-end" title={next.title ? next.title : 'Next page'}>
              <Button variant="outlined" color="primary">
                <ArrowForwardIosIcon />
              </Button>
            </Tooltip>
          </Link>
        )}
        {!next && <span />}
      </Toolbar>
    </Paper>
  );
};

const Page = (content: unknown, props: LayoutInterface): JSX.Element => <InnerPage content={content} {...props} />;

export default Page;
