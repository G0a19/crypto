const puppeteer = require("puppeteer");
const TelegramBot = require("node-telegram-bot-api");

(async () => {
  setInterval(async () => {
    const bot = new TelegramBot("5572141228:AAF0mT8Mw-RC9hXRzD7IGlgzSAPk7UhnQKk", { polling: true });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://coinmarketcap.com/");
    await page.waitForSelector(".cmc-table");

    const elementStatus = await page.$$eval(".cmc-table tr > td:nth-child(5) > span", (elements) => {
      return elements.map((element) => {
        const childElement = element.querySelector("span");
        return childElement && childElement.classList.contains("icon-Caret-down");
      });
    });

    const elementValues = await page.$$eval(".cmc-table tr > td:nth-child(5) > span", (elements) => {
      return elements.map((element, index) => element.textContent);
    });
    const elementNames = await page.$$eval(".cmc-table tr .kKpPOn", (elements) => {
      return elements.map((element, index) => element.textContent);
    });

    elementStatus.forEach((singleStatus, index) => {
      if (singleStatus === false) {
        if (Number(elementValues[index][0]) > 5) {
          bot.sendMessage(1410551694, `${elementNames[index]}: -${elementValues[index][0]}`);
        }
      }
    });

    await browser.close();
  }, 60000);
})();
