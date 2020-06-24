import { CommentModel } from '../../models/Comment';

export interface CommentServiceInterface {
  createComment(userId: number, postId: number, text: string): Promise<CommentModel>;

  deleteComment(id: number): Promise<void>;

  updateComment(commentId: number, text: string): Promise<[number, CommentModel[]]>;
}
