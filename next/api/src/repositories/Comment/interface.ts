import { CommentModel } from '../../models/comment';

export interface ICommentRepository {
  fetchComments(postId: number): Promise<CommentModel[]>;
}
