import serialize from 'serialize-javascript';

export const renderHeader = (meta) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            ${meta}
            <script>window.ISOMORPHIC_APP_IS_MOUNTING = true;</script>
        </head>
        <body>
            <div id="root">`;

export const renderFooter = ({ reduxState, css, scripts, liveReloadPort, isProduction }) => {
    console.log(!isProduction, typeof liveReloadPort === 'number');
    return `</div>
        <script>
            window.REDUX_DATA = ${ serialize( reduxState, { isJSON: true } ) }
        </script>
        ${css}
        ${scripts}
        ${!isProduction && typeof liveReloadPort === 'number' ?
        `<script src="http://localhost:${liveReloadPort}/livereload.js"></script>` :
        ''
    }
        <script>
            window.addEventListener('load', () => {
                window.ISOMORPHIC_APP_IS_MOUNTING = false;
            });
            window.onhashchange = function() { 
                 window.ISOMORPHIC_APP_IS_MOUNTING = false;
            }
        </script>
    </body>
</html>
`
};
