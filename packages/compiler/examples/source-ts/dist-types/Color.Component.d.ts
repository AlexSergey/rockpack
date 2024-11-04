import React, { Component } from 'react';
type ClockState = {
    color: string;
};
export declare function colorMiddleware(color: string): string;
export default class ColorString extends Component<ClockState> {
    render(): React.JSX.Element;
}
export {};
