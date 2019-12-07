export interface Action {
    type: string
    payload?: object | undefined
    service?: object | undefined
    metadata?: object | undefined
}

export interface ActionsToReducer {
    [actionName: string]: object
}

export interface ActionsToSagas {
    [sagaName: string]: object
}
