import { injectable } from 'inversify';

import type { CommentRepositoryInterface } from './interface';

import { ROLE_MODEL_NAME, STATISTIC_MODEL_NAME, USER_MODEL_NAME } from '../../constants/models';
import { InternalError, SequelizeError } from '../../errors';
import { logger } from '../../logger';
import { CommentModel } from '../../models/comment';
import { RoleModel } from '../../models/role';
import { StatisticModel } from '../../models/statistic';
import { StatisticTypeModel } from '../../models/statistic-type';
import { UserModel } from '../../models/user';

@injectable()
export class CommentRepository implements CommentRepositoryInterface {
  fetchComments = async (postId: number): Promise<CommentModel[]> => {
    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user',
      },
    });

    if (!userType) {
      throw new InternalError();
    }
    try {
      return await CommentModel.findAll({
        attributes: {
          exclude: ['post_id', 'user_id'],
        },
        include: [
          {
            as: USER_MODEL_NAME,
            attributes: {
              exclude: ['role_id', 'password'],
            },
            include: [
              {
                as: STATISTIC_MODEL_NAME,
                model: StatisticModel,
                where: {
                  type_id: userType.get('id'),
                },
              },
              {
                as: ROLE_MODEL_NAME,
                attributes: {
                  exclude: ['id'],
                },
                model: RoleModel,
                required: false,
              },
            ],
            model: UserModel,
          },
        ],
        where: {
          post_id: postId,
        },
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
