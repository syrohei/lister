'use strict';

const api_key = process.env.COINCHECK_API_KEY
const secret_key = process.env.COINCHECK_SECRET
const api_url = "https://coincheck.jp/api"
const crypto = require('crypto');
const querystring = require('querystring');
const request = require('request');


const createSign = function(argo, key, qstring) {
  return crypto.createHmac(argo, key).
  update(new Buffer(qstring)).
  digest('hex').toString();
};
const createHeader = function(url, api_key, secret_key, nonce, postdata) {
  const message = nonce + url + querystring.stringify(postdata)
  return {
    'Content-Type': 'application/json',
    'ACCESS-NONCE': nonce,
    'ACCESS-SIGNATURE': createSign('sha256', secret_key, message),
    'ACCESS-KEY': api_key,
  };
}


const createPostParam = function(objarray) {
  const postparams = {};
  objarray.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
      postparams[key] = obj[key];
    });
  });
  return postparams;
}
const createPostOption = function(url, api_key, secret_key, user_agent, nonce, params) {
  var post = createPostParam([params]);
  return {
    url: url,
    form: post,
    headers: createHeader(url, api_key, secret_key, nonce, post),
  };
}
const createPrivateApi = module.exports = function(api_key, secret_key, user_agent, nonce_func) {
  var url = function() {
    return api_url
  };
  var initnonce = new Date() / 1000 | 0;
  nonce_func = nonce_func || function() {
    return initnonce++;
  }
  var post_query = function(method, params, callback) {
    request.post(createPostOption(url() + method, api_key, secret_key, user_agent, nonce_func(), params), function(error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(null, JSON.parse(body));
      } else {
        callback('error: post_query');
      }
    });
  };
  var delete_query = function(method, params, callback) {
    request.del(createPostOption(url() + method, api_key, secret_key, user_agent, nonce_func(), params), function(error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(null, JSON.parse(body));
      } else {
        callback('error: delete_query');
      }
    });
  };
  var get_query = function(method, params, callback) {
    request.get(createPostOption(url() + method, api_key, secret_key, user_agent, nonce_func(), params), function(error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(null, JSON.parse(body))
      } else {
        callback('error: get_query');
      }
    });
  };
  return {
    getBalance: function(callback) {
      return get_query('/accounts/balance', {}, callback)
    },
    activeOrders: function(callback) {
      return get_query('/exchange/orders/opens', {}, callback)
    },
    trade: function(currency_pair, action, price, amount, callback) {
      return post_query('/exchange/orders', {
        pair: currency_pair,
        order_type: action,
        rate: price,
        amount: amount
      }, callback)
    },
    cancelOrder: function(order_id, callback) {
      return delete_query('/exchange/orders/' + order_id, {}, callback)
    },
  };
}

// @@ to check all apis format
const cc = createPrivateApi(api_key, secret_key, 'user agent is node-coincheck');


function getBalance() {
  return new Promise((resolve, reject) => {
    const cc = createPrivateApi(api_key, secret_key, 'user agent is node-coincheck');

    cc.getBalance(function(err, body) {
      if (err)
        reject(err)
      resolve(body);
    })
  })
}

function getActiveOrders() {
  return new Promise((resolve, reject) => {
    const cc = createPrivateApi(api_key, secret_key, 'user agent is node-coincheck');

    cc.activeOrders(function(err, body) {
      if (err)
        return reject(err)
      if (body.orders.length < 1)
        return reject([])

      const stacks = []

      body.orders.forEach((trade) => {

        const result = {
          id: Number(trade.id),
          rate: Number(trade.rate),
          pending: Number(trade.pending_amount)
        }
        stacks.push(result)
      })
      resolve(stacks)
    });
  })
}

function cancelOrder(_order_num) {
  return new Promise((resolve, reject) => {
    const cc = createPrivateApi(api_key, secret_key, 'user agent is node-coincheck');

    cc.cancelOrder(Number(_order_num), function(err, body) {
      if (err)
        reject(err)
      resolve(body);
    });
  })
}

function getTicker() {
  return new Promise((resolve, reject) => {
    request.get({
      url: api_url + '/ticker'
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body))
      } else {
        reject('error: ticker error');
      }
    })
  })
}

function getAsk() {
  return new Promise((resolve, reject) => {
    getTicker()
      .then((result) => {
        resolve(result.ask)
      })
      .catch((err) => reject(err))
  })
}

function getBid() {
  return new Promise((resolve, reject) => {
    getTicker()
      .then((result) => {
        resolve(result.bid)
      })
      .catch((err) => reject(err))
  })
}

function pushOrder(_pair, _method, _price, _quantitiy) {
  return new Promise((resolve, reject) => {
    if (Number(_price) < 0 || Number(_quantitiy) < 0)
      reject(new Error("order has't been pushed"))
    const pair = _pair == 'btc' ? 'btc_jpy' : _pair
    const cc = createPrivateApi(api_key, secret_key, 'user agent is node-coincheck');

    cc.trade(pair, _method, _price, _quantitiy, function(err, body) {
      if (err)
        return reject(err)

      console.log('coincheck order submitted');
      resolve(body);
    });
  })
}

function getOrderDetail(_id) {
  return new Promise((resolve, reject) => {
    const cc = createPrivateApi(api_key, secret_key, 'user agent is node-coincheck');

    cc.activeOrders(function(err, body) {
      var _order
      if (err)
        return reject(err)
      if (body.orders.length < 1)
        return resolve([])
      body.orders.forEach((order) => {
        if (Number(order.id) == Number(_id)) {

          _order = {
              id: Number(order.id),
              rate: Number(order.rate),
              pending: Number(order.pending_amount)
            }
            //console.log(_order,_id);

          return resolve(_order)
        }
      })
    })
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
  getOrderDetail,
  cancelAll
}
