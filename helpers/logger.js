const moment = require('moment');
const chalk = require('chalk');

const log = console.log;

function logProduct(productTitle, status, price = 'N/A') {
  const logMessage = `[${moment().format(
    'h:mm:ss a'
  )}] :: [Amazon] :: [${status}] :: [${productTitle}] :: [${price}]`;

  if (status === 'In Stock') {
    log(chalk.green(logMessage));
  }

  if (status === 'OOS') {
    log(chalk.blue(logMessage));
  }

  if (status === 'Overpriced') {
    log(chalk.red(logMessage));
  }

  if (status === 'Already Notified') {
    log(chalk.yellow(logMessage));
  }
}

module.exports = {
  logProduct,
};
