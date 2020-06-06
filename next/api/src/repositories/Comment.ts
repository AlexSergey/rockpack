import { StatisticTypeModel } from '../models/StatisticType';
import { InternalError, SequelizeError } from '../errors/errors';
import { CommentModel } from '../models/Comment';
import { UserModel } from '../models/User';
import { StatisticModel } from '../models/Statistic';
import { RoleModel } from '../models/Role';
import {
  USER_MODEL_NAME,
  ROLE_MODEL_NAME,
  STATISTIC_MODEL_NAME
} from '../constants/models';

export class CommentRepository {
  static fetchComments = async (postId: string): Promise<CommentModel[]> => {
    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }
    try {
      return await CommentModel.findAll({
        where: {
          post_id: postId
        },
        include: [
          {
            model: UserModel,
            as: USER_MODEL_NAME,
            include: [
              {
                model: StatisticModel,
                as: STATISTIC_MODEL_NAME,
                where: {
                  type_id: userType.get('id')
                },
                required: false
              },
              {
                model: RoleModel,
                as: ROLE_MODEL_NAME,
                attributes: {
                  exclude: ['id']
                },
                required: false
              }
            ],
            attributes: {
              exclude: ['role_id', 'password']
            }
          }
        ],
        attributes: {
          exclude: ['post_id', 'user_id']
        }
      });
    } catch (e) {
      throw new SequelizeError(e);
    }
  };
}
