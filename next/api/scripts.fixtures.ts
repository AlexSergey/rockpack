import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadFile } from 'sequelize-fixtures';

import { config } from './src/config';

// eslint-disable-next-line perfectionist/sort-imports
import * as database from './src/boundaries/database';
import { installMappings } from './src/mappings';
import { CommentModel } from './src/models/comment';
import { ImageModel } from './src/models/image';
import { PostModel } from './src/models/post';
import { UserModel } from './src/models/user';

const models = {
  Comment: CommentModel,
  Image: ImageModel,
  Post: PostModel,
  User: UserModel,
};

const fixtures = {
  admin: 'fixtures/admin.json',
  comments: 'fixtures/comments.json',
  images: 'fixtures/images.json',
  posts: 'fixtures/posts.json',
  user: 'fixtures/user.json',
};

const IMAGES = 'fixtures/images';

const copy = (folder): Promise<void> =>
  new Promise((r, reject) => {
    const imagesPath = resolve(__dirname, folder);
    let files;

    try {
      files = readdirSync(imagesPath);
    } catch (e) {
      reject(e);
    }

    if (!existsSync(resolve(__dirname, config.storage))) {
      try {
        mkdirSync(resolve(__dirname, config.storage));
      } catch (e) {
        reject(e);
      }
    }

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i];

      try {
        copyFileSync(resolve(imagesPath, file), resolve(__dirname, config.storage, file));
      } catch (e) {
        reject(e);
      }
    }

    r();
  });

const loadFixture = (file): Promise<unknown> =>
  new Promise((res, reject) => {
    loadFile(file, models).then(res).catch(reject);
  });

(async (): Promise<void> => {
  await database.start();
  await installMappings();

  try {
    // admin ID - 2
    await loadFixture(fixtures.admin);
    // user ID - 3
    await loadFixture(fixtures.user);

    await loadFixture(fixtures.posts);

    await loadFixture(fixtures.images);

    await loadFixture(fixtures.comments);
  } catch (e) {
    console.log(e);
    await database.stop();
    process.exit(1);
  }

  try {
    await copy(IMAGES);
  } catch (e) {
    console.log(e);
    await database.stop();
    process.exit(1);
  }

  await database.stop();
})();
