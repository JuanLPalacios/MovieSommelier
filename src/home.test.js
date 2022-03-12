import { seriesCount } from './home';

const getList = jest.fn(async () => [
  { id: 1, name: 'a', image: { medium: '' } },
  { id: 2, name: 'a', image: { medium: '' } },
  { id: 3, name: 'a', image: { medium: '' } },
]);
// eslint-disable-next-line no-unused-vars
const getDetails = jest.fn((id) => getList()
  .then((list) => list.filter((item) => item.id === id)[0]));

describe('', () => {
  it('should add a count to the list', async () => {
    const list = await seriesCount(getList());
    expect(list.count).toBe(3);
  });
});