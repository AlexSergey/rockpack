import { injectable } from 'inversify';
import { UserModel } from '../../models/User';
import { StatisticModel } from '../../models/Statistic';
import { RoleModel } from '../../models/Role';
import { StatisticTypeModel } from '../../models/StatisticType';
import { BadRequest, InternalError, SequelizeError } from '../../errors';
import type { UserRepositoryInterface } from './interface';
import {
  ROLE_MODEL_NAME,
  STATISTIC_MODEL_NAME
} from '../../constants/models';
import { logger } from '../../logger';

@injectable()
export class UserRepository implements UserRepositoryInterface {
  getUserByEmail = async (email: string): Promise<UserModel> => {
    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    try {
      return await UserModel.findOne({
        limit: 1,
        where: {
          email
        },
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
        ]
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };

  getUserById = async (id: number): Promise<UserModel> => {
    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    try {
      return await UserModel.findOne({
        limit: 1,
        where: {
          id
        },
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
        ]
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };

  getUsers = async (): Promise<UserModel[]> => {
    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user'
      }
    });

    if (!userType) {
      throw new InternalError();
    }

    const userRole = await RoleModel.findOne({
      where: {
        role: 'user'
      }
    });

    if (!userRole) {
      throw new BadRequest();
    }

    try {
      return await UserModel.findAll({
        attributes: {
          exclude: ['role_id']
        },
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
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
