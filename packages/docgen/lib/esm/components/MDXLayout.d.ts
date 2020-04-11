interface MDXLayoutInterface {
    components: {
        h1: JSX.Element;
        h2: JSX.Element;
        h3: JSX.Element;
        h4: JSX.Element;
        h5: JSX.Element;
        h6: JSX.Element;
    };
}
declare const MDXLayout: (props: MDXLayoutInterface) => JSX.Element;
export default MDXLayout;
