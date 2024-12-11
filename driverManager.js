const { Builder } = require("selenium-webdriver");

let driver = null;

// Create or retrieve the WebDriver instance
async function getDriver() {
  if (!driver) {
    driver = await new Builder().forBrowser("chrome").build();
  }
  return driver;
}

// Quit and cleanup the WebDriver instance
async function quitDriver() {
  if (driver) {
    await driver.quit();
    driver = null;
  }
}

module.exports = { getDriver, quitDriver };
