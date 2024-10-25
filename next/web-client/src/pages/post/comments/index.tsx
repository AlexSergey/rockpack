import Localization, { nl, sprintf } from '@localazer/component';
import { ReactElement } from 'react';

import { Error } from '../../../components/error';
import { Loader } from '../../../components/loader';
import { useComments } from '../../../features/comments';
import { CommentComponent } from './comment';

export const Comments = ({ commentsCount, postId }: { commentsCount: number; postId: number }): ReactElement => {
  const [loading, error, comments] = useComments(postId);

  return (
    <>
      <h4>
        <Localization>
          {sprintf(nl('This post has %d comment', 'This post has %d comments', commentsCount), commentsCount)}
        </Localization>
      </h4>
      <div>
        {loading && <Loader />}
        {error && <Error />}
        {comments.map((comment) => (
          <CommentComponent
            createdAt={comment.createdAt}
            id={comment.id}
            key={comment.id}
            text={comment.text}
            user={comment.User}
          />
        ))}
      </div>
    </>
  );
};
