import React from 'react';
export declare const UssrContext: React.Context<any>;
declare const createUssr: (initState: any) => ((() => Promise<unknown>) | (({ children }: {
    children: any;
}) => JSX.Element))[];
export default createUssr;
