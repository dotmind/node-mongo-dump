const nodeMongoDump = require('@dotmind/node-mongo-dump')

nodeMongoDump({
  dbName: 'node-mongo-dump-test',
  frequency: '* * * * *',
  nbSaved: 5,
  outPath: './dumps/'
})