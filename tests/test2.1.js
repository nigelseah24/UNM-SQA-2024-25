const { Builder, By, until, Key } = require("selenium-webdriver");
const axios = require("axios"); // Not needed if using in-browser

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

async function verifyVideoCardsCount(driver) {
  let videoCards = await driver.wait(
    until.elementsLocated(By.css(".video-card")),
    10000
  );

  if (videoCards.length === 12) {
    console.log("Test passed: 12 video cards found");
  } else {
    console.log(
      "Test failed: Expected 12 video cards, found " + videoCards.length
    );
    throw new Error("Incorrect number of video cards displayed");
  }
  return videoCards;
}

async function test2() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await navigateToApplication(driver);

    // Requirement 1 (Yan chang)
    await verifyVideoCardsCount(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }

  // Test logic here
}

test2();
