import { Resolver } from '@rockpack/ussr';
import { createAction } from '@reduxjs/toolkit';
import { Post } from '../../types/Posts';
import { Languages } from '../../types/Localization';

export const fetchPosts = createAction<{ resolver?: Resolver; page: number }>('Posts will fetch');

export const requestPosts = createAction('Posts are fetching...');

export const requestPostsSuccess = createAction<Post[]>('Posts have already fetched');

export const requestPostsError = createAction('Posts fetched with error');

export const createPost = createAction<{ postData: FormData; page: number }>('Post is going to be created');

export const deletePost = createAction<{ id: number; owner: boolean }>('Post is going to be deleted');

export const postDeleted = createAction<{ id: number }>('Post deleted');

export const settingPage = createAction<{ currentLanguage: Languages; page: number }>('Setting page');

export const paginationSetCurrent = createAction<number>('Set pagination current');

export const paginationSetCount = createAction<number>('Set pagination count');
