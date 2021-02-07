# puppeteer-playground
Playing around with puppeteer, automating and scraping Amazon GPU listings and sending notifications to Discord




![alt text](https://i.imgur.com/GjbRSf3.png)


## Setup

Clone the repo down and install with:

```npm i```

## Private Credentials

At the root of the directory, you need a secret.js file. This file should contain the following:

```
const discordSecret = {
  webhookURL: 'your_webhook_url',
  roleId: 'id of role you want to tag',
};

// Add empty string if you don't have one
const amazonAffiliateCode = 'affiliate_code';

module.exports = {
  discordSecret,
  amazonAffiliateCode,
};
```

## Run

Start the project from the root directory with:

``` npm run start ```
