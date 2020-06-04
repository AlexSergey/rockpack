import React from 'react';
import Localization, { nl, sprintf } from '@rockpack/localazer';
import { Comment } from './Comment';
import { useComments } from '../../../features/Comments';
import { Error } from '../../../components/Error';
import { Loader } from '../../../components/Loader';

export const Comments = ({ postId, commentsCount }: { postId: number; commentsCount: number }): JSX.Element => {
  const [loading, error, comments] = useComments(postId);

  return (
    <>
      <h4>
        <Localization>
          {
            sprintf(
              nl(
                'This post has %d comment',
                'This post has %d comments',
                commentsCount
              ),
              commentsCount
            )
          }
        </Localization>
      </h4>
      <div>
        {loading && <Loader />}
        {error && <Error />}
        {comments.map(comment => (
          <Comment
            key={comment.id}
            id={comment.id}
            user={comment.User}
            text={comment.text}
            createdAt={comment.createdAt}
          />
        ))}
      </div>
    </>
  );
};
