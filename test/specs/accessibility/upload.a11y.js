import UploadPage from 'page-objects/upload.page.js'
import {
  analyseAccessibility,
  initialiseAccessibilityChecking
} from '~/test/helpers/accessibility-helper.js'

describe('Upload flow', () => {
  beforeEach(async () => {
    await initialiseAccessibilityChecking()
  })

  it('Select knowledge group page', async () => {
    await UploadPage.openUpload()
    await analyseAccessibility('Select Knowledge Group Page')
  })

  it('Create knowledge group page', async () => {
    await UploadPage.openCreateGroup()
    await analyseAccessibility('Upload Create Group Page')
  })

  it('File upload page and upload status page', async () => {
    await UploadPage.openUpload()
    await UploadPage.selectFirstKnowledgeGroup()
    await UploadPage.clickContinue()

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes('/upload/files/'),
      {
        timeout: 10000,
        timeoutMsg: 'Expected redirect to /upload/files/ after selecting group'
      }
    )

    await analyseAccessibility('Upload File Upload Page')

    await UploadPage.clickUploadFiles()
    await analyseAccessibility('Upload Status Page')
  })
})
