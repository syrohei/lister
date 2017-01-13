'use strict';

const db = require('./db')
const moment = require('moment')
const tickersTable = process.env.TICKER_TABLE

module.exports.findTicker = (params) => {
  return new Promise((resolve, reject) => {
    const now = moment().unix()
    const exchange_name = params.exchange_name + "_" + params.term + "s";
    db('query', {
        TableName: tickersTable,
        KeyConditions: {
          'exchange_name': {
            ComparisonOperator: "EQ",
            AttributeValueList: {
              S: exchange_name
            }
          },
          'timestamp': {
            ComparisonOperator: "GE",
            AttributeValueList: {
              S: String(now - Number(params.term))
            }
          }
        },
        ScanIndexForward: true
      })
      .then((response) => {
        if (!response.Items) return Promise.reject('Ticker is not found');
        resolve(response)
      })
  })
}

module.exports.updateTicker = (item) => {
  return new Promise((resolve, reject) => {
    db('put', {
      TableName: tickersTable,
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
