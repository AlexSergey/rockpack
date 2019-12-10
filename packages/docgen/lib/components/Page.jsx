import React, { isValidElement, createElement } from 'react';
import findRoutes from '../utils/findRoutes';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { withRouter } from 'react-router-dom';
import stylesHeader from '../assets/jss/material-dashboard-react/components/headerStyle';
import { makeStyles } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import MDXLayout from './MDXLayout';
const useStylesPage = makeStyles(stylesHeader);

function renderInside(content, index) {
    let component = content.component;
    let name = content.name;
    let title = content.title;
    let opt = {};
    if (typeof index === 'number') {
        opt.key = index;
    }
    if (typeof name === 'string') {
        opt.id = name;
    }
    let block = (
        component.isMDXComponent ?
            <MDXLayout key={index}>
                {createElement(component)}
            </MDXLayout> :
            isValidElement(component) ?
                component :
                typeof component === 'function' ?
                    component() :
                    component
    );

    return (
        <div {...Object.assign({}, opt)}>
            {title && <h2>{title}</h2>}
            {block}
        </div>
    );
}

const InnerPage = withRouter(props => {
    const classesPage = useStylesPage();
    let { prev, next } = findRoutes(props.match.path, props.sections);

    return (
        <Paper style={{padding: '20px'}}>
            <div>
                {props.content && Array.isArray(props.content) ?
                    props.content.map((c, index) => {
                        if (Array.isArray(c.component)) {
                            return c.component.map((c, index) => renderInside(c, index))
                        }
                        return renderInside(c, index);
                    }) :
                    (Array.isArray(props.content.component) ?
                        props.content.component.map((c, index) => renderInside(c, index)) :
                        renderInside(props.content)
                    )
                }
            </div>
            <Toolbar className={classesPage.container} style={{justifyContent: 'space-between', marginTop: '20px'}}>
                {!prev && <span />}
                {prev && <Link to={prev.url} onClick={() => {
                    console.log(prev);
                    props.toggleOpenId(null, prev.nodeId);
                }}>
                    <Tooltip placement="top-start" title={prev.title ? prev.title : 'Previous page'}>
                        <Button variant="outlined" color="primary">
                            <ArrowBackIosIcon style={{margin: '0 -4px 0 4px'}} />
                        </Button>
                    </Tooltip>
                </Link>}
                {next && <Link to={next.url} onClick={() => {
                    console.log(next);
                    props.toggleOpenId(null, next.nodeId);
                }}>
                    <Tooltip placement="top-end" title={next.title ? next.title : 'Next page'}>
                        <Button variant="outlined" color="primary">
                            <ArrowForwardIosIcon />
                        </Button>
                    </Tooltip>
                </Link>}
                {!next && <span />}
            </Toolbar>
        </Paper>
    );
});

const Page = (content, sections, props) => {
    return <InnerPage content={content} sections={sections} toggleOpenId={props.toggleOpenId} />
};

export default Page;
