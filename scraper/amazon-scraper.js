const puppeteer = require('puppeteer');
const cron = require('node-cron');
const execute = require('child_process').exec;
const customLogger = require('../helpers/logger');
const handleProduct = require('../helpers/product-handler');

const processIDs = [];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function getProductData(page) {
  const products = await page.$$('[class^="style__itemOuter__"]');

  for (let i = 0; i < products.length; i++) {
    const purchaseLink = await products[i].$eval('a', (i) =>
      i.getAttribute('href')
    );

    const title = await products[i].$eval(
      '[class^="style__title__"]',
      (i) => i.textContent
    );

    const price = await products[i].$eval(
      '[class^="style__price__"]',
      (i) => i.textContent
    );

    if (price) {
      const product = await handleProduct.createProduct(
        title,
        purchaseLink,
        price
      );
      await handleProduct.determineStock(product);
    } else {
      customLogger.logProduct(title, 'OOS');
    }
  }
}

async function createBrowser() {
  const browser = await puppeteer.launch();
  processIDs.push(browser.process().pid);
  return browser;
}

async function closeBrowser(browser) {
  await browser.close();
  for (let i = 0; i < processIDs.length; i++) {
    execute(`echo ${process.env.PASSWD} | sudo -S kill -9 ${processIDs[i]}`);
  }
}

// TODO: Change while loop to Cron Job

async function runStockChecker() {
  const browser = await createBrowser();

  const page = await browser.newPage();

  await page.goto(
    'https://www.amazon.co.uk/stores/page/ABFAA5F4-A336-4CA8-94FF-F06D7F0BF3E2?productGridPageIndex=3',
    { waitUntil: 'networkidle2' }
  );

  while (true) {
    await autoScroll(page);

    await getProductData(page);

    await wait(10000);

    await page.setCacheEnabled(false);

    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
  }

  // await closeBrowser(browser);
}

async function wait(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// const startJob = async () => {
//   cron.schedule('*/10 * * * * *', async () => {
//     await runStockChecker();
//   });
// };

// startJob();

runStockChecker();
