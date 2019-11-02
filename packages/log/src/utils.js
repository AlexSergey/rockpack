export const getCurrentDate = () => new Date().toLocaleString();

export const clone = obj => JSON.parse(JSON.stringify(obj));