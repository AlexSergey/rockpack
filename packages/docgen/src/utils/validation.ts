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
  { field: 'docgen', type: 'object', required: true },
  { field: 'localization', type: 'object', required: false },
  { field: 'logo', type: 'string', required: false },
  { field: 'logoAlt', type: 'string', required: false },
  { field: 'github', type: 'string', required: false },
  { field: 'footer', type: 'any', required: false },
  {
    field: 'components',
    type: 'object',
    required: false,
    message: 'components is a field with overriding react components to visualize in MDX files'
  },
];

const validate = (props): boolean => {
  let isValid = true;
  
  FIELDS.forEach(f => {
    if (!isValid) {
      return false;
    }
    if (f.required) {
      if (!props[f.field]) {
        isValid = false;
        console.error(showMessage(f.field, f.type, f.required, f.message));
        return false;
      }
    }
    if (f.type !== 'any') {
      const type = typeof props[f.field];
      if (type !== 'undefined' && type !== f.type) {
        isValid = false;
        console.error(showMessage(f.field, f.type, f.required, f.message));
        return false;
      }
    }
    
    if (f.field === 'components') {
      if (props[f.field]) {
        const keys = Object.keys(props[f.field]);
        const validComponents = keys.map(c => {
          const component = props[f.field][c];
          return isValidElement(component);
        });
        if (keys.length !== validComponents.length) {
          isValid = false;
          console.error(showMessage(f.field, f.type, f.required, f.message));
          return false;
        }
      }
    }
  });
  
  return isValid;
};

export default validate;
