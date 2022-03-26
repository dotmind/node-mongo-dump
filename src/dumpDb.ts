import { spawn } from 'child_process';
import * as fs from 'fs';
import * as compressing from 'compressing';
import * as path from 'path';
import * as semver from 'semver';

import { Arguments } from './types';

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

const dumpDb = ({
  dbName,
  nbSaved = 14,
  host = 'localhost',
  port = '27017',
  outPath = './../../dumps/',
  withStdout = false,
  withStderr = false,
  withClose = false,
}: Arguments) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const fullPath = path.resolve(outPath);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
      }
      const filter = new RegExp(`^${dbName}`);
      const files = fs.readdirSync(fullPath).filter((pathFile: string) => filter.test(pathFile));
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
                console.log('💾  Successfully saved');
                console.table([
                  {
                    file: fileDbName,
                  },
                ]);
                fs.unlinkSync(`${fileDbPath}.tar`);
                if (semver.gt(process.version, 'v12.10.0')) {
                  fs.rmdir(fileDbPath, { recursive: true }, () => {
                    console.log(`🧹 ${fileDbPath}.tar successfully cleaned`);
                    resolve(fileDbPath);
                  });
                } else {
                  const deleteFolderRecursive = (folderPath: string) => {
                    if (fs.existsSync(folderPath)) {
                      fs.readdirSync(folderPath).forEach((file, index) => {
                        const curPath = folderPath + '/' + file;
                        if (fs.lstatSync(curPath).isDirectory()) {
                          // recurse
                          deleteFolderRecursive(curPath);
                        } else {
                          // delete file
                          fs.unlinkSync(curPath);
                        }
                      });
                      fs.rmdirSync(folderPath);
                    }
                  };
                  deleteFolderRecursive(fileDbPath);
                  console.log(`🧹 ${fileDbPath} successfully cleaned`);
                  resolve(fileDbPath);
                }
              })
              .catch((e) => {
                console.log(e);
                reject(e);
              });
          })
          .catch((e) => {
            fs.unlinkSync(`${fileDbPath}.tar`);

            console.log(e);
            reject(e);
          });
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

export = dumpDb;