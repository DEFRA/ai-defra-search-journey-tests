import { browser, expect } from '@wdio/globals'

import AiAssisstantPage from 'page-objects/ai-assisstant.page.js'

describe('AI Assistant', () => {
  beforeEach(async () => {
    await browser.call(async () => {
      const response = await fetch(
        'http://localhost:8089/__admin/scenarios/reset',
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

  it('Should be on the "AI Assistant" page', async () => {
    await AiAssisstantPage.openStart()

    await expect(browser).toHaveTitle('AI Assistant')

    const conversationContainer = await $('.app-conversation-container')
    await expect(conversationContainer).toBeExisting()

    const questionInput = await $('#question')
    await expect(questionInput).toBeExisting()
  })

  it('Should be able to submit a question and get an answer', async () => {
    await AiAssisstantPage.openStart()
    await AiAssisstantPage.submitQuestion(
      'What is UCD?',
      "It's this really cool thing called User Centred Design"
    )

    const conversationContainer = await $('.app-conversation-container')
    const text = await conversationContainer.getText()
    expect(text).toContain('What is UCD?')
    expect(text).toContain(
      "It's this really cool thing called User Centred Design"
    )
  })

  it('Should be able to have a conversation with the AI Assistant', async () => {
    await AiAssisstantPage.openStart()
    await AiAssisstantPage.submitQuestion(
      'What is UCD?',
      "It's this really cool thing called User Centred Design"
    )
    await AiAssisstantPage.submitQuestion(
      'Is it good practice to adopt in software development?',
      "Absolutely, you'll produce much better software geared towards users needs"
    )

    const conversationContainer = await $('.app-conversation-container')
    const text = await conversationContainer.getText()

    expect(text).toContain('What is UCD?')
    expect(text).toContain(
      "It's this really cool thing called User Centred Design"
    )
    expect(text).toContain(
      'Is it good practice to adopt in software development?'
    )
    expect(text).toContain(
      "Absolutely, you'll produce much better software geared towards users needs"
    )
  })
})
