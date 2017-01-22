'use strict';

const db = require('./db')
const moment = require('moment')

/*
*/
module.exports.findIncrement = (table, params) => {
  return new Promise((resolve, reject) => {
    const now = moment().unix()
    const exchange_name = params.exchange_name + "_" + params.term + "s";
    db('query', {
        TableName: table,
        KeyConditions: {
          'pkey': {
            ComparisonOperator: "EQ",
            AttributeValueList: {
              S: exchange_name
            }
          }
        },
        ScanIndexForward: true
      })
      .then((response) => {
        if (response.Count < 1) return reject('increment is not found');
        resolve(response)
      })
  })
}

module.exports.updateIncrement = (table, params) => {
  return new Promise((resolve, reject) => {
    const now = moment().unix()
    const exchange_name = params.exchange_name + "_" + params.term + "s"
    const newItem = {
      pkey: exchange_name,
      partition: String(Number(params.increment.partition )+1),
      createdAt: String(now)
    }
    db('put', {
      TableName: table,
      Item: newItem
    }, (response) => {
      // this should be delayed for 50ms
      // let's do something with the response
      if (response.result === 'success') {
        console.log("save increment success, response data:", response);
      } else {
        return Promise.reject(new Error("Something went wrong :("));
      }
    }).then(() => resolve(newItem));
  })
}

module.exports.getAll = (table, query) => {
  return new Promise((resolve, reject) => {
    const KeyCondition = (query.exchange_name ) ? "#k = :val and " : ""
    const now = moment().unix()
    const since = args.since == "default" ? String(now - 3600 * 24) : args.since
    const last = args.last == "default" ? String(now) : args.last
    return db('query', {
      TableName: table,
      KeyConditionExpression: keyCondition + "#timestamp between :since and :last",
      ExpressionAttributeValues: {
        ":val": exchange_name,
        ":since": since,
        ":last": last
      },
      ExpressionAttributeNames: {
        "#k": "exchange_name",
        "#timestamp": "timestamp"
      }
    }).then(reply => {
      console.log("GET : all tickers : " + args.term);

      resolve(reply.Items)

    });
  })
}

module.exports.scan = (table) => {
  return new Promise((resolve, reject) => {

    return db('scan', {
      TableName: table
    }).then(reply => {
      console.log("GET : all increments : ");

      resolve(reply.Items)

    });
  })
}
