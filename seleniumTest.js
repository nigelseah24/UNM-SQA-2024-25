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
  let initialVideoList = await driver.findElement(By.css("p.video-id-list"));
  let initialVideoListText = await initialVideoList.getText();

  let keywordButton = await driver.findElement(
    By.xpath("//button[contains(text(), 'AI')]")
  );
  await keywordButton.click();
  console.log("Keyword 'AI' clicked.");

  await driver.sleep(2000);

  let deSelectedVideoList = await driver.findElement(By.css("p.video-id-list"));
  let deSelectedVideoListText = await deSelectedVideoList.getText();

  videoCards = await driver.findElements(By.css(".video-card"));

  if (initialVideoListText !== deSelectedVideoListText) {
    console.log(
      "Test passed: Video collection updated upon keyword deselection"
    );
  } else {
    console.log(
      "Test failed: Video collection did not update upon keyword deselection"
    );
    throw new Error("Keyword deselection did not update videos");
  }

  await keywordButton.click();
  console.log("AI button clicked to reselect");

  await driver.sleep(2000);

  let selectedVideoList = await driver.findElement(By.css("p.video-id-list"));
  let selectedVideoListText = await selectedVideoList.getText();
  //console.log("initialVideoListText:", initialVideoListText);
  //console.log("deSelectedVideoListText: ", deSelectedVideoListText);
  //console.log("selectedVideoListText: ", selectedVideoListText);

  if (deSelectedVideoListText !== selectedVideoListText) {
    console.log(
      "Test passed: Video collection updated upon keyword selection"
    );
  } else {
    console.log(
      "Test failed: Video collection did not update upon keyword selection"
    );
  }
}

async function verifyKeywordAddition(driver){
  //Locating input field for adding a new keyword
  let addKeywordInput = await driver.wait(until.elementLocated(By.css(".add-keyword-form input")), 10000);

  //Locating button to add keyword
  let addKeywordButton = await driver.wait(until.elementLocated(By.css(".add-keyword-form button")), 10000);

  //New keyword to add
  const newKeyword = "ChatGPT";

  //Adding new keyword
  await addKeywordInput.sendKeys(newKeyword);
  await addKeywordButton.click();

  await driver.sleep(2000);

  //Check if new keyword appears in keyword list
  let keywordButtons = await driver.wait(until.elementsLocated(By.css(".keyword-list button")), 10000);

  let keywordTexts = [];
  for (let button of keywordButtons) {
    keywordTexts.push(await button.getText());
  }

  if (keywordTexts.includes(newKeyword)) {
    console.log(`Test passed: "${newKeyword}" added to keywords`);
  } else {
    console.log(`Test failed: "${newKeyword}" not found in keywords`);
    throw new Error (`Keyword "${newKeyword}" was not added successfully`);
  }
}

async function verifySortByAge(driver){

  try {

  await driver.wait(until.elementLocated(By.css(".video-card")), 10000);

  //Selecting date uploaded
  const sortDropdown = await driver.findElement(By.id("sort"));
  await sortDropdown.click();
  const dateOption = await driver.findElement(By.css('option[value="publishedAt"]'));
  await dateOption.click();

  //Fetch published dates of videos
  const videoElements = await driver.findElements(By.css(".video-card"));
  const publishedDates = [];

  for (let video of videoElements) {
    const dateText = await video.findElement(By.css(".video-card p:nth-of-type(2)")).getText();
    const parsedDate = new Date(dateText.split(":")[1].trim());
    publishedDates.push(parsedDate);
  }

  //Checking if dates sorted in descending order
  let isSorted = true;
  for (let i = 1; i < publishedDates.length; i++) {
    if (publishedDates[i-1] < publishedDates[i]){
      isSorted = false;
      console.error(`Sorting error: ${publishedDates[i-1]} is before ${publishedDates[i]}`
      );
      break;
    }
  }

  if (isSorted) {
    console.log("Test passed: Videos are sorted by upload date");
    //console.log(publishedDates);
  } else {
    console.log("Test failed: Videos are not sorted by upload date");
  }

} catch (error) {
  console.log("verifySortByAge failed:", error);
  throw error;
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
    //await verifyKeywordAddition(driver);
    await verifySortByAge(driver);
  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await driver.quit();
  }
}

main();
