import { Comment } from '../../types/Comments';
import config from '../../config';

export type CommentsRes = { data: Comment[] };
export type CommentRes = { data: { id: number } };

export interface CommentsServiceInterface {
  fetchComments: (postId: number) => Promise<CommentsRes>;
  createComment: (postId: number, text: string) => Promise<CommentRes>;
  deleteComment: (id: number) => Promise<void>;
}

export const commentsService = (rest): CommentsServiceInterface => ({
  fetchComments: (postId) => rest.get(`${config.api}/v1/comments/${postId}`),

  createComment: (postId, text) => rest.post(`${config.api}/v1/comments/${postId}`, { text }),

  deleteComment: (id) => rest.delete(`${config.api}/v1/comments/${id}`)
});
