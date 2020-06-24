import { PostRepositoryInterface } from './interface';
import { PostRepositoryDIType } from './di.type';
import { container } from '../../container';

let postRepository;

beforeAll(() => {
  postRepository = container.get<PostRepositoryInterface>(PostRepositoryDIType);
});

describe('PostRepository tests', () => {
  test('Fetching posts with offset 0 and limit 10', async () => {
    const { count, rows } = await postRepository.fetchPosts(0, 10);

    expect(rows.length)
      .toBe(10);
    expect(count)
      .toBe(13);
  });

  test('Fetching posts with offset 1 and limit 10', async () => {
    const { count, rows } = await postRepository.fetchPosts(1, 10);

    expect(rows.length)
      .toBe(3);
    expect(count)
      .toBe(13);
  });

  test('Fetching posts with offset 1 and limit 5', async () => {
    const { count, rows } = await postRepository.fetchPosts(1, 5);

    expect(rows.length)
      .toBe(5);
    expect(count)
      .toBe(13);
  });

  test('Fetching posts with offset 1 and limit 8', async () => {
    const { count, rows } = await postRepository.fetchPosts(1, 8);

    expect(rows.length)
      .toBe(5);
    expect(count)
      .toBe(13);
  });

  test('Check the last post', async () => {
    const { rows } = await postRepository.fetchPosts(1, 8);
    const last = rows[rows.length - 1];

    expect(last.get('id'))
      .toBe(1);
    expect(last.get('title'))
      .toBe('12 Angry Men');
  });
});
