import { BaseError as SequelizeBaseError } from 'sequelize';

import { DATABASE_ERROR } from '../constants/messages';
import { Statuses } from '../utils/get-status';
import { sequelizeMessage } from '../utils/sequelize-message';

import { BaseError } from './_base-error';
import type { IError } from './_types';

export class SequelizeError extends BaseError implements IError {
  public code = DATABASE_ERROR.code;

  public statusCode = DATABASE_ERROR.statusCode;

  public message = DATABASE_ERROR.message;

  public status = Statuses.error;

  constructor(e: SequelizeBaseError | IError) {
    super();
    this.name = 'SequelizeError';

    if (e instanceof SequelizeBaseError) {
      const messages = sequelizeMessage(e);

      const message = Object.keys(messages)
        .map((key) => messages[key])
        .join('; ');

      this.message = message;
    } else if (e instanceof BaseError) {
      this.code = e.code;
      this.statusCode = e.statusCode;
      this.status = e.status;
      this.message = e.message;
    }
  }
}
