interface CodeBlockInterface {
    children: string;
    className?: string;
    live?: string;
    render?: boolean;
}
declare const CodeBlock: ({ children, className, live, render }: CodeBlockInterface) => JSX.Element;
export default CodeBlock;
