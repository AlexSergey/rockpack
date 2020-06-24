import { injectable } from 'inversify';
import Sequelize from 'sequelize';
import { StatisticTypeModel } from '../../models/StatisticType';
import { InternalError, SequelizeError } from '../../errors';
import { ImageTypeModel } from '../../models/ImageType';
import { PostModel } from '../../models/Post';
import { UserModel } from '../../models/User';
import { StatisticModel } from '../../models/Statistic';
import { RoleModel } from '../../models/Role';
import { ImageModel } from '../../models/Image';
import { config } from '../../config';
import { PostRepositoryInterface } from './interface';
import {
  USER_MODEL_NAME,
  ROLE_MODEL_NAME,
  STATISTIC_MODEL_NAME,
  PREVIEW_MODEL_NAME,
  PHOTOS_MODEL_NAME
} from '../../constants/models';
import { logger } from '../../logger';

@injectable()
export class PostRepository implements PostRepositoryInterface {
  fetchPosts = async (page: number, limit: number): Promise<{ count: number; rows: PostModel[] }> => {
    const offset = page * limit;

    const postType = await StatisticTypeModel.findOne({
      where: {
        type: 'post'
      }
    });

    if (!postType) {
      throw new InternalError();
    }

    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user'
      }
    });

    const previewType = await ImageTypeModel.findOne({
      where: {
        type: 'preview'
      }
    });

    if (!userType) {
      throw new InternalError();
    }
    if (!previewType) {
      throw new InternalError();
    }

    try {
      return await PostModel.findAndCountAll({
        offset,
        limit,
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
              exclude: ['password', 'role_id']
            }
          },
          {
            model: StatisticModel,
            as: STATISTIC_MODEL_NAME,
            where: {
              type_id: postType.get('id')
            },
            attributes: {
              exclude: ['id', 'type_id', 'entity_id', 'posts']
            },
            required: false
          },
          {
            model: ImageModel,
            as: PREVIEW_MODEL_NAME,
            where: {
              type_id: previewType.get('id')
            },
            attributes: {
              exclude: ['id', 'post_id', 'type_id'],
              include: [
                [Sequelize.fn('CONCAT', config.storage, '/', Sequelize.col('uri')), 'uri'],
                [Sequelize.fn('CONCAT', config.storage, '/', config.files.thumbnailPrefix, '-', Sequelize.col('uri')), 'thumbnail']
              ],
            },
            required: false
          }
        ],
        attributes: {
          exclude: ['user_id', 'text']
        },
        order: [
          ['createdAt', 'DESC']
        ],
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };

  postDetails = async (id: number): Promise<PostModel> => {
    const postType = await StatisticTypeModel.findOne({
      where: {
        type: 'post'
      }
    });

    if (!postType) {
      throw new InternalError();
    }

    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user'
      }
    });

    const photosType = await ImageTypeModel.findOne({
      where: {
        type: 'photos'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    if (!photosType) {
      throw new InternalError();
    }

    try {
      return await PostModel.findOne({
        limit: 1,
        where: {
          id
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
              exclude: ['password']
            }
          },
          {
            model: StatisticModel,
            as: STATISTIC_MODEL_NAME,
            where: {
              type_id: postType.get('id')
            },
            attributes: {
              exclude: ['id', 'type_id', 'entity_id', 'posts']
            },
            required: false
          },
          {
            model: ImageModel,
            as: PHOTOS_MODEL_NAME,
            where: {
              type_id: photosType.get('id')
            },
            attributes: {
              exclude: ['id', 'post_id', 'type_id'],
              include: [
                [Sequelize.fn('CONCAT', config.storage, '/', Sequelize.col('uri')), 'uri'],
                [Sequelize.fn('CONCAT', config.storage, '/', config.files.thumbnailPrefix, '-', Sequelize.col('uri')), 'thumbnail']
              ],
            },
            required: false
          }
        ],
        attributes: {
          exclude: ['user_id']
        }
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
