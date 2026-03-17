#!/bin/sh

echo "run_id: $RUN_ID"
AWS_ENDPOINT_URL_BEDROCK_RUNTIME=${AWS_ENDPOINT_URL_BEDROCK_RUNTIME:-https://ai-defra-search-aws-bedrock-stub.perf-test.cdp-int.defra.cloud}
export AWS_ENDPOINT_URL_BEDROCK_RUNTIME
npm test

npm run test:a11y:cdp

npm run report:publish
publish_exit_code=$?

if [ $publish_exit_code -ne 0 ]; then
  echo "failed to publish test results"
  exit $publish_exit_code
fi

# At the end of the test run, if the suite has failed we write a file called 'FAILED'
if [ -f FAILED ]; then
  echo "test suite failed"
  cat ./FAILED
  exit 1
fi

echo "test suite passed"
exit 0
