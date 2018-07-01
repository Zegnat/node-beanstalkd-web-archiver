// Load my dependencies.
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const masterFunction = fs.readFileSync(path.resolve(__dirname, 'masterFunction.js'))

// Job handler.
module.exports = () => ({
  type: 'node-beanstalkd-web-archiver',
  work: async (payload, respond) => {
    let htmlPath = null
    let screenshotPath = null

    // Validate the payload.
    if (!payload.hasOwnProperty('url') || typeof payload.url !== 'string') {
      console.error('error Received job without URL.')
      respond('bury')
      return
    }
    if (payload.hasOwnProperty('html') && typeof payload.html === 'string') {
      htmlPath = payload.html
    }
    if (payload.hasOwnProperty('screenshot') && typeof payload.screenshot === 'string') {
      screenshotPath = payload.screenshot
    }
    if (htmlPath === null && screenshotPath === null) {
      console.error('error Received neither HTML nor screenshot path.')
      respond('bury')
      return
    }

    // A hacky fix due to Puppeteer issue on Debian
    // https://github.com/GoogleChrome/puppeteer/issues/290
    // these flags are executed when 'npm run start-debian'
    let puppeteerArgs = []
    if (process.argv[4] && process.argv[4] == 'debian') {
        puppeteerArgs = ['--no-sandbox', '--disable-setuid-sandbox']
    }

    // Get working!
    // Launch Chromium and get a Page to work with.
    const browser = await puppeteer.launch({
        headless: !false,
        args: puppeteerArgs
    })
    const page = await browser.newPage()
    // This seems to fix some websites that do not allow resources to be inlined.
    await page.setBypassCSP(true)
    // Set a viewport, this will mostly come into play for screenshots.
    await page.setViewport({width: 1024, height: 578, deviceScaleFactor: 2})
    // Load a page, and wait until it stops loading external resources.
    await page.goto(payload.url, {
      waitUntil: 'networkidle0',
      timeout: 5 * 60 * 1000
    })
    if (screenshotPath !== null) {
      // Take a screenshot as visual backup.
      await page.screenshot({
        path: path.resolve(screenshotPath),
        fullPage: true
      })
    }
    if (htmlPath !== null) {
      // Run our archiving function on the page and write output to disk.
      const result = await page.evaluate(masterFunction)
      fs.writeFileSync(path.resolve(htmlPath), result)
    }
    await browser.close()
    respond('success')
  }
})
