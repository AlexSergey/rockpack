import React, { isValidElement, createElement } from 'react';
import findRoutes from '../utils/findRoutes';
import { Link } from 'react-router-dom';
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
    if (typeof component.name === 'string') {
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
    return component.name ? <div {...Object.assign({}, opt)}>
        <>
            {title && <h2>{title}</h2>}
            {block}
        </>
    </div> : <>
        {title && <h2>{title}</h2>}
        {block}
    </>;
}

const InnerPage = withRouter(props => {
    const classesPage = useStylesPage();
    let { prev, next } = findRoutes(props.match.path, props.sections);

    return (
        <div>
            <div>
                {props.content && Array.isArray(props.content) ?
                    props.content.map((c, index) => renderInside(c, index)) :
                    renderInside(props.content)
                }
            </div>
            <Toolbar className={classesPage.container} style={{justifyContent: 'space-between'}}>
                {!prev && <span />}
                {prev && <Link to={prev.url}>
                    <Tooltip placement="top-start" title={prev.title ? prev.title : 'Previous page'}>
                        <Button variant="outlined" color="primary">
                            <ArrowBackIosIcon style={{margin: '0 -4px 0 4px'}} />
                        </Button>
                    </Tooltip>
                </Link>}
                {next && <Link to={next.url}>
                    <Tooltip placement="top-end" title={next.title ? next.title : 'Next page'}>
                        <Button variant="outlined" color="primary">
                            <ArrowForwardIosIcon />
                        </Button>
                    </Tooltip>
                </Link>}
                {!next && <span />}
            </Toolbar>
        </div>
    );
});

const Page = (content, sections) => {
    console.log(content, sections);
    return <InnerPage content={content} sections={sections} />
};

export default Page;
