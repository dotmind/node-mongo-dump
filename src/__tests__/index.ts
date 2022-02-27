import dumpDb from '../dumpDb';

test('Dump test', async () => {
  const args = {
    host: 'localhost',
    port: '27017',
    dbName: 'node-mongo-dump-test',
    frequency: '* * * * *',
    nbSaved: 5,
    outPath: './dumps/',
    withStdout: true,
    withStderr: true,
    withClose: true,
  };

  const filePath = await dumpDb(args)();
  console.log(filePath)
  expect(filePath).toBeUndefined();
});
