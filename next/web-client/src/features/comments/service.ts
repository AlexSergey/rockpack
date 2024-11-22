import { config } from '../../config';
import { Comment } from '../../types/comments';
import { Rest } from '../../utils/rest';

export interface CommentRes {
  data: { id: number };
}
export interface CommentsRes {
  data: Comment[];
}

export interface CommentsService {
  createComment: (postId: number, text: string) => Promise<CommentRes>;
  deleteComment: (id: number) => Promise<void>;
  fetchComments: (postId: number) => Promise<CommentsRes>;
}

export const commentsService = (rest: Rest): CommentsService => ({
  createComment: (postId, text) => rest.post(`${config.api}/v1/comments/${postId}`, { text }),

  deleteComment: (id) => rest.delete(`${config.api}/v1/comments/${id}`),

  fetchComments: (postId) => rest.get(`${config.api}/v1/comments/${postId}`),
});
