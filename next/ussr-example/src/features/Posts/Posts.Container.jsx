import React, { createElement, cloneElement } from 'react';
import { connect } from 'react-redux';
import onLoad from '../../isomorphic/onLoad';
import { fetchPosts } from './Posts.actions';

function PostsContainer({ children }) {
    return createElement(connect(state => ({
        posts: state.postsReducer.toJS().posts
    }), dispatch => ({
        fetchPosts: () => dispatch(fetchPosts())
    }))(props => {
        onLoad(() => {
            props.fetchPosts();
        });
        return cloneElement(children, { posts: props.posts });
    }));
}

export default PostsContainer;
