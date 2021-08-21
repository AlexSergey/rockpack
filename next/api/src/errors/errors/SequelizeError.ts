import { BaseError as SequelizeBaseError } from 'sequelize';
import { BaseError } from './_BaseError';
import type { ErrorInterface } from './_types';
import { DATABASE_ERROR } from '../constants/messages';
import { Statuses } from '../utils/getStatus';
import { sequelizeMessage } from '../utils/sequelizeMessage';

export class SequelizeError extends BaseError implements ErrorInterface {
  public code = DATABASE_ERROR.code;

  public statusCode = DATABASE_ERROR.statusCode;

  public message = DATABASE_ERROR.message;

  public status = Statuses.error;

  constructor(e: SequelizeBaseError | ErrorInterface) {
    super();

    if (e instanceof SequelizeBaseError) {
      const messages = sequelizeMessage(e);

      const message = Object.keys(messages)
        .map(key => messages[key])
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
