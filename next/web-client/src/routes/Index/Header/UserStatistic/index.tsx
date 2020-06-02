import React from 'react';
import { useUserStatistic } from '../../../../features/User';

export const UserStatistic = (): JSX.Element => {
  const { comments, posts } = useUserStatistic();

  return (
    <span>
      <span style={{ color: 'white' }}>Comments: {comments}</span>
      <span style={{ color: 'white' }}>Posts: {posts}</span>
    </span>
  );
};
