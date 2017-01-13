'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {
  const params = {
    TableName: 'tickers',
    Key: {
      exchange_name: event.pathParameters.exchange
    }
  };

  return dynamoDb.get(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data.Item);
  });
};
