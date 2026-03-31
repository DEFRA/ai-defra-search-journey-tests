class UploadPage {
  open() {
    return browser.url('/')
  }

  openUpload() {
    return browser.url('/upload')
  }

  openCreateGroup() {
    return browser.url('/upload/create-group')
  }

  async clickUploadFile() {
    const uploadButton = await $('a[href="/upload"]')
    await uploadButton.click()
  }

  async clickCreateNewGroup() {
    const link = await $('a[href="/upload/create-group"]')
    await link.waitForExist()
    await link.click()
  }

  async fillCreateGroupForm({ name, description, informationAssetOwner }) {
    const nameInput = await $('#name')
    await nameInput.waitForExist()
    await nameInput.setValue(name)

    const descriptionInput = await $('#description')
    await descriptionInput.setValue(description)

    const iaoInput = await $('#information-asset-owner')
    await iaoInput.setValue(informationAssetOwner)
  }

  async submitCreateGroup() {
    const submitButton = await $('button[type="submit"]')
    await submitButton.click()
  }

  async selectFirstKnowledgeGroup() {
    const select = await $('#knowledge-group')
    await select.waitForExist()

    await browser.waitUntil(
      async () => {
        const opts = await select.$$('option')
        // Wait until there is at least one option with a non-empty value
        for (const opt of opts) {
          const val = await opt.getAttribute('value')
          if (val && val.trim()) return true
        }
        return false
      },
      {
        timeout: 10000,
        timeoutMsg: 'No knowledge groups appeared in the upload dropdown'
      }
    )

    await browser.execute((selectEl) => {
      const option = Array.from(selectEl.options).find(
        (o) => o.value && o.value.trim()
      )
      if (!option) throw new Error('No selectable option found in select')
      selectEl.value = option.value
      selectEl.dispatchEvent(new Event('change', { bubbles: true }))
    }, select)
  }

  async selectKnowledgeGroup(groupName) {
    const select = await $('#knowledge-group')
    await select.waitForExist()

    // option.getText() returns '' for options inside a closed <select> in headless
    // Chrome, so wait on the raw HTML instead.
    await browser.waitUntil(
      async () => {
        const html = await select.getHTML()
        return html.includes(groupName)
      },
      {
        timeout: 10000,
        timeoutMsg: `Knowledge group "${groupName}" did not appear in dropdown`
      }
    )

    // Set the matching option's value via JS and fire a change event so the
    // browser registers the selection before the form is submitted.
    await browser.execute(
      (selectEl, text) => {
        const option = Array.from(selectEl.options).find(
          (o) => o.text.trim() === text
        )
        if (!option) throw new Error(`Option "${text}" not found in select`)
        selectEl.value = option.value
        selectEl.dispatchEvent(new Event('change', { bubbles: true }))
      },
      select,
      groupName
    )
  }

  async clickContinue() {
    const continueButton = await $('button[type="submit"]')
    await continueButton.click()
  }

  async selectFile(absoluteFilePath) {
    const fileInput = await $('#file-upload')
    await fileInput.waitForExist()
    const remotePath = await browser.uploadFile(absoluteFilePath)
    await fileInput.setValue(remotePath)
  }

  async clickUploadFiles() {
    const form = await $('#file-upload-form')
    await form.waitForExist()
    const successRedirect = await form.getAttribute('data-success-redirect')
    await browser.url(successRedirect)
  }
}

export default new UploadPage()
