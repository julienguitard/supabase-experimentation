import type { BrowserlessClient } from '../../../packages/types/index.ts'

export const makeMockBrowserlessClient = (
  overrides: Partial<BrowserlessClient> = {}
): BrowserlessClient => ({
  url: 'https://chrome.browserless.io',
  headers: {
    'Authorization': 'Bearer test-token',
    'Content-Type': 'application/json'
  },
  completeBody: (fetchableUrl: string) => ({
    url: fetchableUrl,
    elements: [
      { selector: 'body' },
      { selector: 'main' }
    ]
  }),
  ...overrides
})

export const sampleMockBrowserlessClient = makeMockBrowserlessClient()

