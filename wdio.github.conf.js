import allure from 'allure-commandline'
import { generateAccessibilityReportIndex } from './test/helpers/accessibility-checker.js'

const oneMinute = 60 * 1000

export const config = {
  runner: 'local',
  baseUrl: `http://localhost:3000`,
  hostname: process.env.CHROMEDRIVER_URL || '127.0.0.1',
  port: process.env.CHROMEDRIVER_PORT || 4444,
  specs: ['./test/specs/**/*.e2e.js'],
  exclude: [],
  maxInstances: 1,

  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--no-sandbox',
          '--disable-infobars',
          '--headless',
          '--disable-gpu',
          '--window-size=1920,1080',
          '--enable-features=NetworkService,NetworkServiceInProcess',
          '--password-store=basic',
          '--use-mock-keychain',
          '--dns-prefetch-disable',
          '--disable-background-networking',
          '--disable-remote-fonts',
          '--ignore-certificate-errors',
          '--disable-dev-shm-usage'
        ]
      }
    }
  ],

  execArgv: ['--loader', 'esm-module-alias/loader'],

  logLevel: 'info',

  logLevels: {
    webdriver: 'error'
  },
  bail: 0,
  waitforTimeout: 10000,
  waitforInterval: 200,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: 'mocha',

  reporters: [
    [
      'spec',
      {
        addConsoleLogs: true,
        realtimeReporting: true,
        color: false
      }
    ],
    [
      'allure',
      {
        outputDir: 'allure-results'
      }
    ]
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: oneMinute
  },
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    if (error) {
      await browser.takeScreenshot()
    }
  },
  onComplete: function (exitCode, config, capabilities, results) {
    const specs = results?.specs ?? []
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
