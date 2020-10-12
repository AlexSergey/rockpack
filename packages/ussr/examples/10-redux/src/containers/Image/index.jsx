import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchImage } from './action';
import { useWillMount, useUssrEffect } from '../../../../../src';

const Dogs = () => {
  const dispatch = useDispatch();
  const image = useSelector(state => state.imageReducer);
  const effect = useUssrEffect('hello_world')
  useWillMount(effect, () => dispatch(fetchImage()));

  return (
    <div>
      {image.loading ?
        <p>Loading...</p> : image.error ?
          <p>Error, try again</p> : (
            <p>
              <img width="200px" alt="random" src={image.url} />
            </p>
          )}
    </div>
  );
};

export default Dogs;
