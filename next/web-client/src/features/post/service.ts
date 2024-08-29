import { config } from '../../config';
import { IPost } from '../../types/post';
import { IRest } from '../../utils/rest';

interface IPostData extends Record<string, string> {
  text: string;
  title: string;
}

export interface IPostRes {
  data: IPost;
}

export interface IPostService {
  fetchPost: (postId: number) => Promise<IPostRes>;

  updatePost: (postId: number, post: IPostData) => Promise<void>;
}

export const postService = (rest: IRest): IPostService => ({
  fetchPost: (postId) => rest.get(`${config.api}/v1/posts/${postId}`),

  updatePost: (postId, post) => rest.put(`${config.api}/v1/posts/${postId}`, post),
});
