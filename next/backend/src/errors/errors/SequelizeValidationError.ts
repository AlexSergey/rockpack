import { BaseError } from 'sequelize';
import { BAD_REQUEST } from '../constants/messages';
import { getStatus } from '../utils/getStatus';
import { sequelizeMessage } from '../utils/sequelizeMessage';
import { ErrorInterface } from './types';

export class SequelizeValidationError extends Error implements ErrorInterface {
  public code = BAD_REQUEST.code;

  public statusCode = BAD_REQUEST.statusCode;

  public status = getStatus(BAD_REQUEST.statusCode);

  constructor(e: BaseError) {
    super();
    const messages = sequelizeMessage(e);

    const message = Object.keys(messages)
      .map(key => messages[key])
      .join('; ');

    this.message = message;
  }
}
