import { container } from '../../container';
import { CommentModel } from '../../models/comment';

import { CommentRepositoryDIType } from './di.type';
import type { ICommentRepository } from './interface';

let commentRepository;

beforeAll(() => {
  commentRepository = container.get<ICommentRepository>(CommentRepositoryDIType);
});

afterAll(() => CommentModel.sequelize.close());

describe('CommentRepository tests', () => {
  test('Fetching comments for post 13', async () => {
    const comments = await commentRepository.fetchComments(13);

    expect(comments.length).toBe(2);
  });
});
