class AiAssistantPage {
  openHome(lang = '') {
    return browser.url(lang + '/')
  }

  openStart(lang = '') {
    return browser.url(lang + '/start')
  }

  openFeedback(lang = '') {
    return browser.url(lang + '/feedback')
  }

  async submitQuestion(question, expectedResponse = null) {
    const textarea = await $('#question')
    await textarea.waitForExist({ timeout: 10000 })
    await textarea.setValue(question)

    const submitButton = await $('button[type="submit"]')
    await submitButton.click()

    const conversationContainer = await $('.app-conversation-container')
    await browser.waitUntil(
      async () => {
        const text = await conversationContainer.getText()
        return text.includes(question)
      },
      {
        timeout: 5000,
        timeoutMsg: `Expected question "${question}" to appear in conversation`
      }
    )

    if (expectedResponse) {
      await browser.waitUntil(
        async () => {
          const container = await $('.app-conversation-container')
          const text = await container.getText()

          if (text.includes(expectedResponse)) {
            return true
          }

          await browser.refresh()
          return false
        },
        {
          timeout: 30000,
          interval: 2000,
          timeoutMsg: `Expected response "${expectedResponse}" to appear after clicking Refresh button`
        }
      )
    }
  }

  async selectRadioById(id) {
    const radio = await $(`#${id}`)
    await radio.waitForExist()
    await browser.execute((el) => el.click(), radio)
  }

  async clickSubmit() {
    const submitButton = await $('button[type="submit"]')
    await submitButton.click()
  }
}

export default new AiAssistantPage()
