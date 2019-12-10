import React, { Children }  from "react";
import { withRouter } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

const useStylesTreeView = makeStyles({
    root: {
        height: 216,
        flexGrow: 1,
        maxWidth: 400,
    },
});

const checkActive = (match, location, currentRoute) => {
    //some additional logic to verify you are in the home URI
    if(!location) return false;
    const {pathname} = location;
    return pathname === currentRoute;
}

const MenuItems = withRouter(props => {
    const classesTreeView = useStylesTreeView();

    const goTo = (url, name) => {
        props.history.push(url);
        setTimeout(() => {
            if (global.document && name) {
                global.document.location.hash = name;
            }
        });
        if (typeof props.handleDrawerToggle === 'function') {
            props.handleDrawerToggle();
        }
    };

    const TreeRender = data => {
        if (!data) {
            return null;
        }
        if (Array.isArray(data)) {
            return data.map(s => TreeRender(s));
        }
        return (
            data.children ? <TreeItem key={data.name} nodeId={data.name} label={data.name}>{
                (Array.isArray(data.children) ? data.children : [data.children]).map((node, idx) => TreeRender(node))}
            </TreeItem> : <TreeItem key={data.name} nodeId={data.name} label={data.name} />

        );
    };
    return (
        <TreeView
                className={classesTreeView.root}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
        >
            {/*Children.map(props.sections, node => TreeRender(node))*/}
            {TreeRender(props.sections)}
        </TreeView>
    );

    /*return (
            <TreeView
                    className={classesTreeView.root}
                    defaultExpanded={props.openIds}
                    onNodeToggle={props.toggleOpenId}
            >
                {props.sections.map((section, index) => {
                    let nodeId = section.nodeId;

                    let routes = Array.isArray(section.routes) ? section.routes.map((route, index) => {
                        let nodeId = route.nodeId;
                        if (Array.isArray(route.content.component)) {
                            return <TreeItem nodeId={nodeId} key={index} label={route.title} className={checkActive(props.match, props.location, route.url) ? 'selected' : ''}>
                                {route.content.component.map((c, index) => {
                                    let nodeId = c.nodeId;

                                    return <TreeItem nodeId={nodeId} key={index} label={<span style={{marginLeft: '20px'}} onClick={() => {
                                        goTo(route.url, c.name);
                                    }}>
                  {c.title}
                </span>} />;
                                })}
                            </TreeItem>
                        }
                        return <TreeItem nodeId={nodeId} key={index} onClick={() => goTo(route.url)} label={<NavLink activeClassName="selected"  isActive={(match, location) => checkActive(match, location, route.url)} to={route.url} style={{color: '#fff'}}>{route.title}</NavLink>} />
                    }) : <TreeItem nodeId={nodeId} key={index} label={section.title} />;

                    return section.title ? <TreeItem nodeId={nodeId} key={index} label={section.title}>
                        {routes}
                    </TreeItem> : routes;
                })}
            </TreeView>
    )*/
});

export default MenuItems;
