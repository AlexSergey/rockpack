import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchDog } from './action';
import { onLoad } from '@rock/ussr/client';

const Dogs = () => {
    const dispatch = useDispatch();
    const dog = useSelector(state => state.dogReducer);

    onLoad(() => dispatch(fetchDog()));

    return (
        <div>
            {dog.loading
                ? <p>Loading...</p>
                : dog.error
                    ? <p>Error, try again</p>
                    : <p><img src={dog.url}/></p>}
        </div>
    )
};

export default Dogs;
