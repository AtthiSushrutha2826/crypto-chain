/*const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('foo'))
      .toEqual('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'); // Verify this hash with actual output
  });

  it('produces the same hash with the same input arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three'))
      .toEqual(cryptoHash('three', 'one', 'two'));
  });
});
*/
const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('foo'))
      .toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b'); // updated expected value based on how inputs are handled.
  });

  it('produces the same hash with the same input arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three'))
      .toEqual(cryptoHash('three', 'one', 'two'));
  });

  it('produces a unique hash when properties of the input object have changed', () => {
    const obj = { a: 1 };
    const originalHash = cryptoHash(obj);
    obj.a = 2;
    expect(cryptoHash(obj)).not.toEqual(originalHash);
  });
});

