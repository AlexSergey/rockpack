import { CommentModel } from '../../models/comment';
import { PostModel } from '../../models/post';

export interface IPostData {
  photos?: { filename: string }[];
  preview?: { filename: string };
  text: string;
  title: string;
}

export interface IPostService {
  createPost(userId: number, postData: IPostData): Promise<PostModel>;

  deletePost(postId: number, userId: number): Promise<CommentModel[]>;

  updatePost(postId: number, postData: { text?: string; title?: string }): Promise<void>;
}
