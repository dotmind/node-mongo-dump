# node-mongo-dump

[![Version](https://img.shields.io/npm/v/@dotmind/node-mongo-dump?color=brightgreen)](https://www.npmjs.com/package/@dotmind/node-mongo-dump)
> version 1 🚀

## Menu

* [👷‍♂️  How it's work](#️-how-its-work)
* [💻  NPM commands](#-npm-commands)
* [📖  API](#-api)
* [📝  Notes & questions](#-notes--questions)
* [⏰  TODO](#-todo)

## 👷‍♂️ How it's work

This library is really simple. It's allows you to backup your Mongodb on a specific frequency using mongodump.

## 💻 NPM commands

Install the library
`npm i @dotmind/node-mongo-dump --save`

Declare the function in the js file that start your server

```javascript
const nodeMongoDump = require('@dotmind/node-mongo-dump');

nodeMongoDump({
  dbName: 'YOUR_DB_NAME'
});
```

And then... That's it, you're Ready to go 🚀

## 📖 API

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

## 📝 Notes & questions

## ⏰ TODO
