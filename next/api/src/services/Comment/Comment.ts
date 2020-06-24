import { injectable } from 'inversify';
import { BadRequest, CommentNotFound, SequelizeError } from '../../errors';
import { CommentModel } from '../../models/Comment';
import { logger } from '../../logger';
import { CommentServiceInterface } from './interface';

@injectable()
export class CommentService implements CommentServiceInterface {
  createComment = async (userId: number, postId: number, text: string): Promise<CommentModel> => {
    if (typeof text === 'undefined' || (typeof text === 'string' && text === '')) {
      throw new BadRequest();
    }

    try {
      return await CommentModel.create({
        text,
        user_id: userId,
        post_id: postId
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
        where: {
          id
        },
        individualHooks: true
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }

    if (!status) {
      throw new CommentNotFound();
    }
  };

  updateComment = async (commentId: number, text: string): Promise<[number, CommentModel[]]> => {
    if (typeof text === 'undefined') {
      throw new BadRequest();
    }

    try {
      return await CommentModel.update<CommentModel>(
        {
          text
        }, {
          where: {
            id: commentId
          }
        }
      );
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
