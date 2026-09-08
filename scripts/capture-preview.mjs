import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
await page.goto('http://127.0.0.1:5173/system-design-learning-lab/', { waitUntil: 'networkidle' })
await page.locator('.chapter-hero h1').waitFor()
await page.locator('.diagram').waitFor()
await mkdir('assets', { recursive: true })
await page.screenshot({ path: 'assets/screenshot.png', fullPage: false })
await browser.close()
console.log('Captured rendered preview to assets/screenshot.png')
