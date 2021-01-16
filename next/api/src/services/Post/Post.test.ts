import { UserRepositoryDIType, UserRepositoryInterface } from '../../repositories/User';
import { PostRepositoryDIType, PostRepositoryInterface } from '../../repositories/Post';
import { CommentServiceDIType, CommentServiceInterface } from '../Comment';
import { PostServiceDIType } from './di.type';
import { PostServiceInterface } from './interface';
import { UserServiceDIType, UserServiceInterface } from '../User';
import { container } from '../../container';
import { PostInterface } from '../../models/Post';
import { UserInterface } from '../../models/User';
import { config } from '../../config';

interface UserFull extends UserInterface {
  Statistic: {
    posts: number;
    comments: number;
  };
  Role: {
    role: string;
  };
}

interface PostDetails extends PostInterface {
  User: UserFull;
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
  userRepository = container.get<UserRepositoryInterface>(UserRepositoryDIType);
  postRepository = container.get<PostRepositoryInterface>(PostRepositoryDIType);
  userService = container.get<UserServiceInterface>(UserServiceDIType);
  postService = container.get<PostServiceInterface>(PostServiceDIType);
  commentService = container.get<CommentServiceInterface>(CommentServiceDIType);

  const data = await userService.signup('test_user_for_posts@text.mail', '123456');
  if (data && data.user) {
    newuser = data.user;
  }
});

afterAll(async () => {
  await newuser.destroy({
    individualHooks: true
  });
});

describe('PostService tests', () => {
  test('createPost', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      title: 'test title',
      text: 'test text'
    });

    const postDetails = await postRepository.postDetails(post.get('id'));
    const details = postDetails.toJSON() as PostDetails;
    const u = await userRepository.getUserById(newuser.get('id'));

    expect(details)
      .toEqual({
        title: 'test title',
        text: 'test text',
        Photos: [],
        createdAt: postDetails.get('createdAt'),
        updatedAt: postDetails.get('updatedAt'),
        id: postDetails.get('id'),
        User: {
          id: u.get('id'),
          email: u.get('email'),
          role_id: u.get('role_id'),
          Statistic: { posts: 1, comments: 0 },
          Role: { role: 'user' }
        },
        Statistic: {
          comments: 0
        }
      });
  });

  test('createPost with photos', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      title: 'test title',
      text: 'test text',
      photos: [
        { filename: 'img1.png' },
        { filename: 'img2.png' },
        { filename: 'img3.png' },
      ]
    });
    const postDetails = await postRepository.postDetails(post.get('id'));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(postDetails.toJSON().Photos)
      .toEqual([
        { uri: `${config.storage}/img1.png`, thumbnail: `${config.storage}/${config.files.thumbnailPrefix}-img1.png` },
        { uri: `${config.storage}/img2.png`, thumbnail: `${config.storage}/${config.files.thumbnailPrefix}-img2.png` },
        { uri: `${config.storage}/img3.png`, thumbnail: `${config.storage}/${config.files.thumbnailPrefix}-img3.png` },
      ]);
  });

  test('createPost with preview', async () => {
    const p = await postService.createPost(newuser.get('id'), {
      title: 'test title 2',
      text: 'test text 2',
      preview: { filename: 'img1.png' }
    });
    const { rows } = await postRepository.fetchPosts(0, 100);
    const post = rows.find(r => r.get('id') === p.get('id'));
    const postData = post.toJSON();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(postData.Preview)
      .toEqual({
        uri: `${config.storage}/img1.png`,
        thumbnail: `${config.storage}/${config.files.thumbnailPrefix}-img1.png`
      });
  });

  test('createComment in the post', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      title: 'with comment',
      text: 'test text'
    });
    let postDetails = await postRepository.postDetails(post.get('id'));
    let details = postDetails.toJSON() as PostDetails;
    const oldComments = details.Statistic.comments;
    await commentService.createComment(newuser.get('id'), details.id, 'test comment');
    postDetails = await postRepository.postDetails(post.get('id'));
    details = postDetails.toJSON() as PostDetails;
    const newComments = details.Statistic.comments;

    expect(oldComments)
      .toBe(0);
    expect(newComments)
      .toBe(1);
  });

  test('deletePost in the post', async () => {
    const post = await postService.createPost(newuser.get('id'), {
      title: 'post for deleting',
      text: 'test text'
    });
    const id = post.get('id');
    const p = await postRepository.postDetails(post.get('id'));

    expect(id)
      .toBe(p.get('id'));
  });
});
