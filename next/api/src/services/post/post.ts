import { injectable } from 'inversify';

import { BadRequestError, PostNotFoundError, SequelizeError } from '../../errors';
import { logger } from '../../logger';
import { CommentModel } from '../../models/comment';
import { ImageModel } from '../../models/image';
import { ImageTypeModel } from '../../models/image-type';
import { PostModel } from '../../models/post';
import { IPostData, IPostService } from './interface';

@injectable()
export class PostService implements IPostService {
  createPost = async (userId: number, { photos, preview, text, title }: IPostData): Promise<PostModel> => {
    let post;

    try {
      post = await PostModel.create({
        text,
        title,
        user_id: userId,
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }

    if (preview) {
      const previewType = await ImageTypeModel.findOne({
        where: {
          type: 'preview',
        },
      });

      await ImageModel.create({
        post_id: post.get('id'),
        type_id: previewType.get('id'),
        uri: preview.filename,
      });
    }

    if (photos && Array.isArray(photos)) {
      const photosType = await ImageTypeModel.findOne({
        where: {
          type: 'photos',
        },
      });

      for (let i = 0, l = photos.length; i < l; i++) {
        const photo = photos[i];

        await ImageModel.create({
          post_id: post.get('id'),
          type_id: photosType.get('id'),
          uri: photo.filename,
        });
      }
    }

    return post;
  };

  deletePost = async (postId: number, userId: number): Promise<CommentModel[]> => {
    let comments;
    try {
      comments = await CommentModel.findAll({
        where: {
          post_id: postId,
          user_id: userId,
        },
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }

    const post = await PostModel.destroy({
      individualHooks: true,
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new PostNotFoundError();
    }

    return comments;
  };

  updatePost = async (postId: number, { text, title }: { text?: string; title?: string }): Promise<void> => {
    if (typeof title === 'undefined' && typeof text === 'undefined') {
      throw new BadRequestError();
    }

    const post = await PostModel.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new PostNotFoundError();
    }

    try {
      const commit: Record<string, string> = {};

      if (typeof title === 'string' && title.length > 0) {
        commit.title = title;
      }
      if (typeof text === 'string' && text.length > 0) {
        commit.text = text;
      }

      await PostModel.update(commit, {
        where: {
          id: postId,
        },
      });
    } catch (e) {
      logger.error(e.message);
      throw new SequelizeError(e);
    }
  };
}
