import dumpDb from '../dumpDb';
import * as fs from 'fs';

test('Dump test', async () => {
  const args = {
    host: 'localhost',
    port: '27017',
    dbName: 'node-mongo-dump-test',
    frequency: '* * * * *',
    nbSaved: 5,
    outPath: './dumps/',
    withStdout: false,
    withStderr: false,
    withClose: false,
  };

  const filePath = await dumpDb(args)();
  const isSaved = fs.existsSync(`${filePath}.tar.gzip`);

  expect(isSaved).toBeTruthy();
});
