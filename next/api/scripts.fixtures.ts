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
}

const IMAGES = 'fixtures/images';

const copy = (folder) => (
  new Promise(r => {
    const imagesPath = resolve(__dirname, folder);
    const files = readdirSync(imagesPath);

    if (!existsSync(resolve(__dirname, config.storage))) {
      mkdirSync(resolve(__dirname, config.storage));
    }

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i];

      copyFileSync(
        resolve(imagesPath, file),
        resolve(__dirname, config.storage, file)
      );
    }

    r();
  })
)

const loadFixture = (file): Promise<unknown> => (
  new Promise(resolve => {
    loadFile(file, models).then(resolve);
  })
);

(async () => {
  await database.start();
  await installMappings();

  // admin ID - 2
  await loadFixture(fixtures.admin);
  // user ID - 3
  await loadFixture(fixtures.user);

  await loadFixture(fixtures.posts);

  await loadFixture(fixtures.images);

  await loadFixture(fixtures.comments);

  await copy(IMAGES);

  await database.stop();
})();
