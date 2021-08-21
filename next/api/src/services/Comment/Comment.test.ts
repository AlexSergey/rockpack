import { UserRepositoryDIType } from '../../repositories/User';
import type { UserRepositoryInterface } from '../../repositories/User';
import { CommentRepositoryDIType } from '../../repositories/Comment';
import type { CommentRepositoryInterface } from '../../repositories/Comment';
import { PostRepositoryDIType } from '../../repositories/Post';
import type { PostRepositoryInterface } from '../../repositories/Post';
import { CommentServiceDIType } from './di.type';
import type { CommentServiceInterface } from './interface';
import { UserServiceDIType } from '../User';
import type { UserServiceInterface } from '../User';
import { PostServiceDIType } from '../Post';
import type { PostServiceInterface } from '../Post';
import { PostModel } from '../../models/Post';
import { UserModel } from '../../models/User';
import { CommentModel } from '../../models/Comment';
import { container } from '../../container';

let newuser;
let post;
let userRepository;
let postRepository;
let commentRepository;
let userService;
let postService;
let commentService;

beforeAll(async () => {
  userRepository = container.get<UserRepositoryInterface>(UserRepositoryDIType);
  postRepository = container.get<PostRepositoryInterface>(PostRepositoryDIType);
  commentRepository = container.get<CommentRepositoryInterface>(CommentRepositoryDIType);
  userService = container.get<UserServiceInterface>(UserServiceDIType);
  postService = container.get<PostServiceInterface>(PostServiceDIType);
  commentService = container.get<CommentServiceInterface>(CommentServiceDIType);

  const data = await userService.signup('test_user_for_comments@text.mail', '123456');
  if (data && data.user) {
    newuser = data.user;
  }
  post = await postService.createPost(newuser.get('id'), {
    title: 'test title',
    text: 'test text'
  });
});

afterAll(async () => {
  await newuser.destroy({
    individualHooks: true
  });
  PostModel.sequelize.close();
  UserModel.sequelize.close();
  CommentModel.sequelize.close();
});

describe('CommentService tests', () => {
  test('createComment to one of the post', async () => {
    let user = await userRepository.getUserById(newuser.get('id'));
    let { comments } = (user.toJSON() as { Statistic: { comments: number } }).Statistic;
    const oldComments = comments;
    await commentService.createComment(newuser.get('id'), post.get('id'), 'test comment');
    user = await userRepository.getUserById(newuser.get('id'));
    comments = (user.toJSON() as { Statistic: { comments: number } }).Statistic.comments;
    const newComments = comments;

    expect(oldComments)
      .toBe(0);
    expect(newComments)
      .toBe(1);
  });

  test('Create incorrect comment', async () => {
    try {
      await commentService.createComment(newuser.get('id'), post.get('id'), '');
    } catch (e) {
      expect(e.message)
        .toBe('Bad Request. Your browser sent a request that this server could not understand.');
      expect(e.statusCode)
        .toBe(400);
      expect(e.code)
        .toBe('BAD_REQUEST');
    }
  });

  test('Check first comment for the new user', async () => {
    const postId = post.get('id');
    const comments = await commentRepository.fetchComments(postId);
    const comment = comments[0].toJSON() as { text: string; User: { id: number } };

    expect(comment.User.id)
      .toBe(newuser.get('id'));
    expect(comment.text)
      .toBe('test comment');
  });

  test('Update first comment for the new user', async () => {
    const postId = post.get('id');
    let comments = await commentRepository.fetchComments(postId);
    const comment = comments[0];
    const commentId = comment.get('id') as number;
    await commentService.updateComment(commentId, 'this is new text');
    comments = await commentRepository.fetchComments(postId);
    const text = comments[0].get('text');

    expect(text)
      .toBe('this is new text');
  });

  test('Delete created comment', async () => {
    const postId = post.get('id');
    let comments = await commentRepository.fetchComments(postId);
    const comment = comments[0];
    const commentId = comment.get('id') as number;
    await commentService.deleteComment(commentId);
    comments = await commentRepository.fetchComments(postId);
    const commentsCount = comments.length;

    expect(commentsCount)
      .toBe(0);
  });

  test('Check post statistic after comment was deleted', async () => {
    const details = await postRepository.postDetails(post.get('id'));
    const { comments } = (details.toJSON() as { Statistic: { comments: number } }).Statistic;

    expect(comments)
      .toBe(0);
  });

  test('Check user statistic after comment was deleted', async () => {
    const user = await userRepository.getUserById(newuser.get('id'));
    const { comments } = (user.toJSON() as { Statistic: { comments: number } }).Statistic;

    expect(comments)
      .toBe(0);
  });
});
