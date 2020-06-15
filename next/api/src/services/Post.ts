import { PostModel } from '../models/Post';
import { ImageTypeModel } from '../models/ImageType';
import { ImageModel } from '../models/Image';
import { CommentModel } from '../models/Comment';
import { BadRequest, PostNotFound, SequelizeError } from '../errors/errors';
import { logger } from '../logger';

export class PostService {
  static createPost = async (userId: string, {
    title,
    text,
    preview,
    photos
  }: {
    title: string;
    text: string;
    preview?: { filename: string };
    photos: { filename: string }[];
  }): Promise<PostModel> => {
    let post;

    try {
      post = await PostModel.create({
        user_id: userId, title, text
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }

    if (preview) {
      const previewType = await ImageTypeModel.findOne({
        where: {
          type: 'preview'
        }
      });

      await ImageModel.create({
        post_id: post.get('id'),
        type_id: previewType.get('id'),
        uri: preview.filename
      });
    }

    if (photos && Array.isArray(photos)) {
      const photosType = await ImageTypeModel.findOne({
        where: {
          type: 'photos'
        }
      });

      for (let i = 0, l = photos.length; i < l; i++) {
        const photo = photos[i];

        await ImageModel.create({
          post_id: post.get('id'),
          type_id: photosType.get('id'),
          uri: photo.filename
        });
      }
    }

    return post;
  };

  static deletePost = async (postId: string, userId: string): Promise<CommentModel[]> => {
    let comments;
    try {
      comments = await CommentModel.findAll({
        where: {
          post_id: postId,
          user_id: userId
        },
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }

    const post = await PostModel.destroy({
      where: {
        id: postId
      },
      individualHooks: true
    });

    if (!post) {
      throw new PostNotFound();
    }

    return comments;
  };

  static updatePost = async (postId: string, { title, text }: { title? : string; text?: string }): Promise<void> => {
    if (typeof title === 'undefined' && typeof text === 'undefined') {
      throw new BadRequest();
    }

    const post = await PostModel.findOne({
      where: {
        id: postId
      }
    });

    if (!post) {
      throw new PostNotFound();
    }

    try {
      const commit: { [key: string]: string } = {};

      if (typeof title === 'string' && title.length > 0) {
        commit.title = title;
      }
      if (typeof text === 'string' && text.length > 0) {
        commit.text = text;
      }

      await PostModel.update(commit, {
        where: {
          id: postId
        }
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
