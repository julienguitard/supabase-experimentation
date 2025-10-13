import type { BrowserFactory} from '../../../packages/types/index.ts'
import type { Browser } from "npm:puppeteer-core";


export const makeMockBrowserFactory = (
  overrides: Partial<BrowserFactory> = {}
): BrowserFactory => ({
  browser: async (): Promise<Browser> => {
    return {
      close: async () => {},
      newPage: async () => ({} as any)
    } as Browser
  },
  ...overrides
})

export const sampleMockBrowserFactory = makeMockBrowserFactory()

