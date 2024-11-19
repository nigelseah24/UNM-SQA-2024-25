const { Builder, By, until, Key } = require("selenium-webdriver");

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

async function verifyVideoPlayerVisibility(driver, videoCards) {
  let firstVideoCard = videoCards[0];
  await firstVideoCard.click();

  let videoPlayer = await driver.wait(
    until.elementLocated(By.css(".video-player")),
    10000
  );

  if (videoPlayer) {
    console.log("Test passed: Video player is visible");
  } else {
    console.log("Test failed: Video player not visible after click");
    throw new Error("Video player is not visible");
  }
  return videoPlayer;
}

async function verifyVideoPlayback(driver) {
  let playedTimeElement = await driver.wait(
    until.elementLocated(By.css(".played-seconds")),
    10000
  );

  let initialPlayedTime = parseFloat(
    (await playedTimeElement.getText()).replace("Played seconds: ", "")
  );
  console.log("Initial played seconds: ", initialPlayedTime);

  await driver.sleep(5000);

  let updatedPlayedTime = parseFloat(
    (await playedTimeElement.getText()).replace("Played seconds: ", "")
  );
  console.log("Updated played seconds: ", updatedPlayedTime);

  if (updatedPlayedTime > initialPlayedTime) {
    console.log("Test passed: Video is playing");
  } else {
    console.log("Test failed: Video is not playing");
    throw new Error("Video did not play");
  }
  return { initialPlayedTime, updatedPlayedTime, playedTimeElement };
}

async function verifyPlaybackControls(driver, videoPlayer, updatedPlayedTime) {
  await videoPlayer.click();

  await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
  await driver.sleep(2000);

  let forwardPlayedTimeElement = await driver.wait(
    until.elementLocated(By.css(".played-seconds")),
    10000
  );
  let forwardPlayedTime = parseFloat(
    (await forwardPlayedTimeElement.getText()).replace("Played seconds: ", "")
  );
  console.log("Forward played seconds: ", forwardPlayedTime);

  if (forwardPlayedTime > updatedPlayedTime) {
    console.log("Test passed: Right arrow key moves video forward");
  } else {
    console.log("Test failed: Right arrow key did not move video forward");
    throw new Error("Forward functionality failed");
  }

  await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
  await driver.sleep(2000);

  let backwardPlayedTimeElement = await driver.wait(
    until.elementLocated(By.css(".played-seconds")),
    10000
  );
  let backwardPlayedTime = parseFloat(
    (await backwardPlayedTimeElement.getText()).replace("Played seconds: ", "")
  );
  console.log("Backward played seconds: ", backwardPlayedTime);

  if (backwardPlayedTime < forwardPlayedTime && backwardPlayedTime >= 0) {
    console.log("Test passed: Left arrow key moves video backward");
  } else {
    console.log("Test failed: Left arrow key did not move video backward");
    throw new Error("Backward functionality failed");
  }
}

async function verifyKeywordDisplay(driver) {
  let keywordButtons = await driver.wait(
    until.elementsLocated(By.css(".keyword-list button")),
    10000
  );

  const initialKeywords = [
    "AI",
    "Testing",
    "Workflow",
    "Code",
    "Assistant",
    "Software",
    "Development",
    "Debugging",
    "Documentation",
    "Learning",
    "Tools",
    "Automation",
  ];

  let displayedKeywords = [];
  for (let button of keywordButtons) {
    let text = await button.getText();
    displayedKeywords.push(text);
  }

  if (initialKeywords.every((keyword) => displayedKeywords.includes(keyword))) {
    console.log("Test passed: All initial keywords are displayed");
  } else {
    console.log("Test failed: Not all initial keywords are displayed");
    console.log(displayedKeywords);
    throw new Error("Keyword display mismatch");
  }
}

async function verifyKeywordSelection(driver, videoCards) {
  const initialVideoCount = videoCards.length;

  let keywordButton = await driver.findElement(
    By.xpath("//button[contains(text(), 'AI')]")
  );
  await keywordButton.click();
  console.log("Keyword 'AI' clicked.");

  await driver.sleep(2000);

  videoCards = await driver.findElements(By.css(".video-card"));
  let updatedVideoCount = videoCards.length;
  console.log("Updated video count after selecting 'AI':", updatedVideoCount);

  if (updatedVideoCount !== initialVideoCount) {
    console.log(
      "Test passed: Video collection updated upon keyword selection"
    );
  } else {
    console.log(
      "Test failed: Video collection did not update upon keyword selection"
    );
    throw new Error("Keyword selection did not update videos");
  }

  let revertedVideoCards = await driver.findElements(By.css(".video-card"));
  let revertedVideoCount = revertedVideoCards.length;

  if (revertedVideoCount === initialVideoCount) {
    console.log(
      "Test passed: Video collection reverted upon keyword deselection"
    );
  } else {
    console.log(
      "Test failed: Video collection did not revert upon keyword deselection"
    );
    throw new Error("Keyword deselection did not revert videos");
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await navigateToApplication(driver);

    let videoCards = await verifyVideoCardsCount(driver);
    let videoPlayer = await verifyVideoPlayerVisibility(driver, videoCards);

    let { updatedPlayedTime } = await verifyVideoPlayback(driver);
    await verifyPlaybackControls(driver, videoPlayer, updatedPlayedTime);

    await verifyKeywordDisplay(driver);
    await verifyKeywordSelection(driver, videoCards);
  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await driver.quit();
  }
}

main();
