const url = 'https://example.org/';

(async () => {
  // Load my dependencies.
  const fs = require('fs')
  const path = require('path')
  const puppeteer = require('puppeteer')
  // Launch Chromium and get a Page to work with.
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  // Set a viewport, this will mostly come into play for screenshots.
  await page.setViewport({width: 1024, height: 578, deviceScaleFactor: 2})
  // Load a page, and wait until it stops loading external resources.
  await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: 5 * 60 * 1000
  })
  // Take a screenshot as visual backup.
  await page.screenshot({
    path: path.resolve(__dirname, 'example.png'),
    fullPage: true
  })
  // Run our archiving function on the page.
  const result = await page.evaluate(
    fs.readFileSync(path.resolve(__dirname, 'masterFunction.js'))
  )
  fs.writeFileSync(path.resolve(__dirname, 'example.html'), result)
  await browser.close()
})()
