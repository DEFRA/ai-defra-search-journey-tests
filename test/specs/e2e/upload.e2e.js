import { browser, expect } from '@wdio/globals'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import UploadPage from 'page-objects/upload.page.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.resolve(
  __dirname,
  '../../fixtures/test-document.jsonl'
)

describe('Upload flow', () => {
  it('Should navigate from the homepage to the upload page', async () => {
    await UploadPage.open()
    await UploadPage.clickUploadFile()

    const heading = await $('h1')
    await expect(heading).toHaveText('Upload files to knowledge group')
  })

  it('Should create a new knowledge group, select it, and proceed to file upload', async () => {
    await UploadPage.openUpload()
    await UploadPage.clickCreateNewGroup()

    const createHeading = await $('h1')
    await expect(createHeading).toHaveText('Create a knowledge group')

    await UploadPage.fillCreateGroupForm({
      name: 'journey test',
      description: 'journey test',
      informationAssetOwner: 'tester'
    })
    await UploadPage.submitCreateGroup()

    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl()
        return url.includes('/upload') && !url.includes('/create-group')
      },
      {
        timeout: 10000,
        timeoutMsg:
          'Expected redirect back to /upload after creating knowledge group'
      }
    )

    await expect($('h1')).toHaveText('Upload files to knowledge group')

    await UploadPage.selectKnowledgeGroup('journey test')
    await UploadPage.clickContinue()

    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl()
        return url.includes('/upload/files/')
      },
      {
        timeout: 10000,
        timeoutMsg:
          'Expected redirect to /upload/files/{reference} after selecting knowledge group'
      }
    )

    await expect($('h1')).toHaveText('Upload files')
  })

  it('Should upload a file and reach the upload status page', async () => {
    await UploadPage.selectFile(FIXTURE_PATH)
    await UploadPage.clickUploadFiles()

    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl()
        return url.includes('/upload-status/')
      },
      {
        timeout: 30000,
        timeoutMsg:
          'Expected redirect to /upload-status/{reference} after uploading file'
      }
    )

    await expect($('.govuk-panel__title')).toHaveText(
      'Files uploaded successfully'
    )
  })
})
