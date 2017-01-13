'user strict';


const Promise = require('bluebird');
const AWS = require("aws-sdk");
var endpoint;
if (process.env.IS_OFFLINE){
  endpoint = process.env.LOCAL_DDB_ENDPOINT
}

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: endpoint
});

const dynamo = new AWS.DynamoDB.DocumentClient();


module.exports = (method, params) => {
    return Promise.fromCallback(cb => dynamo[method](params, cb));
}
