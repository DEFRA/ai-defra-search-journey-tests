import { generateAccessibilityReportIndex } from './test/helpers/accessibility-helper.js'

export const config = {
  runner: 'local',
  baseUrl: process.env.BASE_URL,
  specs: ['./test/specs/accessibility/**/*.a11y.js'],
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
          '--window-size=1920,1080'
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
        color: true
      }
    ]
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },

  afterTest: async function (test, context, { error }) {
    if (error) {
      await browser.takeScreenshot()
    }
  },

  onComplete: function (exitCode, config) {
    const specs = [].concat(...(config.specs ?? []))
    if (specs.some((s) => s.endsWith('.a11y.js'))) {
      generateAccessibilityReportIndex()
    }
  }
}
