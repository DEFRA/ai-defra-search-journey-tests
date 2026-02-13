#!/bin/bash

# Create SQS queue for chat job processing
aws --endpoint-url=http://localhost:4566 sqs create-queue \
    --queue-name ai-defra-search-agent-invoke \
    --region eu-west-2

echo "SQS queue 'ai-defra-search-agent-invoke' created successfully"
