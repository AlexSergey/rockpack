import { PostModel } from '../../models/Post';
import { CommentModel } from '../../models/Comment';

export type PostData = {
  title: string;
  text: string;
  preview?: { filename: string };
  photos?: { filename: string }[];
};

export interface PostServiceInterface {
  createPost(userId: number, postData: PostData): Promise<PostModel>;

  deletePost(postId: number, userId: number): Promise<CommentModel[]>;

  updatePost(postId: number, postData: { title?: string; text?: string }): Promise<void>;
}
