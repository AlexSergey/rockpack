import fs from 'fs';
import path from 'path';
import sequelizeFixtures from 'sequelize-fixtures';
import { config } from './src/config';
import * as database from './src/boundaries/database';
import { UserModel } from './src/models/User';
import { PostModel } from './src/models/Post';
import { ImageModel } from './src/models/Image';
import { CommentModel } from './src/models/Comment';

const IMAGES = 'fixtures/images';

const copy = (folder) => (
  new Promise(resolve => {
    const imagesPath = path.resolve(__dirname, folder);
    const files = fs.readdirSync(imagesPath);

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i];

      fs.copyFileSync(
        path.resolve(imagesPath, file),
        path.resolve(__dirname, config.storage, file)
      );
    }

    resolve();
  })
)

const loadFixture = (file): Promise<unknown> => (
  new Promise(resolve => {
    sequelizeFixtures.loadFile(file, {
      User: UserModel,
      Post: PostModel,
      Image: ImageModel,
      Comment: CommentModel
    }).then(resolve);
  })
);

(async () => {
  await database.start();

  /*await UserModel.destroy({
    where: {},
    truncate: true
  });*/
  // admin ID - 2
  await loadFixture('fixtures/admin.json');
  // user ID - 3
  await loadFixture('fixtures/user.json');

  await loadFixture('fixtures/posts.json');

  await loadFixture('fixtures/images.json');

  await copy(IMAGES);
  /*const doStuffAfterLoad = () => {
    console.log('done');
  };*/

})();
