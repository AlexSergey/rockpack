import { Component } from 'react';
declare type ClockState = {
    color: string;
};
export declare function colorMiddleware(color: string): string;
export default class ColorString extends Component<ClockState> {
    render(): JSX.Element;
}
export {};
