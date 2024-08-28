const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const lighthouse = require('lighthouse');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const puppeteer = require('puppeteer');
const request = require('request');
const util = require('util');

const dir = 'seo_report';

const options = {
  chromeFlags: ['--disable-mobile-emulation'],
  disableDeviceEmulation: true,
  logLevel: 'info',
};

// eslint-disable-next-line no-shadow
async function lighthouseFromPuppeteer(url, options, config = null) {
  // Launch chrome using chrome-launcher
  const chrome = await chromeLauncher.launch(options);
  options.port = chrome.port;

  // Connect chrome-launcher to puppeteer
  const resp = await util.promisify(request)(`http://localhost:${options.port}/json/version`);
  const { webSocketDebuggerUrl } = JSON.parse(resp.body);
  const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });

  // Run Lighthouse
  const { lhr } = await lighthouse(url, options, config);
  await browser.disconnect();
  await chrome.kill();

  const html = reportGenerator.generateReport(lhr, 'html');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(`${dir}/index.html`, html, (err) => {
    if (err) throw err;
  });
}

lighthouseFromPuppeteer('http://localhost:4000', options);
