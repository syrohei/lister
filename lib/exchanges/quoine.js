'use strict';

const api_key = process.env.BTCBOX_API_KEY
const secret_key = process.env.BTCBOX_SECRET
const btcbox = require('btcbox')
const request = require('request');

// @@ to check all apis format

//const api = btcbox.createPrivateApi(api_key, secret_key, 'user agent is node-btcbox');
const api_pub = btcbox.PublicApi;
const api_util = btcbox.util
const api_url = "https://api.quoine.com"

function getBalance() {
  return new Promise((resolve, reject) => {
    const api = btcbox.createPrivateApi(api_key, secret_key, 'user agent is node-btcbox');

    api.balance().delay(100).then(function(data) {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}

function getActiveOrders() {
  return new Promise((resolve, reject) => {
    const api = btcbox.createPrivateApi(api_key, secret_key, 'user agent is node-btcbox');

    api.tradeList('btc').delay(100).then(function(trades) {
      const stacks = []
      trades.forEach((trade) => {

        const result = {
          id: Number(trade.id),
          rate: Number(trade.price),
          pending: Number(trade.amount_outstanding)
        }
        stacks.push(result)
      })
      resolve(stacks)

    }).catch((err) => {
      reject(err)
    })
  })
}

function getOrderDetail(_id) {
  return new Promise((resolve, reject) => {
    const api = btcbox.createPrivateApi(api_key, secret_key, 'user agent is node-btcbox');
    api.tradeList('btc').delay(100).then(function(data) {
      var _order
      data.forEach((order) => {

        if (order.id == _id) {
          _order = {
            id: Number(order.id),
            rate: Number(order.price),
            pending: Number(order.amount_outstanding)
          }
          return resolve(_order)

        }
      })

    }).catch((err) => {
      reject(err)
    })
  })
}


function cancelOrder(_order_num) {
  return new Promise((resolve, reject) => {
    const btcbox = require('btcbox')

    const api = btcbox.createPrivateApi(api_key, secret_key, 'user agent is node-btcbox');

    api.tradeCancel('btc', String(_order_num)).then(function(data) {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}

function getTicker() {
  return new Promise((resolve, reject) => {
    request.get({
      url: api_url + '/products/5'
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body))
      } else {
        reject('error: ');
      }
    })
  })
}

function getAsk() {
  return new Promise((resolve, reject) => {
    getTicker().then((result) => {
      resolve(result.market_ask)
    }).catch((err) => reject(err))
  })
}

function getBid() {
  return new Promise((resolve, reject) => {
    api_pub.depth('btc')
      .then((result) => {
        resolve(result.bids[0][0])
      })
      .catch((err) => reject(err))
  })
}

function pushOrder(_pair, _method, _price, _quantitity) {
  return new Promise((resolve, reject) => {
    if (Number(_price) < 0 || Number(_quantitity) < 0)
      reject(new Error("order has't been pushed"))

    const btcbox = require('btcbox')

    const api = btcbox.createPrivateApi(api_key, secret_key, 'user agent is node-btcbox');

    api.tradeAdd(_pair, _quantitity, _price, _method)
      .then((result) => {
        console.log('btcbox order submitted');
        resolve(result)
      })
      .catch((err) => reject(err))
  })
}

function cancelAll() {
  return new Promise(function(resolve, reject) {
    getActiveOrders().then((results) => {
      resolve(results)
    }).catch((err) => {
      reject(err)
    })
  });
}


module.exports = {
  getBalance,
  getActiveOrders,
  cancelOrder,
  getTicker,
  getAsk,
  getBid,
  pushOrder,
  cancelAll,
  getOrderDetail
}
