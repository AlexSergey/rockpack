import React from 'react';
import { Comment } from '../Comment';
import { useComments } from '../../../features/Comments';

export const Comments = ({ postId, commentsCount }: { postId: number; commentsCount: number }): JSX.Element => {
  const [loading, error, comments] = useComments(postId);

  return (
    <>
      <h4>This post has {commentsCount} comments</h4>
      <div>
        {loading && <div>loading</div>}
        {error && <div>error</div>}
        {comments.map(comment => (
          <Comment
            key={comment.id}
            text={comment.text}
            createdAt={comment.createdAt}
          />
        ))}
      </div>
    </>
  );
};
