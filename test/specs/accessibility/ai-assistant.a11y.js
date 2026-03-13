import { browser } from '@wdio/globals'

import AiAssisstantPage from 'page-objects/ai-assistant.page.js'
import {
  analyseAccessibility,
  initialiseAccessibilityChecking
} from '~/test/helpers/accessibility-helper.js'

describe('AI Assistant', () => {
  beforeEach(async () => {
    await initialiseAccessibilityChecking()
    await browser.call(async () => {
      const response = await fetch(
        `${process.env.WIREMOCK_URL}/__admin/scenarios/reset`,
        {
          method: 'POST'
        }
      )
      if (!response.ok) {
        throw new Error(
          `Failed to reset WireMock scenarios: ${response.statusText}`
        )
      }
    })
  })

  it('AI Assistant Home Page', async () => {
    await AiAssisstantPage.openHome()
    await analyseAccessibility('AI Assistant Home Page')
  })

  it('AI Assistant Chat Page', async () => {
    await AiAssisstantPage.openStart()
    await AiAssisstantPage.submitQuestion(
      'What is UCD?',
      "It's this really cool thing called User Centred Design"
    )

    await analyseAccessibility('AI Assistant Chat Page')
  })

  it('AI Assistant Chat Page', async () => {
    await AiAssisstantPage.openStart()
    await AiAssisstantPage.submitQuestion(
      'What is UCD?',
      "It's this really cool thing called User Centred Design"
    )

    await analyseAccessibility('AI Assistant Chat Page')
  })

  it('AI Assistant Feedback & Feedback Success Page', async () => {
    await AiAssisstantPage.openFeedback()
    await analyseAccessibility('AI Assistant Feedback Page')

    await AiAssisstantPage.selectRadioById('wasHelpful')
    await AiAssisstantPage.clickSubmit()

    await analyseAccessibility('AI Assistant Feedback Success Page')
  })
})
