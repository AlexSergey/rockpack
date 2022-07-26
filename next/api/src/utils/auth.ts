import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createToken = (email: string, secret: string, expiresIn: string): string =>
  jwt.sign({ email }, secret, { expiresIn });

export const decodeToken = (token: string, secret: string): unknown => jwt.verify(token, secret);

export const isValidPassword = async (userPassword: string, password: string): Promise<boolean> =>
  await bcrypt.compare(password, userPassword);

interface IBcryptResult {
  cryptedPassword: string;
  salt: string;
}

export const cryptPassword = (password: string): Promise<IBcryptResult> =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    bcrypt.genSalt(10, (err, salt): void => {
      if (err) {
        return reject(err);
      }
      // eslint-disable-next-line consistent-return
      bcrypt.hash(password, salt, (e, hash): void => {
        if (e) {
          return reject(e);
        }
        resolve({
          cryptedPassword: hash,
          salt,
        });
      });
    });
  });
