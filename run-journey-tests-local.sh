#!/bin/sh
set -x

docker rm -f $(docker ps -aq)
docker compose up --wait -d

export AWS_ENDPOINT_URL_BEDROCK_RUNTIME=http://localhost:8089
npm run test:local
