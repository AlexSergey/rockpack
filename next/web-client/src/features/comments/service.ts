import { config } from '../../config';
import { IComment } from '../../types/comments';
import { IRest } from '../../utils/rest';

export type CommentsRes = { data: IComment[] };
export type CommentRes = { data: { id: number } };

export interface ICommentsService {
  createComment: (postId: number, text: string) => Promise<CommentRes>;
  deleteComment: (id: number) => Promise<void>;
  fetchComments: (postId: number) => Promise<CommentsRes>;
}

export const commentsService = (rest: IRest): ICommentsService => ({
  createComment: (postId, text) => rest.post(`${config.api}/v1/comments/${postId}`, { text }),

  deleteComment: (id) => rest.delete(`${config.api}/v1/comments/${id}`),

  fetchComments: (postId) => rest.get(`${config.api}/v1/comments/${postId}`),
});
