import { useSelector } from 'react-redux';

export const useUserStatistic = (): { comments: number; posts: number } => {
  const { comments, posts } = useSelector<{ userStatistic: any }, any>(state => state.userStatistic);

  return {
    comments, posts
  };
};
