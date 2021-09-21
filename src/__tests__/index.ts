const nodeMongoDump = require('../index');

test('adds 1 + 2 to equal 3', () => {
  const result = nodeMongoDump({
    dbName: 'node-mongo-dump-test',
    frequency: '* * * * *',
    nbSaved: 5,
    outPath: './dumps/',
  });
  expect(result).toBeUndefined();
});
