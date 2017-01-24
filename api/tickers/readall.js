'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const ticker = require('../../models/ticker.js');
const increment = require('../../models/increment.js');

const sanitizer = (query) => {
  if (!query.exchange_name || !query.term)
    return null

  if (!query.since)
    query.since = "default"

  if (!query.last)
    query.last = "default"

  if (!query.pair)
    query.pair = "BTCJPY"
  return query
}

module.exports = (table, event, callback) => {
  const params = sanitizer(event.queryStringParameters)
  if (!params) return callback("Invalid params");
  console.log(params);

  increment.findIncrement("increments", params).then((result) => {
    params.increment = result.Items.pop()
    return ticker.getAll(table, params)
  }).then((Items) => {
    const sortedItems = _.sortBy(Items, (item) => -Number(item.createdAt))

    callback(null, sortedItems);
  }).catch((err) => {
    callback(err);

  })

};
