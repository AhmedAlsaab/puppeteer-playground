const notifier = require('./notify-discord');
const secret = require('../../secret');
const customLogger = require('./logger');
const moment = require('moment');

const alreadyNotified = [];

async function handleProductStatus(product, formattedPrice, maxPrice) {
  if (parseFloat(formattedPrice) < maxPrice) {
    await notifier.sendNotification(product, alreadyNotified);

    customLogger.logProduct(product.title, 'In Stock', product.price);
  } else {
    customLogger.logProduct(product.title, 'Overpriced', product.price);
  }
}

async function determineStock(product) {
  await clearAlreadyNotified();

  const price = product.price.replace(/[,£]/g, '');

  const getProductTitles = alreadyNotified.map((x) => x.productTitle);

  if (!getProductTitles.includes(product.title)) {
    if (product.title.includes(3070)) {
      await handleProductStatus(product, price, 700);
    }
    if (product.title.includes(3080)) {
      await handleProductStatus(product, price, 1000);
    }

    if (product.title.includes(3090)) {
      await handleProductStatus(product, price, 1800);
    }
  } else {
    customLogger.logProduct(product.title, 'Already Notified', product.price);
  }
}

async function createProduct(title, purchaseLink, price) {
  const regex = /[^?]*$/;

  const product = {
    title: title,
    purchaseLink:
      'https://www.amazon.co.uk' +
      purchaseLink.replace(regex, secret.amazonAffiliateCode),
    price: price,
  };

  return product;
}

// Remove already notified product names from array if time since notification is greater than 30 minutes

function checkTimeDifference(time) {
  return moment().diff(moment(time), 'minutes');
}

async function clearAlreadyNotified() {
  alreadyNotified.forEach((product, i) => {
    if (checkTimeDifference(product.time) > 30) {
      alreadyNotified.splice(i, 1);
    }
  });
}

module.exports = {
  createProduct,
  determineStock,
};
