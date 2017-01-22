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
    exchange_name: exchange_name,
    term: data.term,
    timestamp: String(now),
    high: String(data.price),
    low: String(data.price),
    open: String(data.price),
    close: String(data.price)
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
