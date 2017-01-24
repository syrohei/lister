'use strict';

const db = require('./db')
const moment = require('moment')
const tickersTable = process.env.TICKER_TABLE

/*
*/
module.exports.findTicker = (table, params) => {
  return new Promise((resolve, reject) => {
    const now = moment().unix()
    const exchange_name = params.exchange_name + "_" + params.currency_pair + "_" + params.term + "s#" + params.increment.partition;
    db('query', {
        TableName: table,
        KeyConditions: {
          'exchange_name': {
            ComparisonOperator: "EQ",
            AttributeValueList: {
              S: exchange_name
            }
          },
          'createdAt': {
            ComparisonOperator: "GE",
            AttributeValueList: {
              S: String(now - Number(params.term))
            }
          }
        },
        ScanIndexForward: true
      })
      .then((response) => {
        if (response.Count < 0) return reject('Ticker is not found');
        resolve(response)
      })
  })
}

module.exports.updateTicker = (table, item) => {
  return new Promise((resolve, reject) => {
    db('put', {
      TableName: table,
      Item: item
    }, (response) => {
      // this should be delayed for 50ms
      // let's do something with the response
      if (response.result === 'success') {
        console.log("save ticker success, response data:", response);
      } else {
        return Promise.reject(new Error("Something went wrong :("));
      }
    }).then(() => resolve(item));
  })
}

module.exports.getAll = (table, query) => {
  return new Promise((resolve, reject) => {
    const now = moment().unix()
    const since = query.since == "default" ? String(now - 3600 * 24) : query.since
    const last = query.last == "default" ? String(now) : query.last
    const exchange_name = query.exchange_name + "_" + query.currency_pair + "_" + query.term + "s#" + query.increment.partition;

    return db('query', {
      TableName: table,
      KeyConditionExpression: "#k = :val and #timestamp between :since and :last",
      ExpressionAttributeValues: {
        ":val": exchange_name,
        ":since": since,
        ":last": last
      },
      ExpressionAttributeNames: {
        "#k": "exchange_name",
        "#timestamp": "createdAt"
      }
    }).then(reply => {
      console.log("GET : all tickers : " + query.exchange_name);

      resolve(reply.Items)

    });
  })
}
