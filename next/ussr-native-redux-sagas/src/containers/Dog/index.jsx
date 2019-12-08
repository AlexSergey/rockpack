import React from "react";
import { connect } from 'react-redux';
import { fetchDog } from './action';
import { onLoad } from '@rock/ussr/client';

const Dogs = props => {
    onLoad(() => props.dispatch(fetchDog()));

    return (
        <div>
            {props.loading
                ? <p>Loading...</p>
                : props.error
                    ? <p>Error, try again</p>
                    : <p><img src={props.url}/></p>}
        </div>
    )
};

export default connect(state => state.dogReducer)(Dogs);
