const { Builder, By, until } = require("selenium-webdriver");



async function verifyYouTubePlayerPlayPause(driver) {
  try {
    const iframe = await driver.wait(until.elementLocated(By.css("iframe")), 10000);
    await driver.switchTo().frame(iframe);

    const playButton = await driver.wait(
      until.elementLocated(By.css("button.ytp-play-button")),
      5000
    );

    await driver.sleep(3000);

    const isPlaying = await playButton.getAttribute("data-title-no-tooltip");
    if (isPlaying.includes("Pause")) {
      console.log("Test passed: Video is playing in YouTube player");
    } else {
      throw new Error("Test failed: Video did not start playing");
    }

    await playButton.click();

    const isPaused = await playButton.getAttribute("data-title-no-tooltip");
    if (isPaused.includes("Play")) {
      console.log("Test passed: Video is paused in YouTube player");
    } else {
      throw new Error("Test failed: Video did not pause");
    }

    await driver.switchTo().defaultContent();
  } catch (error) {
    console.error("YouTube player Play/Pause test failed:", error);
    throw error;
  }
}

async function test4p1() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:3000");
    await verifyYouTubePlayerPlayPause(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

test4p1();
