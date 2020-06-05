import { BadRequest, CommentNotFound, SequelizeError } from '../errors/errors';
import { CommentModel } from '../models/Comment';

export class CommentService {
  static createComment = async (userId: number, postId: number, text: string): Promise<CommentModel> => {
    if (typeof text === 'undefined' || (text && text.length === 0)) {
      throw new BadRequest();
    }

    try {
      return await CommentModel.create({
        text,
        user_id: userId,
        post_id: postId
      });
    } catch (e) {
      throw new SequelizeError(e);
    }
  };

  static deleteComment = async (id: number): Promise<void> => {
    let status;
    try {
      status = await CommentModel.destroy({
        where: {
          id
        },
        individualHooks: true
      });
    } catch (e) {
      throw new SequelizeError(e);
    }

    if (!status) {
      throw new CommentNotFound();
    }
  };

  static updateComment = async (userId: number, postId: number, text: string): Promise<CommentModel> => {
    if (typeof text === 'undefined') {
      throw new BadRequest();
    }

    try {
      return await CommentModel.update(
        {
          text
        }, {
          where: {
            user_id: userId,
            post_id: postId
          }
        }
      );
    } catch (e) {
      throw new SequelizeError(e);
    }
  };
}
