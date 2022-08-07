import { config } from '../../config';
import { container } from '../../container';
import { IPost, PostModel } from '../../models/post';
import { IUser, UserModel } from '../../models/user';
import { PostRepositoryDIType, IPostRepository } from '../../repositories/post';
import { UserRepositoryDIType, IUserRepository } from '../../repositories/user';
import { CommentServiceDIType } from '../comment';
import type { ICommentService } from '../comment';
import { UserServiceDIType, IUserService } from '../user';

import { PostServiceDIType } from './di.type';
import { IPostService } from './interface';

interface IUserFull extends IUser {
  Statistic: {
    posts: number;
    comments: number;
  };
  Role: {
    role: string;
  };
}

interface IPostDetails extends IPost {
  User: IUserFull;
  Statistic: {
    comments: number;
  };
}

let newuser;
let userRepository;
let postRepository;
let userService;
let postService;
let commentService;

beforeAll(async () => {
  userRepository = container.get<IUserRepository>(UserRepositoryDIType);
  postRepository = container.get<IPostRepository>(PostRepositoryDIType);
  userService = container.get<IUserService>(UserServiceDIType);
  postService = container.get<IPostService>(PostServiceDIType);
  commentService = container.get<ICommentService>(CommentServiceDIType);

  const data = await userService.signup('test_user_for_posts@text.mail', '123456');
  if (data && data.user) {
    newuser = data.user;
  }
});

afterAll(async () => {
  await newuser.destroy({
    individualHooks: true,
  });
  PostModel.sequelize.close();
  UserModel.sequelize.close();
});

describe('PostService tests', () => {
  test('createPost', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      text: 'test text',
      title: 'test title',
    });

    const IPostDetails = await postRepository.IPostDetails(post.get('id'));
    const details = IPostDetails.toJSON() as IPostDetails;
    const u = await userRepository.getUserById(newuser.get('id'));

    expect(details).toEqual({
      Photos: [],
      Statistic: {
        comments: 0,
      },
      User: {
        Role: { role: 'user' },
        Statistic: { comments: 0, posts: 1 },
        email: u.get('email'),
        id: u.get('id'),
        role_id: u.get('role_id'),
      },
      createdAt: IPostDetails.get('createdAt'),
      id: IPostDetails.get('id'),
      text: 'test text',
      title: 'test title',
      updatedAt: IPostDetails.get('updatedAt'),
    });
  });

  test('createPost with photos', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      photos: [{ filename: 'img1.png' }, { filename: 'img2.png' }, { filename: 'img3.png' }],
      text: 'test text',
      title: 'test title',
    });
    const IPostDetails = await postRepository.IPostDetails(post.get('id'));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(IPostDetails.toJSON().Photos).toEqual([
      { thumbnail: `${config.storage}/${config.files.thumbnailPrefix}-img1.png`, uri: `${config.storage}/img1.png` },
      { thumbnail: `${config.storage}/${config.files.thumbnailPrefix}-img2.png`, uri: `${config.storage}/img2.png` },
      { thumbnail: `${config.storage}/${config.files.thumbnailPrefix}-img3.png`, uri: `${config.storage}/img3.png` },
    ]);
  });

  test('createPost with preview', async () => {
    const p = await postService.createPost(newuser.get('id'), {
      preview: { filename: 'img1.png' },
      text: 'test text 2',
      title: 'test title 2',
    });
    const { rows } = await postRepository.fetchPosts(0, 100);
    const post = rows.find((r) => r.get('id') === p.get('id'));
    const postData = post.toJSON();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(postData.Preview).toEqual({
      thumbnail: `${config.storage}/${config.files.thumbnailPrefix}-img1.png`,
      uri: `${config.storage}/img1.png`,
    });
  });

  test('createComment in the post', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      text: 'test text',
      title: 'with comment',
    });
    let IPostDetails = await postRepository.IPostDetails(post.get('id'));
    let details = IPostDetails.toJSON() as IPostDetails;
    const oldComments = details.Statistic.comments;
    await commentService.createComment(newuser.get('id'), details.id, 'test comment');
    IPostDetails = await postRepository.IPostDetails(post.get('id'));
    details = IPostDetails.toJSON() as IPostDetails;
    const newComments = details.Statistic.comments;

    expect(oldComments).toBe(0);
    expect(newComments).toBe(1);
  });

  test('deletePost in the post', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      text: 'test text',
      title: 'post for deleting',
    });
    const id = post.get('id');
    const p = await postRepository.IPostDetails(post.get('id'));

    expect(id).toBe(p.get('id'));
  });
});
