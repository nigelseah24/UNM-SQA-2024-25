const { Builder, By, until } = require("selenium-webdriver");



async function verifyVideoPlayback(driver) {
  try {
    const playedTimeElement = await driver.wait(
      until.elementLocated(By.css(".played-seconds")),
      10000
    );

    const initialPlayedTime = parseFloat(
      (await playedTimeElement.getText()).replace("Played seconds: ", "")
    );
    console.log("Initial played seconds: ", initialPlayedTime);

    await driver.sleep(5000);

    const updatedPlayedTime = parseFloat(
      (await playedTimeElement.getText()).replace("Played seconds: ", "")
    );
    console.log("Updated played seconds: ", updatedPlayedTime);

    if (updatedPlayedTime > initialPlayedTime) {
      console.log("Test passed: Video is playing");
    } else {
      throw new Error("Test failed: Video did not play");
    }
    return { initialPlayedTime, updatedPlayedTime, playedTimeElement };
  } catch (error) {
    console.error("Video playback test failed:", error);
    throw error;
  }
}

async function test4p2() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:3000");
    await verifyVideoPlayback(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

test4p2();
