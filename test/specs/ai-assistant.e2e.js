import { browser, expect } from '@wdio/globals'

import AiAssisstantPage from 'page-objects/ai-assisstant.page.js'

describe('AI Assistant', () => {
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
    await AiAssisstantPage.submitQuestion('What is UCD?')

    const conversationContainer = await $('.app-conversation-container')
    const text = await conversationContainer.getText()
    expect(text).toContain('What is UCD?')
    expect(text).toContain(
      "It's this really cool thing called User Centred Design"
    )
  })
})
