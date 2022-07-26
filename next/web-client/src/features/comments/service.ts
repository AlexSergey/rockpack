import { config } from '../../config';
import { IComment } from '../../types/comments';
import { IRest } from '../../utils/rest';

export type CommentsRes = { data: IComment[] };
export type CommentRes = { data: { id: number } };

export interface ICommentsService {
  fetchComments: (postId: number) => Promise<CommentsRes>;
  createComment: (postId: number, text: string) => Promise<CommentRes>;
  deleteComment: (id: number) => Promise<void>;
}

export const commentsService = (rest: IRest): ICommentsService => ({
  createComment: (postId, text) => rest.post(`${config.api}/v1/comments/${postId}`, { text }),

  deleteComment: (id) => rest.delete(`${config.api}/v1/comments/${id}`),

  fetchComments: (postId) => rest.get(`${config.api}/v1/comments/${postId}`),
});
