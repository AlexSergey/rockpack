import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createToken = (username, email, secret, expiresIn): string => (
  jwt.sign({ username, email }, secret, { expiresIn })
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
