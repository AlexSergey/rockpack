/// <reference types="react" />
interface StateInterface {
    [key: string]: unknown;
}
interface RenderUssrInterface {
    render: () => JSX.Element;
}
interface RenderUssrReturnInterface {
    html: string;
    state: StateInterface;
}
export declare const serverRender: ({ render }: RenderUssrInterface) => Promise<RenderUssrReturnInterface>;
export {};
