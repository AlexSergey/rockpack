import { injectable } from 'inversify';
import Sequelize from 'sequelize';

import { config } from '../../config';
import {
  USER_MODEL_NAME,
  ROLE_MODEL_NAME,
  STATISTIC_MODEL_NAME,
  PREVIEW_MODEL_NAME,
  PHOTOS_MODEL_NAME,
} from '../../constants/models';
import { InternalError, SequelizeError } from '../../errors';
import { logger } from '../../logger';
import { ImageModel } from '../../models/image';
import { ImageTypeModel } from '../../models/image-type';
import { PostModel } from '../../models/post';
import { RoleModel } from '../../models/role';
import { StatisticModel } from '../../models/statistic';
import { StatisticTypeModel } from '../../models/statistic-type';
import { UserModel } from '../../models/user';

import { IPostRepository } from './interface';

@injectable()
export class PostRepository implements IPostRepository {
  fetchPosts = async (page: number, limit: number): Promise<{ count: number; rows: PostModel[] }> => {
    const offset = page * limit;

    const postType = await StatisticTypeModel.findOne({
      where: {
        type: 'post',
      },
    });

    if (!postType) {
      throw new InternalError();
    }

    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user',
      },
    });

    const previewType = await ImageTypeModel.findOne({
      where: {
        type: 'preview',
      },
    });

    if (!userType) {
      throw new InternalError();
    }
    if (!previewType) {
      throw new InternalError();
    }

    try {
      return await PostModel.findAndCountAll({
        attributes: {
          exclude: ['user_id', 'text'],
        },
        include: [
          {
            as: USER_MODEL_NAME,
            attributes: {
              exclude: ['password', 'role_id'],
            },
            include: [
              {
                as: STATISTIC_MODEL_NAME,
                model: StatisticModel,
                required: false,
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
          {
            as: STATISTIC_MODEL_NAME,
            attributes: {
              exclude: ['id', 'type_id', 'entity_id', 'posts'],
            },
            model: StatisticModel,
            required: false,
            where: {
              type_id: postType.get('id'),
            },
          },
          {
            as: PREVIEW_MODEL_NAME,
            attributes: {
              exclude: ['id', 'post_id', 'type_id'],
              include: [
                [Sequelize.fn('CONCAT', config.storage, '/', Sequelize.col('uri')), 'uri'],
                [
                  Sequelize.fn('CONCAT', config.storage, '/', config.files.thumbnailPrefix, '-', Sequelize.col('uri')),
                  'thumbnail',
                ],
              ],
            },
            model: ImageModel,
            required: false,
            where: {
              type_id: previewType.get('id'),
            },
          },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };

  postDetails = async (id: number): Promise<PostModel> => {
    const postType = await StatisticTypeModel.findOne({
      where: {
        type: 'post',
      },
    });

    if (!postType) {
      throw new InternalError();
    }

    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user',
      },
    });

    const photosType = await ImageTypeModel.findOne({
      where: {
        type: 'photos',
      },
    });

    if (!userType) {
      throw new InternalError();
    }

    if (!photosType) {
      throw new InternalError();
    }

    try {
      return await PostModel.findOne({
        attributes: {
          exclude: ['user_id'],
        },
        include: [
          {
            as: USER_MODEL_NAME,
            attributes: {
              exclude: ['password'],
            },
            include: [
              {
                as: STATISTIC_MODEL_NAME,
                model: StatisticModel,
                required: false,
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
          {
            as: STATISTIC_MODEL_NAME,
            attributes: {
              exclude: ['id', 'type_id', 'entity_id', 'posts'],
            },
            model: StatisticModel,
            required: false,
            where: {
              type_id: postType.get('id'),
            },
          },
          {
            as: PHOTOS_MODEL_NAME,
            attributes: {
              exclude: ['id', 'post_id', 'type_id'],
              include: [
                [Sequelize.fn('CONCAT', config.storage, '/', Sequelize.col('uri')), 'uri'],
                [
                  Sequelize.fn('CONCAT', config.storage, '/', config.files.thumbnailPrefix, '-', Sequelize.col('uri')),
                  'thumbnail',
                ],
              ],
            },
            model: ImageModel,
            required: false,
            where: {
              type_id: photosType.get('id'),
            },
          },
        ],
        limit: 1,
        where: {
          id,
        },
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
