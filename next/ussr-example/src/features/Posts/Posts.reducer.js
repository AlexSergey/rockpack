import { createReducer } from 'redux-act';
import { requestPosts, requestPostsSuccess, requestPostsError } from './Posts.actions';
import { fromJS } from 'immutable';
import getSafetyData from '../../utils/getSafetyData';

export default createReducer({
    [requestPosts]: state => state,
    [requestPostsSuccess]: (state, payload) => {
        return state
            .set('posts', payload);
    },
    [requestPostsError]: state => state,
}, fromJS({
    posts: getSafetyData('postsReducer.posts', [])
}));
