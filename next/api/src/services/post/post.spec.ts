import type { CommentServiceInterface } from '../comment';

import { config } from '../../config';
import { container } from '../../container';
import { Post, PostModel } from '../../models/post';
import { UserInterface, UserModel } from '../../models/user';
import { PostRepositoryDIType, PostRepositoryInterface } from '../../repositories/post';
import { UserRepositoryDIType, UserRepositoryInterface } from '../../repositories/user';
import { CommentServiceDIType } from '../comment';
import { UserServiceDIType, UserServiceInterface } from '../user';
import { PostServiceDIType } from './di.type';
import { PostServiceInterface } from './interface';

interface UserFull extends UserInterface {
  Role: {
    role: string;
  };
  Statistic: {
    comments: number;
    posts: number;
  };
}

interface PostDetails extends Post {
  Statistic: {
    comments: number;
  };
  User: UserFull;
}

let newuser;
let userRepository;
let postRepository;
let userService;
let postService;
let commentService;

beforeAll(async () => {
  userRepository = container.get<UserRepositoryInterface>(UserRepositoryDIType);
  postRepository = container.get<PostRepositoryInterface>(PostRepositoryDIType);
  userService = container.get<UserServiceInterface>(UserServiceDIType);
  postService = container.get<PostServiceInterface>(PostServiceDIType);
  commentService = container.get<CommentServiceInterface>(CommentServiceDIType);

  const data = await userService.signup('test_user_for_posts@text.mail', '123456');
  if (data?.user) {
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

const title = 'test title';

describe('PostService tests', () => {
  test('createPost', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      text: 'test text',
      title,
    });

    const IPostDetails = await postRepository.postDetails(post.get('id'));
    const details = IPostDetails.toJSON() as PostDetails;
    const u = await userRepository.getUserById(newuser.get('id'));

    expect(details).toEqual({
      createdAt: IPostDetails.get('createdAt'),
      id: IPostDetails.get('id'),
      Photos: [],
      Statistic: {
        comments: 0,
      },
      text: 'test text',
      title,
      updatedAt: IPostDetails.get('updatedAt'),
      User: {
        email: u.get('email'),
        id: u.get('id'),
        Role: { role: 'user' },
        role_id: u.get('role_id'),
        Statistic: { comments: 0, posts: 1 },
      },
    });
  });

  test('createPost with photos', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      photos: [{ filename: 'img1.png' }, { filename: 'img2.png' }, { filename: 'img3.png' }],
      text: 'test text',
      title,
    });
    const IPostDetails = await postRepository.postDetails(post.get('id'));

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
    let IPostDetails = await postRepository.postDetails(post.get('id'));
    let details = IPostDetails.toJSON() as PostDetails;
    const oldComments = details.Statistic.comments;
    await commentService.createComment(newuser.get('id'), details.id, 'test comment');
    IPostDetails = await postRepository.postDetails(post.get('id'));
    details = IPostDetails.toJSON() as PostDetails;
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
    const p = await postRepository.postDetails(post.get('id'));

    expect(id).toBe(p.get('id'));
  });
});
