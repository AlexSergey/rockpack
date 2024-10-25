import { CommentModel } from '../../models/comment';
import { PostModel } from '../../models/post';

export interface PostData {
  photos?: { filename: string }[];
  preview?: { filename: string };
  text: string;
  title: string;
}

export interface PostServiceInterface {
  createPost(userId: number, postData: PostData): Promise<PostModel>;

  deletePost(postId: number, userId: number): Promise<CommentModel[]>;

  updatePost(postId: number, postData: { text?: string; title?: string }): Promise<void>;
}
