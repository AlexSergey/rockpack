import React from 'react';
interface InitStateInterface {
    [key: string]: unknown;
}
interface StateInterface {
    [key: string]: unknown;
}
interface UssrContextInterface {
    loading: boolean;
    initState: InitStateInterface;
    addEffect: (effect: Promise<unknown>) => void;
}
declare type ReturnCreateUssr = [() => Promise<StateInterface>, ({ children }: {
    children: JSX.Element;
}) => JSX.Element];
export declare const UssrContext: React.Context<UssrContextInterface>;
declare const createUssr: (initState: InitStateInterface) => ReturnCreateUssr;
export default createUssr;
