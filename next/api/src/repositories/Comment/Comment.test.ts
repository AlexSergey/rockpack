import { CommentRepositoryInterface } from './interface';
import { CommentRepositoryDIType } from './di.type';
import { container } from '../../container';

let commentRepository;

beforeAll(() => {
  commentRepository = container.get<CommentRepositoryInterface>(CommentRepositoryDIType);
});

describe('CommentRepository tests', () => {
  test('Fetching comments for post 13', async () => {
    const comments = await commentRepository.fetchComments(13);

    expect(comments.length)
      .toBe(2);
  });
});
