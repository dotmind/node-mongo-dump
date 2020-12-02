# node-mongo-dump
[![Version](https://img.shields.io/npm/v/node-mongo-dump?color=brightgreen)](https://www.npmjs.com/package/node-mongo-dump)
> version 1 🚀

**Menu**

* [👷‍♂️ How it's work](#-how-its-work])
* [💻 NPM commands](#-npm-commands)
* [📖 API](#-api])
* [📝 Notes & questions](#-notes--questions)
* [⏰ TODO](#-todo)

 ## 👷‍♂️ How it's work

This library is really simple. It's allows you to backup your Mongodb on a specific frequency using mongodump.

## 💻 NPM commands

Install the library
`npm i node-mongo-dump`

Declare the function in the js file that start your server
```
const nodeMongo = require('node-mongo-dump');

nodeMongo();
```

And then... That's it, you're Ready to go 🚀

## 📖 API

|Arguments|type|Default Value|Commentary|
|----|----|----|-----|
|frequency|string|`'0 0 * * *'`|How often you want to dump your database.|
|nbSaved|number|`14`|The number of dumps you want to keep. If you reach the nbSaved, it will delete the oldest before saving a new one.|
|host|string|`'localhost'`|Your mongodb host.|
|port|string|`'27017'`|Your mongodb port.|
|outPath|string|`'./../../dumps/'`|The directory where you want to save the dumps.|
|dbName|string|`'db'`|Your database name|
|withStdout|boolean|`false`|Variable to log the output of mongodump command|
|withStderr|boolean|`false`|Variable to log the errors of mongodump command|
|withClose|boolean|`false`|Variable to log the ouendtput of mongodump command|

## 📝 Notes & questions



## ⏰ TODO