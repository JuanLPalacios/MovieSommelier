import { commentsCount } from './details';

const getComents = jest.fn(async (id) => ({
  1: [
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
  ],
  2: [
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
  ],
  3: [
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
    { comment: 'test', creation_date: '2022-03-12', username: 'test' },
  ],
}[id]));

describe('', () => {
  it('should add a count to the list', async () => {
    const count1 = await commentsCount(getComents(1));
    const count2 = await commentsCount(getComents(2));
    const count3 = await commentsCount(getComents(3));
    expect(count1).toBe(3);
    expect(count2).toBe(2);
    expect(count3).toBe(5);
  });
});