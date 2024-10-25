import { CommentModel } from '../../models/comment';

export interface CommentRepositoryInterface {
  fetchComments(postId: number): Promise<CommentModel[]>;
}
