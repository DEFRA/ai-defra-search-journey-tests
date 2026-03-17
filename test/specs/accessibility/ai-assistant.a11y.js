import { browser } from '@wdio/globals'

import AiAssistantPage from 'page-objects/ai-assistant.page.js'
import {
  analyseAccessibility,
  initialiseAccessibilityChecking
} from '~/test/helpers/accessibility-helper.js'

const wireMockUrl = process.env.AWS_ENDPOINT_URL_BEDROCK_RUNTIME

describe('AI Assistant', () => {
  beforeEach(async () => {
    await initialiseAccessibilityChecking()
    if (wireMockUrl) {
      await browser.call(async () => {
        const response = await fetch(`${wireMockUrl}/__admin/scenarios/reset`, {
          method: 'POST'
        })
        if (!response.ok) {
          throw new Error(
            `Failed to reset WireMock scenarios: ${response.statusText}`
          )
        }
      })
    }
  })

  it('AI Assistant Home Page', async () => {
    await AiAssistantPage.openHome()
    await analyseAccessibility('AI Assistant Home Page')
  })

  it('AI Assistant Chat Page', async () => {
    await AiAssistantPage.openStart()
    await AiAssistantPage.submitQuestion(
      'What is UCD?',
      wireMockUrl
        ? "It's this really cool thing called User Centred Design"
        : null
    )

    await analyseAccessibility('AI Assistant Chat Page')
  })

  it('AI Assistant Feedback & Feedback Success Page', async () => {
    await AiAssistantPage.openFeedback()
    await analyseAccessibility('AI Assistant Feedback Page')

    await AiAssistantPage.selectRadioById('wasHelpful')
    await AiAssistantPage.clickSubmit()

    await analyseAccessibility('AI Assistant Feedback Success Page')
  })
})
