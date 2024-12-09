const { Builder, By, until, Key } = require("selenium-webdriver");


async function verifyPlaybackControls(driver, videoPlayer, updatedPlayedTime) {
  try {
    await videoPlayer.click();

    await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
    await driver.sleep(2000);

    const forwardPlayedTimeElement = await driver.wait(
      until.elementLocated(By.css(".played-seconds")),
      10000
    );
    const forwardPlayedTime = parseFloat(
      (await forwardPlayedTimeElement.getText()).replace("Played seconds: ", "")
    );
    console.log("Forward played seconds: ", forwardPlayedTime);

    if (forwardPlayedTime > updatedPlayedTime) {
      console.log("Test passed: Right arrow key moves video forward");
    } else {
      throw new Error("Test failed: Right arrow key did not move video forward");
    }

    await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
    await driver.sleep(2000);

    const backwardPlayedTimeElement = await driver.wait(
      until.elementLocated(By.css(".played-seconds")),
      10000
    );
    const backwardPlayedTime = parseFloat(
      (await backwardPlayedTimeElement.getText()).replace("Played seconds: ", "")
    );
    console.log("Backward played seconds: ", backwardPlayedTime);

    if (backwardPlayedTime < forwardPlayedTime && backwardPlayedTime >= 0) {
      console.log("Test passed: Left arrow key moves video backward");
    } else {
      throw new Error("Test failed: Left arrow key did not move video backward");
    }
  } catch (error) {
    console.error("Playback controls test failed:", error);
    throw error;
  }
}

async function test4p3() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:3000");
    const videoPlayer = await driver.wait(
      until.elementLocated(By.css(".video-player")),
      10000
    );
    const { updatedPlayedTime } = { updatedPlayedTime: 5 }; // Replace with playback test results
    await verifyPlaybackControls(driver, videoPlayer, updatedPlayedTime);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

test4p3();
