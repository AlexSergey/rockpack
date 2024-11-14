import { container } from '../../container';
import { CommentModel } from '../../models/comment';

let commentRepository;

beforeAll(() => {
  commentRepository = container.getCommentRepository();
});

afterAll(() => CommentModel.sequelize.close());

describe('CommentRepository tests', () => {
  test('Fetching comments for post 13', async () => {
    const comments = await commentRepository.fetchComments(13);

    expect(comments.length).toBe(2);
  });
});
