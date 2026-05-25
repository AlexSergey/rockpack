export const check = (str: string): false | string => {
  return typeof str === 'string' ? str : false;
};
