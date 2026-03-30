class KnowledgePage {
  open() {
    return browser.url('/knowledge')
  }

  async clickKnowledgeManagement() {
    const link = await $('a[href="/knowledge"]')
    await link.waitForExist()
    await link.click()
  }

  async clickAddNewGroup() {
    const link = await $('a[href="/knowledge/add"]')
    await link.waitForExist()
    await link.click()
  }

  async fillGroupForm({ name, description = '', informationAssetOwner = '' }) {
    const nameInput = await $('#name')
    await nameInput.waitForExist()
    await nameInput.setValue(name)

    if (description) {
      const descriptionInput = await $('#description')
      await descriptionInput.setValue(description)
    }

    if (informationAssetOwner) {
      const iaoInput = await $('#information-asset-owner')
      await iaoInput.setValue(informationAssetOwner)
    }
  }

  async submitGroupForm() {
    const submitButton = await $('button[type="submit"]')
    await submitButton.click()
  }

  async groupExistsInTable(name) {
    const cells = await $$('.govuk-table__cell')
    for (const cell of cells) {
      const text = await cell.getText()
      if (text.trim() === name) return true
    }
    return false
  }
}

export default new KnowledgePage()
