import React from "react";
import { matchPath } from 'react-router';
import { withRouter } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core';

const useStylesTreeView = makeStyles({
    root: {
        height: 216,
        flexGrow: 1,
        maxWidth: 400,
    },
});

const setActive = (currentUrl, pth) => {
    return matchPath(currentUrl, {
        path: pth,
        exact: true,
        strict: false
    }) ? 'active' : '';
};

const MenuItems = withRouter(props => {
    const classesTreeView = useStylesTreeView();

    const goTo = (url, name) => {
        if (url) {
            props.history.push(url);
        }
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

        let W = data.url ? (Inner) => <span
                className={setActive(global.document.location.pathname, data.url)}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goTo(data.url, null);
                }}
                key={data.name}>{Inner}</span> : (Inner) => <span
                className={setActive(global.document.location.pathname, data.url)}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goTo(null, data.name);
                }} key={data.name}>{Inner}</span>;

        return (
            data.children ? W(<TreeItem key={data.uniqId} nodeId={data.nodeId} label={data.name}>{
                (Array.isArray(data.children) ? data.children : [data.children]).map((node, idx) => TreeRender(node))}
            </TreeItem>) : W(<TreeItem key={data.uniqId} nodeId={data.name} label={data.name} />)
        );
    };

    return (
        <TreeView
                expanded={props.openIds}
                className={classesTreeView.root}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeToggle={(e, nodeIds) => props.toggleOpenId(nodeIds)}
        >
            {TreeRender(props.sections)}
        </TreeView>
    );
});

export default MenuItems;
