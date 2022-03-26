import * as cron from 'node-cron';
import dumpDb from './dumpDb';
import { Arguments } from './types';

const nodeMongoDump = ({
  dbName,
  frequency = '0 0 * * *',
  nbSaved = 14,
  host = 'localhost',
  port = '27017',
  outPath = './../../dumps/',
  withStdout = false,
  withStderr = false,
  withClose = false,
}: Arguments) => {
  console.table([
    {
      dbName,
      frequency,
      nbSaved,
      host,
      port,
      outPath,
    },
  ]);
  cron.schedule(frequency, dumpDb({ host, port, outPath, dbName, nbSaved, withStdout, withStderr, withClose }));
};

export default nodeMongoDump;