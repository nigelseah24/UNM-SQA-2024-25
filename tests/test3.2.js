const { Builder, By, until, Key } = require("selenium-webdriver");
const axios = require("axios"); // Not needed if using in-browser

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}


async function verifyVideoPlayerVisibility(driver, videoCards) {
    let firstVideoCard = videoCards[0];
    await firstVideoCard.click();
  
    let videoPlayer = await driver.wait(
      until.elementLocated(By.css(".video-player")),
      10000
    );
  
    if (videoPlayer) {
      console.log("Test passed: Video player is visible after click");
    } else {
      console.log("Test failed: Video player not visible after click");
      throw new Error("Video player is not visible");
    }
    return videoPlayer;
  }


  async function main() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
      await navigateToApplication(driver);
  
      await verifyVideoPlayerVisibility(driver);
    } catch (error) {
      console.error(error);
    } finally {
      await driver.quit();
    }
  
    // Test logic here
  }
  
  main();