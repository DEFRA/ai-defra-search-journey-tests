#!/bin/sh
set -x

docker compose down --volumes --remove-orphans
docker compose up --wait -d

# Match wdio.local.conf.js: 127.0.0.1 reaches the published bedrock-mock port on IPv4
# (Docker Desktop often does not bind localhost → ::1 to the same mapping).
export AWS_ENDPOINT_URL_BEDROCK_RUNTIME=http://127.0.0.1:8089
export NO_PROXY="localhost,127.0.0.1,${NO_PROXY:-}"
npm run test:local
