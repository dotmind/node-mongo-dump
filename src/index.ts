import { spawn } from 'child_process';
import cron from 'node-cron';
import fs from 'fs';
import compressing from 'compressing';

const getDateWithTwoDigit = (date: number) => (`0${date}`).slice(-2);

const getFileName = (dbName?: string) => {
  const now = new Date();
  const prefix = dbName ? `${dbName}-` : '';
  return `${prefix}${now.getFullYear()}-${getDateWithTwoDigit(now.getMonth() + 1)}-${getDateWithTwoDigit(now.getDate() + 1)}-${getDateWithTwoDigit(now.getHours())}-${getDateWithTwoDigit(now.getMinutes())}-${getDateWithTwoDigit(now.getSeconds())}`
}

const dumpDb = (
  host: string,
  port: string,
  outPath: string,
  dbName: string,
  nbSaved: number,
  withStdout: boolean,
  withStderr: boolean,
  withClose: boolean
) => () => {
  try {
    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(outPath);
    }
    const filter = new RegExp(`^${dbName}`);
    const files = fs.readdirSync(outPath).filter((path: string) => filter.test(path));
    if (files.length >= nbSaved) {
      fs.rmSync(`${outPath}${files[0]}`);
    }
    const mongodump = spawn('mongodump', [
      `--host="${host}"`,
      `--port=${port}`,
      `--out=${outPath}${getFileName(dbName)}`,
      `--db=${dbName}`
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
      if (withClose) {
        console.log(`child process exited with code ${code}`);
      }
      compressing.tar.compressDir(`${outPath}${getFileName(dbName)}`, `${outPath}${getFileName(dbName)}.tar`)
        .then(() => {
          compressing.gzip.compressFile(`${outPath}${getFileName(dbName)}.tar`, `${outPath}${getFileName(dbName)}.tar.gzip`)
          .then(() => {
            fs.rmSync(`${outPath}${getFileName(dbName)}.tar`);
            fs.rmdir(`${outPath}${getFileName(dbName)}`, { recursive: true }, () => { });
          })
          .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = (
  frequency: string = '0 0 * * *',
  nbSaved: number = 14,
  host: string = 'localhost',
  port: string = '27017',
  outPath: string = './../../dumps/',
  dbName: string = '',
  withStdout: boolean = false,
  withStderr: boolean = false,
  withClose: boolean = false
) => {
  cron.schedule(frequency, dumpDb(host, port, outPath, dbName, nbSaved, withStdout, withStderr, withClose));
}
