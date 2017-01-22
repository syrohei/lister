'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const ticker = require('../../models/ticker.js');

module.exports = (table, event, callback) => {
  const params = {
    TableName: table,
  };
  return dynamoDb.scan(params, (error, data) => {
    if (error) {
      callback(error);
    }
    const sortedItems = _.sortBy(data.Items, (item) => -Number(item.timestamp))

    callback(error, sortedItems);
  });
};
