import { browser, expect } from '@wdio/globals'

import AiAssistantPage from 'page-objects/ai-assistant.page.js'
import { resetWireMockState } from '~/test/helpers/wiremock-reset.js'

describe('AI Assistant', () => {
  beforeEach(async () => {
    await browser.call(async () => {
      await resetWireMockState(process.env.AWS_ENDPOINT_URL_BEDROCK_RUNTIME)
    })
  })

  it('Should navigate from the homepage to the chat', async () => {
    await AiAssistantPage.openHome()
    const startChatLink = await $('a[href="/start"]')
    await startChatLink.click()
    const conversationContainer = await $('.app-conversation-container')
    await expect(conversationContainer).toBeExisting()
  })

  it('Should be on the "AI Assistant" page', async () => {
    await AiAssistantPage.openStart()

    await expect(browser).toHaveTitle('AI Assistant')

    const conversationContainer = await $('.app-conversation-container')
    await expect(conversationContainer).toBeExisting()

    const questionInput = await $('#question')
    await expect(questionInput).toBeExisting()
  })

  it('Should be able to submit a question and get an answer', async () => {
    await AiAssistantPage.openStart()
    await AiAssistantPage.submitQuestion(
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
    await AiAssistantPage.openStart()
    await AiAssistantPage.submitQuestion(
      'What is UCD?',
      "It's this really cool thing called User Centred Design"
    )
    await AiAssistantPage.submitQuestion(
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
