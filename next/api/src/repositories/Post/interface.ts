import { PostModel } from '../../models/post';

export interface IPostRepository {
  fetchPosts(page: number, limit: number): Promise<{ count: number; rows: PostModel[] }>;

  postDetails(id: number): Promise<PostModel>;
}
