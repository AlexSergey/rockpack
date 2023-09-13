import Localization, { nl, sprintf } from '@localazer/component';

import { Error } from '../../../components/error';
import { Loader } from '../../../components/loader';
import { useComments } from '../../../features/comments';

import { Comment } from './comment';

export const Comments = ({ postId, commentsCount }: { postId: number; commentsCount: number }): JSX.Element => {
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
