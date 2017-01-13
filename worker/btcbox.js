const ticker = require('../models/ticker.js');
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

const RecreateData = (exchange_name, term, ask, tickers) => {
  if (tickers.Count > 0) {
    const updateItem = _.sortBy(tickers.Items, 'timestamp').pop()
    updateItem.close = ask
    if (updateItem.high < ask) {
      updateItem.high = ask
    }
    if (updateItem.low > ask) {
      updateItem.low = ask
    }
    console.log("update", updateItem.timestamp);
    return updateItem
  } else {
    const now = moment().unix()
    const _exchange_name = exchange_name + "_" + term + "s"
    const newItem = {
      exchange_name: _exchange_name,
      term: term,
      timestamp: String(now),
      high: String(ask),
      low: String(ask),
      open: String(ask),
      close: String(ask)
    }
    console.log("newcreate", newItem.timestamp);

    return newItem
  }
}

const exchange_worker = (exchange_name, term) => {
  ex[exchange_name].getAsk().then((ask) => {
    ticker.findTicker({
      exchange_name: exchange_name,
      term: term
    }).then((tickers) => {
      const data = RecreateData(exchange_name, term, ask, tickers)
      console.log(data);

      return ticker.updateTicker(data)
    }).then((result) => {
      setTimeout(() => {
        exchange_worker(exchange_name, term)
      }, 500)
    }).catch((err) => {
      console.log(err);
      setTimeout(() => {
        exchange_worker(exchange_name, term)
      }, 500)
    })
  })
}


exchange_worker('btcbox', '60')
