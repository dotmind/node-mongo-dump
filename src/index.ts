import { spawn } from 'child_process';
import cron from 'node-cron';
import fs from 'fs';

const dumpDb = (
  host: string,
  port: string,
  outPath: string,
  dbName: string,
  nbSaved: number
) => () => {
  try {
    const now = new Date();
    const files = fs.readdirSync(outPath);
    if (files.length > nbSaved) {
      fs.rmSync(files[0]);
    }
    spawn(`mongodump --host="${host}" --port=${port} --out=${outPath}/${dbName}-${now} --db=${dbName}`);
  } catch (error) {
    console.log(error);
  }
}

export default (
  frequency: string = '0 0 * * *',
  host: string = 'localhost',
  port: string = '27017',
  outPath: string = './../../dumps/',
  dbName: string = '',
  nbSaved: number = 14
) => {
  cron.schedule(frequency, dumpDb(host, port, outPath, dbName, nbSaved));
};