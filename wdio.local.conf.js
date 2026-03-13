import allure from 'allure-commandline'
import { generateAccessibilityReportIndex } from './test/helpers/accessibility-helper.js'

const debug = process.env.DEBUG
const oneHour = 60 * 60 * 1000

const execArgv = ['--loader', 'esm-module-alias/loader']

if (debug) {
  execArgv.push('--inspect')
}

export const config = {
  runner: 'local',
  specs: ['./test/specs/**/*.e2e.js'],
  exclude: [
    // 'path/to/excluded/files'
  ],
  maxInstances: 1,
  capabilities: debug
    ? [{ browserName: 'chrome' }]
    : [
        {
          maxInstances: 1,
          browserName: 'chrome',
          'goog:chromeOptions': {
            args: [
              '--no-sandbox',
              '--disable-infobars',
              '--disable-gpu',
              '--window-size=1920,1080'
            ]
          }
        }
      ],

  execArgv,
  logLevel: debug ? 'debug' : 'info',

  logLevels: {
    webdriver: debug ? 'debug' : 'error'
  },
  bail: 1,
  baseUrl: 'http://localhost:3000',
  waitforTimeout: 10000,
  waitforInterval: 200,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results'
      }
    ]
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: debug ? oneHour : 60000
  },
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    await browser.takeScreenshot()

    if (error) {
      browser.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "At least 1 assertion failed"}}'
      )
    }
  },
  onComplete: function (exitCode, config, capabilities, results) {
    const specs = [].concat(...(config.specs ?? []))
    const ranA11y = specs.some((s) => s.endsWith('.a11y.js'))
    const ranE2e = specs.some((s) => s.endsWith('.e2e.js'))

    if (ranA11y) {
      generateAccessibilityReportIndex()
    }

    if (ranE2e) {
      const reportError = new Error('Could not generate Allure report')
      const generation = allure(['generate', 'allure-results', '--clean'])

      return new Promise((resolve, reject) => {
        const generationTimeout = setTimeout(
          () => reject(reportError),
          60 * 1000
        )

        generation.on('exit', function (code) {
          clearTimeout(generationTimeout)

          if (code !== 0) {
            return reject(reportError)
          }

          allure(['open'])
          resolve()
        })
      })
    }
  }
}
