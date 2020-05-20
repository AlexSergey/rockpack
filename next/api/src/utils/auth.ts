import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createToken = (email, secret, expiresIn): string => (
  jwt.sign({ email }, secret, { expiresIn })
);

export const decodeToken = (token: string, secret: string): object | string => (
  jwt.verify(token, secret)
);

export const isValidPassword = async (userPassword, password): Promise<boolean> => (
  await bcrypt.compare(password, userPassword)
);

interface BcryptResult {
  cryptedPassword: string;
  salt: string;
}

export const cryptPassword = (password): Promise<BcryptResult> => (
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt): void => {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(password, salt, (e, hash): void => {
        if (e) {
          return reject(e);
        }
        resolve({
          cryptedPassword: hash,
          salt
        });
      });
    });
  })
);
