export type ValidationMessage = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const sequelizeMessage = (e: any): ValidationMessage => {
  const messages: ValidationMessage = {};

  if (e && Array.isArray(e.errors)) {
    e.errors.forEach((error) => {
      let message;
      // eslint-disable-next-line default-case
      switch (error.validatorKey) {
        case 'isEmail':
          message = 'Please enter a valid email';
          break;
        case 'isDate':
          message = 'Please enter a valid date';
          break;
        case 'len':
          if (error.validatorArgs[0] === error.validatorArgs[1]) {
            message = `Use ${error.validatorArgs[0]} characters`;
          } else {
            message = `Use between ${error.validatorArgs[0]} and ${error.validatorArgs[1]} characters`;
          }
          break;
        case 'min':
          message = `Field "${error.path}" is required a number greater or equal to ${error.validatorArgs[0]}`;
          break;
        case 'max':
          message = `Field "${error.path}" is required a number less or equal to ${error.validatorArgs[0]}`;
          break;
        case 'isInt':
          message = `Field "${error.path}" is required a number`;
          break;
        case 'is_null':
          message = `Please complete "${error.path}" field`;
          break;
        case 'not_unique':
          message = `${error.value} is taken. Please choose another one`;
          error.path = error.path.replace('_UNIQUE', '');
      }
      messages[error.path] = message;
    });
  } else if (e?.original && typeof e.original.sqlMessage === 'string') {
    messages.sql = e.original.sqlMessage;
  }

  return messages;
};
