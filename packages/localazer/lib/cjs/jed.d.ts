import { ReactElement } from 'react';
export declare type LInterfae = (text: string, context: string) => () => string;
export declare type NLInterfae = (singular: string, plural: string, amount: number | string, context: string) => () => string;
declare type SprintFArguments = string | number | undefined | ReactElement<any>;
export declare type SprintFInterface = (args: SprintFArguments) => () => string;
declare const l: LInterfae;
declare const nl: NLInterfae;
declare const sprintf: SprintFInterface;
export { l, nl, sprintf };
