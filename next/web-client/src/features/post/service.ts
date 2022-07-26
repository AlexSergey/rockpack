import { config } from '../../config';
import { Post } from '../../types/post';
import { IRest } from '../../utils/rest';

type PostData = {
  title: string;
  text: string;
};

export type PostRes = { data: Post };

export interface IPostService {
  fetchPost: (postId: number) => Promise<PostRes>;

  updatePost: (postId: number, post: PostData) => Promise<void>;
}

export const postService = (rest: IRest): IPostService => ({
  fetchPost: (postId) => rest.get(`${config.api}/v1/posts/${postId}`),

  updatePost: (postId, post) => rest.put(`${config.api}/v1/posts/${postId}`, post),
});
