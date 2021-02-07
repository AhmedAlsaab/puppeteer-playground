const secret = require('../secret');
const fetch = require('node-fetch');
const moment = require('moment');

async function sendNotification(product, notifiedProducts) {
  webhookData = {
    content: secret.discordSecret.roleId,

    embeds: [
      {
        title: 'Stock Notifier',
        fields: [
          { name: 'Product', value: product.title },
          { name: 'URL', value: product.purchaseLink },
          { name: 'Price', value: product.price },
          { name: 'Store', value: 'Amazon-B' },
        ],
        color: 5814783,
        imagine: {
          url: null,
        },
      },
    ],
  };

  fetch(secret.discordSecret.webhookURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhookData),
  }).then((response) => {
    if (response.status != 400) {
      notifiedProducts.push({
        productTitle: product.title,
        time: moment().format(),
      });
    }
  });
}

module.exports = {
  sendNotification,
};
