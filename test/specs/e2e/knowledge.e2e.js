import { browser, expect } from '@wdio/globals'

import KnowledgePage from 'page-objects/knowledge.page.js'

const groupName = `knowledgeTest-${Date.now()}`

describe('Knowledge management flow', () => {
  it('Should navigate from the homepage to the knowledge management page', async () => {
    await browser.url('/')
    await KnowledgePage.clickKnowledgeManagement()

    await expect($('h1')).toHaveText('Knowledge Management')
  })

  it('Should navigate to the add knowledge group page', async () => {
    await KnowledgePage.clickAddNewGroup()

    await expect($('h1')).toHaveText('Add knowledge group')
  })

  it('Should create a new knowledge group and show it in the list', async () => {
    await KnowledgePage.fillGroupForm({ name: groupName })
    await KnowledgePage.submitGroupForm()

    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl()
        return url.includes('/knowledge') && !url.includes('/add')
      },
      {
        timeout: 10000,
        timeoutMsg: 'Expected redirect back to /knowledge after creating group'
      }
    )

    await expect($('h1')).toHaveText('Knowledge Management')

    const groupVisible = await KnowledgePage.groupExistsInTable(groupName)
    await expect(groupVisible).toBe(true)
  })
})
