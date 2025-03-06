const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const timestamp = new Date().toISOString();
  
  const params = {
    TableName: process.env.EVENTS_TABLE,
    Item: {
      id: uuid.v4(),
      principalId: data.principalId,
      createdAt: timestamp,
      body: data.content
    }
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      event: JSON.stringify(params.Item)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};