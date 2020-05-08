import React from 'react';
import { matchPath } from 'react-router';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core';
import { Localization, DocgenRouteInterface } from '../types';

interface MenuItemsInterface extends RouteComponentProps {
  toggleOpenId: (openIds: string[]) => void;
  openIds: string[];
  activeLang?: string;
  docgen: DocgenRouteInterface | DocgenRouteInterface[];
  localization?: Localization;
  handleDrawerToggle?: () => void;
  children?: (isLocalized?: boolean, languageState?: string, handler?: (lang: string) => void) => JSX.Element;
}

const useStylesTreeView = makeStyles({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400
  },
});

const setActive = (currentUrl, pth, activeLang): string => (
  matchPath(currentUrl, {
    path: typeof activeLang === 'string' ? `/${activeLang}${pth}` : pth,
    exact: true,
    strict: false
  }) ? 'active' : ''
);

const MenuItems = withRouter((props: MenuItemsInterface) => {
  const classesTreeView = useStylesTreeView();

  const goTo = (url, name): void => {
    if (url) {
      props.history.push(typeof props.activeLang === 'string' ?
        `/${props.activeLang}${url}` :
        url);
    }

    setTimeout(() => {
      if (document && name) {
        document.location.hash = name;
      }
    });

    if (typeof props.handleDrawerToggle === 'function') {
      props.handleDrawerToggle();
    }
  };

  const TreeRender = (data: DocgenRouteInterface | DocgenRouteInterface[]): unknown => {
    if (!data) {
      return null;
    }

    if (Array.isArray(data)) {
      return data.map(s => TreeRender(s));
    }

    if (!data.title) {
      return null;
    }

    const W = data.url ? (Inner: JSX.Element, url): JSX.Element => (
      <span
        {...data.nodeId ? { id: data.nodeId } : {}}
        className={setActive(document.location.pathname, url, props.activeLang)}
        onClick={(e): void => {
          e.preventDefault();
          e.stopPropagation();
          goTo(url, null);
        }}
        key={data.uniqId}
      >
        {Inner}
      </span>
    ) : (Inner: JSX.Element, hash, extraClassName): JSX.Element => (
      <span
        {...data.nodeId ? { id: data.nodeId } : {}}
        className={`#${hash}` === document.location.hash ? `active ${extraClassName}` : extraClassName}
        onClick={(e): void => {
          e.preventDefault();
          e.stopPropagation();
          goTo(null, data.name);
        }}
        key={data.uniqId}
      >
        {Inner}
      </span>
    );

    return (
      data.children ? W((
        <TreeItem key={data.uniqId} nodeId={data.nodeId} label={data.title}>{
          (Array.isArray(data.children) ? data.children.map(node => TreeRender(node)) : data.children)
        }
        </TreeItem>
      ), data.url, '') : (
        data.url ?
          W(
            <TreeItem key={data.uniqId} nodeId={data.nodeId} label={data.title} />,
            data.url,
            ''
          ) :
          (typeof data.name === 'string' ?
            W((
              <div style={{ padding: '0 0 0 10px' }}>
                <span style={{ cursor: 'pointer' }}>{data.title}</span>
              </div>
            ), data.name, 'tree-hash-item') : (
              <div key={data.uniqId} style={{ padding: '0 0 0 10px' }}>
                <span style={{ cursor: 'pointer' }}>{data.title}</span>
              </div>
            )
          )
      )
    );
  };

  return (
    <TreeView
      expanded={props.openIds}
      className={classesTreeView.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={(e, nodeIds): void => props.toggleOpenId(nodeIds)}
    >
      {TreeRender(props.docgen)}
    </TreeView>
  );
});

export default MenuItems;
