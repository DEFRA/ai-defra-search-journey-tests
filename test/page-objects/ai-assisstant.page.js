import { Page } from 'page-objects/page'

class AiAssisstantPage extends Page {
  openStart(lang = '') {
    return browser.url(lang + '/start')
  }

  async submitQuestion(question) {
    const textarea = await $('#question')
    await textarea.setValue(question)

    const submitButton = await $('button[type="submit"]')
    await submitButton.click()
  }
}

export default new AiAssisstantPage()
