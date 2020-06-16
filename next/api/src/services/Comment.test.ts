import { UserRepository } from '../repositories/User';
import { CommentRepository } from '../repositories/Comment';
import { PostRepository } from '../repositories/Post';
import { CommentService } from './Comment';
import { UserService } from './User';
import { PostService } from './Post';

let newuser;
let post;

beforeAll(async () => {
  const data = await UserService.signup('test_user_for_comments@text.mail', '123456');
  if (data && data.user) {
    newuser = data.user;
  }
  post = await PostService.createPost(newuser.get('id'), {
    title: 'test title',
    text: 'test text'
  });
});

afterAll(async () => {
  await newuser.destroy({
    individualHooks: true
  });
});

describe('CommentService tests', () => {
  test('createComment to one of the post', async () => {
    let user = await UserRepository.getUserById(newuser.get('id'));
    let { comments } = (user.toJSON() as { Statistic: { comments: number }}).Statistic;
    const oldComments = comments;
    await CommentService.createComment(newuser.get('id'), post.get('id'), 'test comment');
    user = await UserRepository.getUserById(newuser.get('id'));
    comments = (user.toJSON() as { Statistic: { comments: number } }).Statistic.comments;
    const newComments = comments;

    expect(oldComments)
      .toBe(0);
    expect(newComments)
      .toBe(1);
  });

  test('Create incorrect comment', async () => {
    try {
      await CommentService.createComment(newuser.get('id'), post.get('id'), '');
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
    const comments = await CommentRepository.fetchComments(postId);
    const comment = comments[0].toJSON() as { text: string; User: { id: number } };

    expect(comment.User.id)
      .toBe(newuser.get('id'));
    expect(comment.text)
      .toBe('test comment');
  });

  test('Update first comment for the new user', async () => {
    const postId = post.get('id');
    let comments = await CommentRepository.fetchComments(postId);
    const comment = comments[0];
    const commentId = comment.get('id') as number;
    await CommentService.updateComment(commentId, 'this is new text');
    comments = await CommentRepository.fetchComments(postId);
    const text = comments[0].get('text');

    expect(text)
      .toBe('this is new text');
  });

  test('Delete created comment', async () => {
    const postId = post.get('id');
    let comments = await CommentRepository.fetchComments(postId);
    const comment = comments[0];
    const commentId = comment.get('id') as number;
    await CommentService.deleteComment(commentId);
    comments = await CommentRepository.fetchComments(postId);
    const commentsCount = comments.length;

    expect(commentsCount)
      .toBe(0);
  });

  test('Check post statistic after comment was deleted', async () => {
    const details = await PostRepository.postDetails(post.get('id'));
    const { comments } = (details.toJSON() as { Statistic: { comments: number } }).Statistic;

    expect(comments)
      .toBe(0);
  });

  test('Check user statistic after comment was deleted', async () => {
    const user = await UserRepository.getUserById(newuser.get('id'));
    const { comments } = (user.toJSON() as { Statistic: { comments: number } }).Statistic;

    expect(comments)
      .toBe(0);
  });
});
