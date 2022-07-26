import { injectable } from 'inversify';

import { BadRequestError, CommentNotFoundErrorError, SequelizeError } from '../../errors';
import { logger } from '../../logger';
import { CommentModel } from '../../models/comment';

import type { ICommentService } from './interface';

@injectable()
export class CommentService implements ICommentService {
  createComment = async (userId: number, postId: number, text: string): Promise<CommentModel> => {
    if (typeof text === 'undefined' || (typeof text === 'string' && text === '')) {
      throw new BadRequestError();
    }

    try {
      return await CommentModel.create({
        post_id: postId,
        text,
        user_id: userId,
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };

  deleteComment = async (id: number): Promise<void> => {
    let status;
    try {
      status = await CommentModel.destroy({
        individualHooks: true,
        where: {
          id,
        },
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }

    if (!status) {
      throw new CommentNotFoundErrorError();
    }
  };

  updateComment = async (commentId: number, text: string): Promise<[number, CommentModel[]]> => {
    if (typeof text === 'undefined') {
      throw new BadRequestError();
    }

    try {
      return await CommentModel.update<CommentModel>(
        {
          text,
        },
        {
          where: {
            id: commentId,
          },
        },
      );
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
