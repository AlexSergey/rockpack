import { PostModel } from '../../models/Post';

export interface PostRepositoryInterface {
  fetchPosts(page: number, limit: number): Promise<{ count: number; rows: PostModel[] }>;

  postDetails(id: number): Promise<PostModel>;
}
