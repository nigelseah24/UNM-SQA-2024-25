const { By, until, Key } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

async function verifyVideoCardsCount(driver) {
  const videoCards = await driver.wait(
    until.elementsLocated(By.css(".video-card")),
    10000 // Wait up to 10 seconds
  );
  return videoCards;
}

async function verifyVideoPlayerVisibility(driver, videoCards) {
  const firstVideoCard = videoCards[0];
  await firstVideoCard.click();

  const videoPlayer = await driver.wait(
    until.elementLocated(By.css(".video-player")),
    10000 // Wait up to 10 seconds
  );

  if (!videoPlayer) {
    console.log("Video player not visible after click");
    throw new Error("Video player is not visible");
  }
  return videoPlayer;
}

// Test Case: Verify YouTube Player Play and Pause
async function verifyYouTubePlayerPlayPause(driver) {
  try {
    const iframe = await driver.wait(
      until.elementLocated(By.css("iframe")),
      10000 // Wait up to 10 seconds
    );
    await driver.switchTo().frame(iframe);

    const playButton = await driver.wait(
      until.elementLocated(By.css("button.ytp-play-button")),
      5000 // Wait up to 5 seconds
    );

    // Allow playback to proceed
    await driver.sleep(3000);

    await playButton.click();

    const isPaused = await playButton.getAttribute("data-title-no-tooltip");
    if (isPaused.includes("Play")) {
      // console.log("Test case 4.1 passed: Video is paused in YouTube player");
    } else {
      throw new Error("Test case 4.1 failed: Video did not pause");
    }

    await driver.sleep(3000);

    await playButton.click();

    const isPlaying = await playButton.getAttribute("data-title-no-tooltip");
    if (isPlaying.includes("Pause")) {
      // console.log("Test case 4.2 passed: Video is playing in YouTube player");
    } else {
      throw new Error("Test case 4.2 failed: Video did not start playing");
    }

    await driver.switchTo().defaultContent();
  } catch (error) {
    console.error("verifyYouTubePlayerPlayPause failed:", error);
    throw error;
  }
}

async function verifyVideoPlayback(driver) {
  const playedTimeElement = await driver.wait(
    until.elementLocated(By.css(".played-seconds")),
    10000 // Wait up to 10 seconds
  );

  const initialPlayedTime = parseFloat(
    (await playedTimeElement.getText()).replace("Played seconds: ", "")
  );

  await driver.sleep(5000);

  const updatedPlayedTime = parseFloat(
    (await playedTimeElement.getText()).replace("Played seconds: ", "")
  );

  return { initialPlayedTime, updatedPlayedTime, playedTimeElement };
}

async function verifyPlaybackControls(driver, videoPlayer, updatedPlayedTime) {
  await videoPlayer.click();

  await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
  await driver.sleep(2000);

  const forwardPlayedTimeElement = await driver.wait(
    until.elementLocated(By.css(".played-seconds")),
    10000 // Wait up to 10 seconds
  );
  const forwardPlayedTime = parseFloat(
    (await forwardPlayedTimeElement.getText()).replace("Played seconds: ", "")
  );

  if (forwardPlayedTime > updatedPlayedTime) {
    // console.log("Test case 4.3 passed: Right arrow key moves video forward");
  } else {
    console.log(
      "Test case 4.3 failed: Right arrow key did not move video forward"
    );
    throw new Error("Forward functionality failed");
  }

  await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
  await driver.sleep(2000);

  const backwardPlayedTimeElement = await driver.wait(
    until.elementLocated(By.css(".played-seconds")),
    10000 // Wait up to 10 seconds
  );
  const backwardPlayedTime = parseFloat(
    (await backwardPlayedTimeElement.getText()).replace("Played seconds: ", "")
  );

  if (backwardPlayedTime < forwardPlayedTime && backwardPlayedTime >= 0) {
    // console.log("Test case 4.4 passed: Left arrow key moves video backward");
  } else {
    console.log(
      "Test case 4.4 failed: Left arrow key did not move video backward"
    );
    throw new Error("Backward functionality failed");
  }
}

describe("Test case 4: Verify YouTube Video Playback", function () {
  let driver;

  this.timeout(20000);

  before(async () => {
    driver = await getDriver(); // Reuse shared WebDriver
  });

  it("should verify video player visibility after clicking a video card", async () => {
    await navigateToApplication(driver);
    const videoCards = await verifyVideoCardsCount(driver);
    await verifyVideoPlayerVisibility(driver, videoCards);
  });

  it("should verify YouTube player play and pause functionality", async () => {
    await verifyYouTubePlayerPlayPause(driver);
  });

  it("should verify video playback and controls", async () => {
    const videoCards = await verifyVideoCardsCount(driver);
    const videoPlayer = await verifyVideoPlayerVisibility(driver, videoCards);
    const { updatedPlayedTime } = await verifyVideoPlayback(driver);
    await verifyPlaybackControls(driver, videoPlayer, updatedPlayedTime);
  });
});
