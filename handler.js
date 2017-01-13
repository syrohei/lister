'use strict';

const Api = require('./api/index.js')

module.exports.create = (event, context, callback) => {
  Api.Create(event, (error, result) => {
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

module.exports.readAll = (event, context, callback) => {
  Api.ReadAll(event, (error, result) => {
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

module.exports.readOne = (event, context, callback) => {
  Api.ReadOne(event, (error, result) => {
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

module.exports.update = (event, context, callback) => {
  Api.Update(event, (error, result) => {
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

module.exports.delete = (event, context, callback) => {
  Api.Delete(event, (error, result) => {
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
