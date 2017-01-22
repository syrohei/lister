'use strict';

const Create = require('./create.js');
const ReadAll = require('./readall.js');
const ReadOne = require('./readone.js');
const Update = require('./update.js');
const Delete = require('./delete.js');

module.exports = {
  Create: Create,
  ReadAll: ReadAll,
  ReadOne: ReadOne,
  Update: Update,
  Delete: Delete
}
