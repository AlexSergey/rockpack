import React from 'react';
import { useComments } from '../../../../features/Comments';

export const Comments = ({ postId }: { postId: string }): JSX.Element => {
  const [loading, error, data] = useComments(postId);
  console.log(data);
  return (
    <>
      <div>
        {loading && <div>loading</div>}
        {error && <div>error</div>}
        comments
      </div>
    </>
  );
};
