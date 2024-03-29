# node-mongo-dump

## Menu
  * [💻 Installation](#installation)
  * [🔨 Usage](#usage)
  * [📖 Options](#options)
  * [📜 License](#license)

Backup your MongoDB database on a specific frequency using mongodump.

[![Version](https://img.shields.io/npm/v/@dotmind/node-mongo-dump?color=brightgreen)](https://www.npmjs.com/package/@dotmind/node-mongo-dump)

## 💻 Installation

`npm i @dotmind/node-mongo-dump --save`

## 🔨 Usage

Declare the function in the js file that start your server

```javascript
const nodeMongoDump = require('@dotmind/node-mongo-dump');

nodeMongoDump({
  dbName: 'YOUR_DB_NAME'
});
```

You can use the dumpDb function to dump the database once

```javascript
const dumpDb = require('@dotmind/node-mongo-dump/lib/dumpDb');

dumpDb({
  dbName: 'dbName',
  host: 'localhost',
  port: '27017',
  nbSaved: 5,
  outPath: './dumps/',
  withStdout: false,
  withStderr: false,
  withClose: false,
});
```

And you can use await for a sync usage. The dumpDb function will return the path where the file is saved.

```javascript
const file = await dumpDb({
  dbName: 'dbName',
  host: 'localhost',
  port: '27017',
  nbSaved: 5,
  outPath: './dumps/',
  withStdout: false,
  withStderr: false,
  withClose: false,
});
```
And then... That's it, you're ready to go 🚀

## 📖 Options


| Arguments  | Required  | type    | Default Value      | Commentary                                                                                                         |
| ---------- | --------- | ------- | ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| dbName*    | true      | string  |                    | Your database name                                                                                                 |
| frequency  | false     | string  | `'0 0 * * *'`      | How often you want to dump your database.                                                                          |
| nbSaved    | false     | number  | `14`               | The number of dumps you want to keep. If you reach the nbSaved, it will delete the oldest before saving a new one. |
| host       | false     | string  | `'localhost'`      | Your mongodb host.                                                                                                 |
| port       | false     | string  | `'27017'`          | Your mongodb port.                                                                                                 |
| outPath    | false     | string  | `'./../../dumps/'` | The directory where you want to save the dumps.                                                                    |
| withStdout | false     | boolean | `false`            | Variable to log the output of mongodump command                                                                    |
| withStderr | false     | boolean | `false`            | Variable to log the errors of mongodump command                                                                    |
| withClose  | false     | boolean | `false`            | Variable to log the ouendtput of mongodump command                                                                 |

### dumpDb

| Arguments  | Required  | type    | Default Value      | Commentary                                                                                                         |
| ---------- | --------- | ------- | ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| dbName*    | true      | string  |                    | Your database name                                                                                                 |
| nbSaved    | false     | number  | `14`               | The number of dumps you want to keep. If you reach the nbSaved, it will delete the oldest before saving a new one. |
| host       | false     | string  | `'localhost'`      | Your mongodb host.                                                                                                 |
| port       | false     | string  | `'27017'`          | Your mongodb port.                                                                                                 |
| outPath    | false     | string  | `'./../../dumps/'` | The directory where you want to save the dumps.                                                                    |
| withStdout | false     | boolean | `false`            | Variable to log the output of mongodump command                                                                    |
| withStderr | false     | boolean | `false`            | Variable to log the errors of mongodump command                                                                    |
| withClose  | false     | boolean | `false`            | Variable to log the ouendtput of mongodump command              

Return the path where the file is saved.

## 📜 License
[ISC](https://choosealicense.com/licenses/isc/)