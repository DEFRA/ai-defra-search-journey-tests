class AiAssisstantPage {
  openStart(lang = '') {
    return browser.url(lang + '/start')
  }

  async submitQuestion(question, expectedResponse = null) {
    const textarea = await $('#question')
    await textarea.setValue(question)

    const submitButton = await $('button[type="submit"]')
    await submitButton.click()

    // Wait for the question to appear in the conversation
    const conversationContainer = await $('.app-conversation-container')
    await browser.waitUntil(
      async () => {
        const text = await conversationContainer.getText()
        return text.includes(question)
      },
      {
        timeout: 1000,
        timeoutMsg: `Expected question "${question}" to appear in conversation`
      }
    )

    // If an expected response is provided, wait for it to appear
    if (expectedResponse) {
      await browser.waitUntil(
        async () => {
          const text = await conversationContainer.getText()
          return text.includes(expectedResponse)
        },
        {
          timeout: 1000,
          timeoutMsg: `Expected response "${expectedResponse}" to appear in conversation`
        }
      )
    }
  }
}

export default new AiAssisstantPage()
