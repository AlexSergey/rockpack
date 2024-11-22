import { config } from '../../config';
import { Post } from '../../types/posts';
import { Rest } from '../../utils/rest';

export interface DeletePostRes {
  data: { deleteComments: number[] };
}

export interface PostsRes {
  data: { count: number; posts: Post[] };
}

export interface PostsService {
  createPost: (postData: FormData) => Promise<void>;
  deletePost: (id: number) => Promise<DeletePostRes>;
  fetchPosts: (page: number) => Promise<PostsRes>;
}

export const postsService = (rest: Rest): PostsService => ({
  createPost: (postData) => rest.post(`${config.api}/v1/posts`, postData),

  deletePost: (id) => rest.delete(`${config.api}/v1/posts/${id}`),

  fetchPosts: (page) => rest.get(`${config.api}/v1/posts?page=${page}`),
});
