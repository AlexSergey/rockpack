import { injectable } from 'inversify';

import { ROLE_MODEL_NAME, STATISTIC_MODEL_NAME } from '../../constants/models';
import { BadRequestError, InternalError, SequelizeError } from '../../errors';
import { logger } from '../../logger';
import { RoleModel } from '../../models/role';
import { StatisticModel } from '../../models/statistic';
import { StatisticTypeModel } from '../../models/statistic-type';
import { UserModel } from '../../models/user';

import type { IUserRepository } from './interface';

@injectable()
export class UserRepository implements IUserRepository {
  getUserByEmail = async (email: string): Promise<UserModel> => {
    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user',
      },
    });

    if (!userType) {
      throw new InternalError();
    }

    try {
      return await UserModel.findOne({
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
        limit: 1,
        where: {
          email,
        },
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };

  getUserById = async (id: number): Promise<UserModel> => {
    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user',
      },
    });

    if (!userType) {
      throw new InternalError();
    }

    try {
      return await UserModel.findOne({
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

  getUsers = async (): Promise<UserModel[]> => {
    const userType = await StatisticTypeModel.findOne({
      where: {
        type: 'user',
      },
    });

    if (!userType) {
      throw new InternalError();
    }

    const userRole = await RoleModel.findOne({
      where: {
        role: 'user',
      },
    });

    if (!userRole) {
      throw new BadRequestError();
    }

    try {
      return await UserModel.findAll({
        attributes: {
          exclude: ['role_id'],
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
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
