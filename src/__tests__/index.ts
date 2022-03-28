import * as dumpDb from '../dumpDb';
import * as fs from 'fs';

const dbName = 'node-mongo-dump-test';

test('Dump test', async () => {
  const args = {
    host: 'localhost',
    port: '27017',
    dbName,
    frequency: '* * * * *',
    nbSaved: 5,
    outPath: './dumps/',
    withStdout: false,
    withStderr: false,
    withClose: false,
  };

  const filePath = await dumpDb(args);
  const isSaved = fs.existsSync(`${filePath}.tar.gzip`);

  expect(isSaved).toBeTruthy();
});

test('Dump withStdout', async () => {
  const args = {
    host: 'localhost',
    port: '27017',
    dbName,
    frequency: '* * * * *',
    nbSaved: 5,
    outPath: './dumps/',
    withStdout: true,
    withStderr: false,
    withClose: false,
  };

  const filePath = await dumpDb(args);
  const isSaved = fs.existsSync(`${filePath}.tar.gzip`);

  expect(isSaved).toBeTruthy();
});

test('Dump withStderr', async () => {
  const args = {
    host: 'localhost',
    port: '27017',
    dbName,
    frequency: '* * * * *',
    nbSaved: 5,
    outPath: './dumps/',
    withStdout: false,
    withStderr: true,
    withClose: false,
  };

  const filePath = await dumpDb(args);
  const isSaved = fs.existsSync(`${filePath}.tar.gzip`);

  expect(isSaved).toBeTruthy();
});

test('Dump withClose', async () => {
  const args = {
    host: 'localhost',
    port: '27017',
    dbName,
    frequency: '* * * * *',
    nbSaved: 5,
    outPath: './dumps/',
    withStdout: false,
    withStderr: false,
    withClose: true,
  };

  const filePath = await dumpDb(args);
  const isSaved = fs.existsSync(`${filePath}.tar.gzip`);

  expect(isSaved).toBeTruthy();
});