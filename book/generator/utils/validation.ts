import { isValidElement } from 'react';

const showMessage = (field, type, required, message): string => {
  if (message) {
    return message;
  }
  if (required) {
    return `${field} is required field`;
  }

  return `${field} field must be ${type}`;
};

const FIELDS = [
  { field: 'docgen', required: true, type: 'object' },
  { field: 'localization', required: false, type: 'object' },
  { field: 'logo', required: false, type: 'string' },
  { field: 'logoAlt', required: false, type: 'string' },
  { field: 'github', required: false, type: 'string' },
  { field: 'footer', required: false, type: 'any' },
  {
    field: 'components',
    message: 'components is a field with overriding react components to visualize in MDX files',
    required: false,
    type: 'object',
  },
];

const validate = (props: unknown): boolean => {
  let isValid = true;

  FIELDS.forEach((f) => {
    if (!isValid) {
      return false;
    }
    if (f.required && !props[f.field]) {
      isValid = false;
      // eslint-disable-next-line no-console
      console.error(showMessage(f.field, f.type, f.required, f.message));

      return false;
    }
    if (f.type !== 'any') {
      const type = typeof props[f.field];
      if (type !== 'undefined' && type !== f.type) {
        isValid = false;
        // eslint-disable-next-line no-console
        console.error(showMessage(f.field, f.type, f.required, f.message));

        return false;
      }
    }

    if (f.field === 'components' && props[f.field]) {
      const keys = Object.keys(props[f.field]);
      const validComponents = keys.map((c) => {
        const component = props[f.field][c];

        return isValidElement(component);
      });
      if (keys.length !== validComponents.length) {
        isValid = false;
        // eslint-disable-next-line no-console
        console.error(showMessage(f.field, f.type, f.required, f.message));

        return false;
      }
    }
  });

  return isValid;
};

export default validate;
