import { config } from '../../config';
import { Post } from '../../types/post';
import { Rest } from '../../utils/rest';

export interface PostRes {
  data: Post;
}

export interface PostService {
  fetchPost: (postId: number) => Promise<PostRes>;

  updatePost: (postId: number, post: PostData) => Promise<void>;
}

interface PostData extends Record<string, string> {
  text: string;
  title: string;
}

export const postService = (rest: Rest): PostService => ({
  fetchPost: (postId) => rest.get(`${config.api}/v1/posts/${postId}`),

  updatePost: (postId, post) => rest.put(`${config.api}/v1/posts/${postId}`, post),
});
