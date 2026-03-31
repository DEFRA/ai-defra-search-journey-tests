import KnowledgePage from 'page-objects/knowledge.page.js'
import {
  analyseAccessibility,
  initialiseAccessibilityChecking
} from '~/test/helpers/accessibility-helper.js'

describe('Knowledge management', () => {
  beforeEach(async () => {
    await initialiseAccessibilityChecking()
  })

  it('Knowledge list page', async () => {
    await KnowledgePage.open()
    await analyseAccessibility('Knowledge List Page')
  })

  it('Add knowledge group page', async () => {
    await browser.url('/knowledge/add')
    await analyseAccessibility('Add Knowledge Group Page')
  })
})
