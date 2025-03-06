const express = require('express');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configure AWS DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint to handle events
app.post('/events', async (req, res) => {
    console.log('Received Event:', JSON.stringify(req.body));

    const { principalId, content } = req.body;
    const timestamp = new Date().toISOString();

    const params = {
        TableName: "${target_table}",
        Item: {
            id: uuid.v4(),
            principalId: principalId,
            createdAt: timestamp,
            body: content
        }
    };

    try {
        await dynamoDb.put(params).promise();
        const response = {
            statusCode: 201,
            body: params.Item
        };
        console.log('Response:', JSON.stringify(response));
        res.status(201).send(params.Item);
    } catch (error) {
        const errorResponse = {
            statusCode: 500,
            body: error.message
        };
        console.log('Error Response:', JSON.stringify(errorResponse));
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});