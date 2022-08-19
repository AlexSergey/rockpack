import { config } from '../../config';
import { IPost } from '../../types/posts';
import { IRest } from '../../utils/rest';

export type PostsRes = { data: { posts: IPost[]; count: number } };

export type DeletePostRes = { data: { deleteComments: number[] } };

export interface IPostsService {
  fetchPosts: (page: number) => Promise<PostsRes>;
  createPost: (postData: FormData) => Promise<void>;
  deletePost: (id: number) => Promise<DeletePostRes>;
}

export const postsService = (rest: IRest): IPostsService => ({
  createPost: (postData) => rest.post(`${config.api}/v1/posts`, postData),

  deletePost: (id) => rest.delete(`${config.api}/v1/posts/${id}`),

  fetchPosts: (page) => rest.get(`${config.api}/v1/posts?page=${page}`),
});
