'use strict';

const Api = require('./api/index.js')

module.exports.tickers_create = (event, context, callback) => {
  Api.tickers.Create("tickers", event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result, null, "\t"),
    };

    context.succeed(response);
  });
};

module.exports.tickers_readAll = (event, context, callback) => {
  Api.tickers.ReadAll("tickers", event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result, null, "\t"),
    };

    context.succeed(response);
  });
};

module.exports.tickers_readOne = (event, context, callback) => {
  Api.tickers.ReadOne("tickers", event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result, null, "\t"),
    };

    context.succeed(response);
  });
};

module.exports.tickers_update = (event, context, callback) => {
  Api.tickers.Update("tickers", event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result, null, "\t"),
    };

    context.succeed(response);
  });
};

module.exports.tickers_delete = ( event, context, callback) => {
  Api.tickers.Delete("tickers",event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result, null, "\t"),
    };

    context.succeed(response);
  });
};

module.exports.increments_create = (event, context, callback) => {
  Api.increments.Create("increments", event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result, null, "\t"),
    };

    context.succeed(response);
  });
};


module.exports.increments_readAll = (event, context, callback) => {
  Api.increments.ReadAll("increments", event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result, null, "\t"),
    };

    context.succeed(response);
  });
};
