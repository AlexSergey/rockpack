import { readdirSync, copyFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { loadFile } from 'sequelize-fixtures';
import { config } from './src/config';
import * as database from './src/boundaries/database';
import { installMappings } from './src/mappings/mappings';
import { UserModel } from './src/models/User';
import { PostModel } from './src/models/Post';
import { ImageModel } from './src/models/Image';
import { CommentModel } from './src/models/Comment';
import { StatisticModel } from './src/models/Statistic';

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

const dropFixtures = async () => {
  const keys = Object.keys(fixtures);

  for (let i = 0, l = keys.length; i < l; i++) {
    const fixtureName = keys[i];
    const fixture = fixtures[fixtureName];
    const rawdata = readFileSync(fixture);
    const fixtureData = JSON.parse(rawdata.toString());

    for (let j = 0, l2 = fixtureData.length; j < l2; j++) {
      const { model, data } = fixtureData[j];

      await models[model].destroy({
        where: {
          id: data.id
        }
      });

      console.log(`Model ${model}, id ${data.id} deleted`);
    }
  }

  const stats = await StatisticModel.findAll({
    attributes: {
      include: ['id']
    }
  });
  // i should be 1 because 0 statistic is for admin from seed
  const statisticAfterSeedAdmin = 1;
  for (let i = statisticAfterSeedAdmin, l = stats.length; i < l; i++) {
    console.log('Statistic removing...');

    const id = stats[i].get('id');
    await StatisticModel.destroy({
      where: {
        id
      }
    });
  }
}

(async () => {
  await database.start();
  await installMappings();

  await dropFixtures();
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
