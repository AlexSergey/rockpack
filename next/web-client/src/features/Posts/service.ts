import config from '../../config';
import { Post } from '../../types/Posts';
import { RestInterface } from '../../utils/rest';

export type PostsRes = { data: { posts: Post[]; count: number } };

export type DeletePostRes = { data: { deleteComments: number[] } };

export interface PostsServiceInterface {
  fetchPosts: (page: number) => Promise<PostsRes>;
  createPost: (postData: FormData) => Promise<void>;
  deletePost: (id: number) => Promise<DeletePostRes>;
}

export const postsService = (rest: RestInterface): PostsServiceInterface => ({
  fetchPosts: (page) => rest.get(`${config.api}/v1/posts?page=${page}`),

  createPost: (postData) => rest.post(`${config.api}/v1/posts`, postData),

  deletePost: (id) => rest.delete(`${config.api}/v1/posts/${id}`)
});
