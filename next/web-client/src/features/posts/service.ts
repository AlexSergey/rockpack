import { config } from '../../config';
import { IPost } from '../../types/posts';
import { IRest } from '../../utils/rest';

export type PostsRes = { data: { count: number; posts: IPost[] } };

export type DeletePostRes = { data: { deleteComments: number[] } };

export interface IPostsService {
  createPost: (postData: FormData) => Promise<void>;
  deletePost: (id: number) => Promise<DeletePostRes>;
  fetchPosts: (page: number) => Promise<PostsRes>;
}

export const postsService = (rest: IRest): IPostsService => ({
  createPost: (postData) => rest.post(`${config.api}/v1/posts`, postData),

  deletePost: (id) => rest.delete(`${config.api}/v1/posts/${id}`),

  fetchPosts: (page) => rest.get(`${config.api}/v1/posts?page=${page}`),
});
