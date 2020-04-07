import { Component } from 'react';
interface LocalizationInterface {
    className?: string;
    children: () => string;
}
declare class Localization extends Component<LocalizationInterface> {
    private id;
    constructor(props: any);
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default Localization;
