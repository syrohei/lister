'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const moment = require('moment')

module.exports = (table, event, callback) => {
  console.log(event.body);
  const data = event.body;

  data.updatedAt = new Date().getTime();
  const now = moment().unix()
  const exchange_name = data.exchange_name + "_" + data.term + "s"
  const newItem = {
    pkey: exchange_name,
    partition: String(data.partition),
    createdAt: String(now)
  }

  const params = {
    TableName: table,
    Item: newItem
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Item);
  });
};
