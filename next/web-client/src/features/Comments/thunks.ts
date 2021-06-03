import {
  requestCommentsError,
  requestCommentsSuccess,
  requestComments,
  commentCreated,
  commentDeleted
} from './actions';
import { increaseComment, decreaseComment } from '../__shared/actions';
import { Comment } from '../../types/Comments';
import { CommentsRes, CommentRes } from './service';
import { ThunkResult } from '../../types/thunk';
import { User } from '../../types/User';

export const fetchComments = (postId: number): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    dispatch(requestComments());
    const { data }: CommentsRes = await services.comments.fetchComments(postId);
    dispatch(requestCommentsSuccess(data));
  } catch (error) {
    logger.error(error, false);
    dispatch(requestCommentsError());
  }
};

export const createComment = ({
  text,
  user,
  postId
}: {
  text: string;
  user: User;
  postId: number
}): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    dispatch(requestComments());
    const { data }: CommentRes = await services.comments.createComment(postId, text);

    const comment: Comment = {
      text,
      id: data.id,
      createdAt: new Date().toString(),
      User: {
        id: user.id,
        email: user.email,
        Role: {
          role: user.Role.role
        },
        Statistic: Object.assign({}, user.Statistic)
      }
    };

    dispatch(increaseComment());
    dispatch(commentCreated(comment));
  } catch (error) {
    logger.error(error, false);
  }
};

export const deleteComment = ({
  id,
  owner
}: {
  id: number,
  owner? : boolean
}): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    const ownerState = Boolean(owner);
    await services.comments.deleteComment(id);

    dispatch(commentDeleted({ id }));

    if (ownerState) {
      dispatch(decreaseComment());
    }
  } catch (error) {
    logger.error(error, false);
  }
};
