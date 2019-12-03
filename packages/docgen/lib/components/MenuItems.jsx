import React  from "react";
import { withRouter } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStylesTreeView = makeStyles({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const MenuItems = withRouter(props => {
  const classesTreeView = useStylesTreeView();

  return (
    <TreeView
      className={classesTreeView.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={props.openIds}
      onNodeToggle={props.toggleOpenId}
    >
      {props.sections.map((section, index) => {
        let nodeId = section.nodeId;

        let routes = Array.isArray(section.routes) ? section.routes.map((route, index) => {
          let nodeId = route.nodeId;
          if (Array.isArray(route.content.component)) {
            return <TreeItem nodeId={nodeId} key={index} label={route.title}>
              {route.content.component.map((c, index) => {
                let nodeId = c.nodeId;
                return <TreeItem nodeId={nodeId} key={index} label={<span onClick={() => {
                  props.history.push(route.url);
                  setTimeout(() => {
                    if (global.document) {
                      global.document.location.hash = c.name;
                    }
                  });
                  if (typeof props.handleDrawerToggle === 'function') {
                    props.handleDrawerToggle();
                  }
                }}>
                  {c.title}
                </span>} />;
              })}
            </TreeItem>
          }
          return <TreeItem nodeId={nodeId} key={index} label={<Link to={route.url}>{route.title}</Link>} />
        }) : <TreeItem nodeId={nodeId} key={index} label={section.title} />;

        return section.title ? <TreeItem nodeId={nodeId} key={index} label={section.title}>
          {routes}
        </TreeItem> : routes;
      })}
    </TreeView>
  )
});

export default MenuItems;
