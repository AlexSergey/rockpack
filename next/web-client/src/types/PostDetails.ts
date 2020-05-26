export interface Photo {
  uri: string;
  thumbnail: string;
}

export interface PostStatistic {
  comments: number;
}

export interface UserStatistic {
  comments: number;
  posts: number;
}

export interface Role {
  role: string;
}

export interface User {
  id: number;
  email: string;
  Statistic: UserStatistic;
  Role: Role;
}

export interface Post {
  updatedAt: Date;
  createdAt: Date;
  title: string;
  text: string;
  id: number;
  Images?: Photo[];
  Statistic: PostStatistic;
  User: User;
}

export interface PostState {
  loading: boolean;
  error: boolean;
  data: Post;
}
