/// <reference types="react" />
import { Stack } from './types';
export interface BSODInterface {
    count: number;
    onClose: () => void;
    stackData: Stack;
}
declare const BSOD: (props: BSODInterface) => JSX.Element;
export default BSOD;
