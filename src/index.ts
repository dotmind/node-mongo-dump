import { spawn } from 'child_process';
import * as cron from 'node-cron';
import * as fs from 'fs';
import * as compressing from 'compressing';
import * as path from 'path';

const getDateWithTwoDigit = (date: number) => `0${date}`.slice(-2);

const getFileName = (dbName?: string) => {
  const now = new Date();
  const prefix = dbName ? `${dbName}-` : '';
  return `${prefix}${now.getFullYear()}-${getDateWithTwoDigit(now.getMonth() + 1)}-${getDateWithTwoDigit(
    now.getDate() + 1,
  )}-${getDateWithTwoDigit(now.getHours())}-${getDateWithTwoDigit(now.getMinutes())}-${getDateWithTwoDigit(
    now.getSeconds(),
  )}`;
};

type Arguments = {
  dbName: string;
  frequency?: string;
  nbSaved?: number;
  host?: string;
  port?: string;
  outPath?: string;
  withStdout?: boolean;
  withStderr?: boolean;
  withClose?: boolean;
};

const dumpDb = ({
  dbName,
  nbSaved = 14,
  host = 'localhost',
  port = '27017',
  outPath = './../../dumps/',
  withStdout = false,
  withStderr = false,
  withClose = false,
}: Arguments) => () => {
  try {
    const fullPath = path.resolve(outPath)
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
    }
    const filter = new RegExp(`^${dbName}`);
    const files = fs.readdirSync(fullPath).filter((path: string) => filter.test(path));
    if (files.length >= nbSaved) {
      fs.unlinkSync(path.join(fullPath, files[0]));
    }
    const fileDbName = getFileName(dbName);
    const fileDbPath = path.join(fullPath, fileDbName);

    const mongodump = spawn('mongodump', [
      `--host="${host}"`,
      `--port=${port}`,
      `--out=${fileDbPath}`,
      `--db=${dbName}`,
    ]);

    if (withStdout) {
      mongodump.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
    }

    if (withStderr) {
      mongodump.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
    }

    mongodump.on('close', (code) => {
      if (withClose) console.log(`child process exited with code ${code}`);
      compressing.tar
        .compressDir(fileDbPath, `${fileDbPath}.tar`)
        .then(() => {
          compressing.gzip
            .compressFile(`${fileDbPath}.tar`, `${fileDbPath}.tar.gzip`)
            .then(() => {
              console.log('💾  Successfully saved')
              console.table([
                {
                  file: fileDbName,
                }
              ])
              fs.unlinkSync(`${fileDbPath}.tar`);
              fs.rmdir(fileDbPath, { recursive: true }, () => {
                console.log(`🧹 ${fileDbPath}.tar successfully cleaned`);
              });
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    });
  } catch (error) {
    console.log(error);
  }
};

export = function nodeMongoDump({
  dbName,
  frequency = '0 0 * * *',
  nbSaved = 14,
  host = 'localhost',
  port = '27017',
  outPath = './../../dumps/',
  withStdout = false,
  withStderr = false,
  withClose = false,
}: Arguments) {
  console.table([
    {
      dbName,
      frequency,
      nbSaved,
      host,
      port,
      outPath
    }
  ])
  cron.schedule(frequency, dumpDb({ host, port, outPath, dbName, nbSaved, withStdout, withStderr, withClose }));
};
