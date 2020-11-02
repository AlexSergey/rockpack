export const check = (str: string): string | false => {
  return typeof str === 'string' ? str : false
}
