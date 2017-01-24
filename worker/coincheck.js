const ticker = require('../models/ticker.js');
const increment = require('../models/increment.js');

const btcbox = require('../lib/exchanges/btcbox.js')
const coincheck = require('../lib/exchanges/coincheck.js')
const moment = require('moment')
const _ = require('lodash');

const mail = require('../models/mail.js')

var ask, bid

const ex = {
  'btcbox': btcbox,
  'coincheck': coincheck
}

const RecreateData = (params, ask, tickers, currency_pair) => {
  if (tickers.Count > 0) {
    const updateItem = _.sortBy(tickers.Items, 'timestamp').pop()
    updateItem.close = ask
    if (updateItem.high < ask) {
      updateItem.high = ask
    }
    if (updateItem.low > ask) {
      updateItem.low = ask
    }
    console.log("update", updateItem.createdAt);
    return updateItem
  } else {
    const now = moment().unix()
    const _exchange_name = params.exchange_name + "_" + currency_pair +  "_" + params.term + "s#" + params.increment.partition
    const newItem = {
      exchange_name: _exchange_name,
      term: params.term,
      createdAt: String(now),
      currency_pair: currency_pair,
      high: String(ask),
      low: String(ask),
      open: String(ask),
      close: String(ask)
    }
    console.log("newcreate", newItem.createdAt);

    return newItem
  }
}

const exchange_worker = (exchange_name, term, currency_pair) => {
  const params = {
    exchange_name: exchange_name,
    term: term
  }

  ex[exchange_name].getAsk().then((ask) => {
    increment.findIncrement("increments", params).then((result) => {
      params.increment = result.Items.pop()
      return ticker.findTicker("tickers", params)
    }).then((tickers) => {
      const data = RecreateData(params, String(ask), tickers, currency_pair)
      return ticker.updateTicker("tickers", data)
    }).then((result) => {
      console.log(result);
      if (result.createdAt > 3600 + Number(params.increment.createdAt))
        return increment.updateIncrement("increments", params)


    }).then((result) => {
      setTimeout(() => {
        exchange_worker(exchange_name, term)
      }, 1500)
    }).catch((err) => {
      console.log(err);
      setTimeout(() => {
        exchange_worker(exchange_name, term)
      }, 1500)
    })
  }).catch((err) => console.log)
}


exchange_worker('coincheck', '60', "BTCJPY")
