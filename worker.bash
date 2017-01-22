#!/bin/bash


AWS_REGION=ap-northeast-1 TICKER_TABLE=tickers forever start worker/btcbox.js
AWS_REGION=ap-northeast-1 TICKER_TABLE=tickers forever start worker/coincheck.js
AWS_REGION=ap-northeast-1 TICKER_TABLE=tickers forever start worker/quoine.js
