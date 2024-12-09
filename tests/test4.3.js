const { Builder, By, until, Key } = require("selenium-webdriver");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

// Test Case: Verify Playback Controls
async function verifyPlaybackControls(driver) {
  try {
    const videoPlayer = await driver.findElement(By.css(".video-player"));
    await videoPlayer.click();

    await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
    await driver.sleep(2000);

    const playedTimeElement = await driver.wait(
      until.elementLocated(By.css(".played-seconds")),
      10000
    );
    const forwardPlayedTime = parseFloat(
      (await playedTimeElement.getText()).replace("Played seconds: ", "")
    );

    if (forwardPlayedTime > 0) {
      console.log("Test passed: Right arrow key moves video forward");
    } else {
      throw new Error("Test failed: Forward functionality did not work");
    }

    await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
    await driver.sleep(2000);

    const backwardPlayedTime = parseFloat(
      (await playedTimeElement.getText()).replace("Played seconds: ", "")
    );

    if (backwardPlayedTime < forwardPlayedTime) {
      console.log("Test passed: Left arrow key moves video backward");
    } else {
      throw new Error("Test failed: Backward functionality did not work");
    }
  } catch (error) {
    console.error("verifyPlaybackControls failed:", error);
    throw error;
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await navigateToApplication(driver);
    await verifyPlaybackControls(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

main();
