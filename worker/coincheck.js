const ticker = require('../models/ticker.js');
const btcbox = require('../lib/exchanges/btcbox.js')
const coincheck = require('../lib/exchanges/coincheck.js')

const mail = require('../models/mail.js')

var ask, bid

const ex = {
  'btcbox': btcbox,
  'coincheck': coincheck
}


const params = {
    exchange_name: 'btcbox',
    term: "60"
};

ticker.findTicker(params).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
})
