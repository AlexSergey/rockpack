import { config } from '../../config';
import { IComment } from '../../types/comments';
import { IRest } from '../../utils/rest';

export interface ICommentsRes {
  data: IComment[];
}
export interface ICommentRes {
  data: { id: number };
}

export interface ICommentsService {
  createComment: (postId: number, text: string) => Promise<ICommentRes>;
  deleteComment: (id: number) => Promise<void>;
  fetchComments: (postId: number) => Promise<ICommentsRes>;
}

export const commentsService = (rest: IRest): ICommentsService => ({
  createComment: (postId, text) => rest.post(`${config.api}/v1/comments/${postId}`, { text }),

  deleteComment: (id) => rest.delete(`${config.api}/v1/comments/${id}`),

  fetchComments: (postId) => rest.get(`${config.api}/v1/comments/${postId}`),
});
