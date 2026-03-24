#!/bin/sh
set -x

docker compose down --volumes --remove-orphans
docker compose up --wait -d

export AWS_ENDPOINT_URL_BEDROCK_RUNTIME=http://127.0.0.1:8089
export NO_PROXY="localhost,127.0.0.1,${NO_PROXY:-}"
npm run test:a11y
