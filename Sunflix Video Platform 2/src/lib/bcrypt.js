import bcrypt from 'bcryptjs';

export function hash(password, saltRounds = 10) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hashed) => {
      if (err) return reject(err);
      resolve(hashed);
    });
  });
}

export function compare(password, hashStr) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashStr, (err, same) => {
      if (err) return reject(err);
      resolve(same);
    });
  });
}

export default { hash, compare };
