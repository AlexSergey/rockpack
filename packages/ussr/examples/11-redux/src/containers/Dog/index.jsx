import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDog } from './action';
import { useWillMount } from '../../../../../src';

const Dogs = () => {
  const dispatch = useDispatch();
  const dog = useSelector(state => state.dogReducer);

  useWillMount(() => dispatch(fetchDog()));

  return (
    <div>
      {dog.loading ?
        <p>Loading...</p> : dog.error ?
          <p>Error, try again</p> : (
            <p>
              <img alt="dog" src={dog.url} />
            </p>
          )}
    </div>
  );
};

export default Dogs;
