'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');


module.exports = (event, callback) => {
  const params = {
    TableName: 'tickers',
  };

  return dynamoDb.scan(params, (error, data) => {
    if (error) {
      callback(error);
    }
    const sortedItems = _.sortBy(data.Items, (item) => -Number(item.timestamp))

    callback(error, sortedItems);
  });
};
