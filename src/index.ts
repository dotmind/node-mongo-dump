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
    const fileDbName = getFileName(dbName)
    const fileDbPath = `${outPath}${fileDbName}`

    const mongodump = spawn('mongodump', [
      `--host="${host}"`,
      `--port=${port}`,
      `--out=${fileDbPath}`,
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
      if (withClose) console.log(`child process exited with code ${code}`);
      compressing.tar.compressDir(fileDbPath, `${fileDbPath}.tar`)
        .then(() => {
          compressing.gzip.compressFile(`${fileDbPath}.tar`, `${fileDbPath}.tar.gzip`)
          .then(() => {
            fs.rmSync(`${fileDbPath}.tar`);
            fs.rmdir(fileDbPath, { recursive: true }, () => { });
          })
          .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    });
  } catch (error) {
    console.log(error);
  }
}

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
}

module.exports = ({
  dbName,
  frequency = '0 0 * * *',
  nbSaved = 14,
  host = 'localhost',
  port = '27017',
  outPath = './../../dumps/',
  withStdout = false,
  withStderr = false,
  withClose = false
}: Arguments) => {
  cron.schedule(frequency, dumpDb(host, port, outPath, dbName, nbSaved, withStdout, withStderr, withClose));
}
