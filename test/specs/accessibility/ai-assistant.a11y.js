import { browser } from '@wdio/globals'

import AiAssistantPage from 'page-objects/ai-assistant.page.js'
import {
  analyseAccessibility,
  initialiseAccessibilityChecking
} from '~/test/helpers/accessibility-helper.js'
import { resetWireMockState } from '~/test/helpers/wiremock-reset.js'

describe('AI Assistant', () => {
  beforeEach(async () => {
    await initialiseAccessibilityChecking()
    const base = process.env.AWS_ENDPOINT_URL_BEDROCK_RUNTIME
    if (base) {
      await browser.call(async () => {
        await resetWireMockState(base)
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
      process.env.AWS_ENDPOINT_URL_BEDROCK_RUNTIME
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
