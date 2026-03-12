#!/bin/sh
set -x

docker rm -f $(docker ps -aq)
docker compose up --wait -d

export WIREMOCK_URL=http://localhost:8089
npm run test:local
