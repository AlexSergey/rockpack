export interface Reducer {
    [key: string]: (state: any, payload: any) => string;
}
