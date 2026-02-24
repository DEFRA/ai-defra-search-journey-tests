#!/bin/sh
set -x

docker rm -f $(docker ps -aq)
docker compose up --wait -d

npm run test:local
