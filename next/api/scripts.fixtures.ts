import {
  readdirSync,
  copyFileSync,
  existsSync,
  mkdirSync
} from 'fs';
import { resolve } from 'path';
import { loadFile } from 'sequelize-fixtures';
import { config } from './src/config';
import * as database from './src/boundaries/database';
import { installMappings } from './src/mappings';
import { UserModel } from './src/models/User';
import { PostModel } from './src/models/Post';
import { ImageModel } from './src/models/Image';
import { CommentModel } from './src/models/Comment';

const models = {
  User: UserModel,
  Post: PostModel,
  Image: ImageModel,
  Comment: CommentModel
};

const fixtures = {
  admin: 'fixtures/admin.json',
  user: 'fixtures/user.json',
  posts: 'fixtures/posts.json',
  images: 'fixtures/images.json',
  comments: 'fixtures/comments.json'
};

const IMAGES = 'fixtures/images';

const copy = (folder): Promise<void> => (
  // eslint-disable-next-line promise/param-names
  new Promise((r, reject) => {
    const imagesPath = resolve(__dirname, folder);
    let files;

    try {
      files = readdirSync(imagesPath);
    } catch (e) {
      return reject(e);
    }

    if (!existsSync(resolve(__dirname, config.storage))) {
      try {
        mkdirSync(resolve(__dirname, config.storage));
      } catch (e) {
        return reject(e);
      }
    }

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i];

      try {
        copyFileSync(
          resolve(imagesPath, file),
          resolve(__dirname, config.storage, file)
        );
      } catch (e) {
        return reject(e);
      }
    }

    r();
  })
);

const loadFixture = (file): Promise<unknown> => (
  // eslint-disable-next-line no-shadow,promise/param-names
  new Promise((res, reject) => {
    loadFile(file, models)
      .then(res)
      .catch(reject);
  })
);

(async () => {
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
