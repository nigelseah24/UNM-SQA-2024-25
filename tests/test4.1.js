const { Builder, By, until } = require("selenium-webdriver");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

// Test Case: Verify YouTube Player Play and Pause
async function verifyYouTubePlayerPlayPause(driver) {
  try {
    const iframe = await driver.wait(
      until.elementLocated(By.css("iframe")),
      10000
    );
    await driver.switchTo().frame(iframe);

    const playButton = await driver.wait(
      until.elementLocated(By.css("button.ytp-play-button")),
      5000
    );

    // Allow playback to proceed
    await driver.sleep(3000);

    const isPlaying = await playButton.getAttribute("data-title-no-tooltip");
    if (isPlaying.includes("Pause")) {
      console.log("Test passed: Video is playing in YouTube player");
    } else {
      throw new Error("Test failed: Video did not start playing");
    }

    await playButton.click();
    console.log("Clicked Pause button in YouTube player");

    const isPaused = await playButton.getAttribute("data-title-no-tooltip");
    if (isPaused.includes("Play")) {
      console.log("Test passed: Video is paused in YouTube player");
    } else {
      throw new Error("Test failed: Video did not pause");
    }

    await driver.switchTo().defaultContent();
  } catch (error) {
    console.error("verifyYouTubePlayerPlayPause failed:", error);
    throw error;
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await navigateToApplication(driver);
    await verifyYouTubePlayerPlayPause(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

main();
