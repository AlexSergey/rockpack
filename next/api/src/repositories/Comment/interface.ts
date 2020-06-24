import { CommentModel } from '../../models/Comment';

export interface CommentRepositoryInterface {
  fetchComments(postId: number): Promise<CommentModel[]>;
}
