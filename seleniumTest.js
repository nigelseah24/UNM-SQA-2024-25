const { Builder, By, until, Key } = require("selenium-webdriver");
const axios = require("axios"); // Not needed if using in-browser

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

async function verifyDynamicCollectionExists(url, query) {
  try {
    const response = await axios.get(url, { params: { query } });

    // Check if the response contains the expected data
    if (response.status === 200 && response.data.items) {
      const items = response.data.items;

      if (items.length === 20) {
        console.log("Test passed: Dynamic Collection of 20 videos exists.");
      } else {
        console.error(
          `Collection size mismatch: Expected 20 videos, but found ${items.length}.`
        );
        throw new Error("Collection does not contain 20 videos.");
      }
    } else {
      console.error("Invalid response format or missing items array.");
      throw new Error("Failed to fetch valid data.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Re-throw the error for further handling
  }
}

async function verifyDynamicCollectionUpdateOnSearch(driver) {
  try {
    // Locate the search input field and search button
    const searchInput = await driver.wait(
      until.elementLocated(By.css(".add-keyword-form input")),
      10000
    );
    const searchButton = await driver.wait(
      until.elementLocated(By.css(".add-keyword-form button")),
      10000
    );

    // Define the search keyword and perform the search
    const searchKeyword = "Technology";
    await searchInput.clear();
    await searchInput.sendKeys(searchKeyword);
    await searchButton.click();
    console.log(`Search performed with keyword: "${searchKeyword}"`);

    // Wait for video cards to update based on the search keyword
    await driver.sleep(3000);

    // Fetch the displayed video titles
    const videoCards = await driver.wait(
      until.elementsLocated(By.css(".video-card")),
      10000
    );
    const displayedVideoTitles = [];
    for (let video of videoCards) {
      const titleElement = await video.findElement(By.css(".video-title"));
      const titleText = await titleElement.getText();
      displayedVideoTitles.push(titleText);
    }

    console.log("Displayed Video Titles:", displayedVideoTitles);

    // Check if the collection has items (not empty)
    if (displayedVideoTitles.length > 0) {
      console.log(
        `Test passed: Video collection updated with ${displayedVideoTitles.length} items`
      );
    } else {
      console.log("Test failed: Video collection did not update");
      throw new Error("No videos displayed for the search keyword");
    }
  } catch (error) {
    console.error("Dynamic collection update test failed:", error);
    throw error;
  }
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
    console.log("Test passed: Video player is visible after click");
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
    console.log("Test passed: Video collection updated upon keyword selection");
  } else {
    console.log(
      "Test failed: Video collection did not update upon keyword selection"
    );
  }
}

async function verifyKeywordAddition(driver) {
  //Locating input field for adding a new keyword
  let addKeywordInput = await driver.wait(
    until.elementLocated(By.css(".add-keyword-form input")),
    10000
  );

  //Locating button to add keyword
  let addKeywordButton = await driver.wait(
    until.elementLocated(By.css(".add-keyword-form button")),
    10000
  );

  //New keyword to add
  const newKeyword = "ChatGPT";

  //Adding new keyword
  await addKeywordInput.sendKeys(newKeyword);
  await addKeywordButton.click();

  await driver.sleep(2000);

  //Check if new keyword appears in keyword list
  let keywordButtons = await driver.wait(
    until.elementsLocated(By.css(".keyword-list button")),
    10000
  );

  let keywordTexts = [];
  for (let button of keywordButtons) {
    keywordTexts.push(await button.getText());
  }

  if (keywordTexts.includes(newKeyword)) {
    console.log(`Test passed: "${newKeyword}" added to keywords`);
  } else {
    console.log(`Test failed: "${newKeyword}" not found in keywords`);
    throw new Error(`Keyword "${newKeyword}" was not added successfully`);
  }
}

async function verifySortByAge(driver) {
  try {
    await driver.wait(until.elementLocated(By.css(".video-card")), 10000);

    //Selecting date uploaded
    const sortDropdown = await driver.findElement(By.id("sort"));
    await sortDropdown.click();
    const dateOption = await driver.findElement(
      By.css('option[value="publishedAt"]')
    );
    await dateOption.click();

    //Fetch published dates of videos
    const videoElements = await driver.findElements(By.css(".video-card"));
    const publishedDates = [];

    for (let video of videoElements) {
      const dateText = await video
        .findElement(By.css(".video-card p:nth-of-type(2)"))
        .getText();
      const parsedDate = new Date(dateText.split(":")[1].trim());
      publishedDates.push(parsedDate);
    }

    //Checking if dates sorted in descending order
    let isSorted = true;
    for (let i = 1; i < publishedDates.length; i++) {
      if (publishedDates[i - 1] < publishedDates[i]) {
        isSorted = false;
        console.error(
          `Sorting error: ${publishedDates[i - 1]} is before ${
            publishedDates[i]
          }`
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

async function verifySortByDuration(driver) {
  try {
    await driver.wait(until.elementLocated(By.css(".video-card")), 10000);

    //Selecting duration
    const sortDropdown = await driver.findElement(By.id("sort"));
    await sortDropdown.click();
    const durationOption = await driver.findElement(
      By.css('option[value="duration"]')
    );
    await durationOption.click();

    //Fetch durations of videos
    const videoElements = await driver.findElements(By.css(".video-card"));
    const durations = [];

    for (let video of videoElements) {
      const durationText = await video
        .findElement(By.css(".video-card p:nth-of-type(4)"))
        .getText();
      const durationParts = durationText.split(":")[1].trim().split(":");
      const totalSeconds =
        durationParts.length === 3
          ? parseInt(
              durationParts[0] * 3600 +
                parseInt(durationParts[1]) * 60 +
                parseInt(durationParts[2])
            )
          : parseInt(durationParts[0] * 60 + parseInt(durationParts[1])); //Handling MM:SS format
    }

    //console.log(durations);

    //Check if sorted properly
    let isSorted = true;
    for (let i = 1; i < durations.length; i++) {
      if (durations[i - 1] < durations[i]) {
        isSorted = false;
        console.error(
          `Sorting error: ${durations[i - 1]} is less than ${durations[i]}`
        );
        break;
      }
    }

    if (isSorted) {
      console.log("Test passed: Videos are sorted by duration");
    } else {
      console.log("Test failed: Videos are not sorted by duration");
    }
  } catch (error) {
    console.error("verifysortByDuration failed:", error);
    throw error;
  }
}

async function verifySortByLikes(driver) {
  try {
    await driver.wait(until.elementLocated(By.css(".video-card")), 10000);

    //Selecting Likes from dropdown
    const sortDropdown = await driver.findElement(By.id("sort"));
    await sortDropdown.click();
    const likesOption = await driver.findElement(
      By.css('option[value="likeCount"]')
    );
    await likesOption.click();

    //Fetch likes of videos
    const videoElements = await driver.findElements(By.css(".video-card"));
    const likes = [];

    for (let video of videoElements) {
      const likesText = await video
        .findElement(By.css(".video-card p:nth-of-type(5)"))
        .getText();

      const likesCount = parseInt(
        likesText.split(":")[1].trim().replace(/,/g, "")
      ); //Get numeric part and remove commas
      //console.log(likesCount);
      likes.push(likesCount);
    }

    //Check if likes are sorted properly
    let isSorted = true;
    for (let i = 1; i < likes.length; i++) {
      if (likes[i - 1] < likes[i]) {
        isSorted = false;
        console.error(
          `Sorting error: ${likes[i - 1]} is less than ${likes[i]}`
        );
        break;
      }
    }

    if (isSorted) {
      console.log("Test passed: Videos are sorted by likes");
    } else {
      console.log("Test failed: Videos are not sorted by likes");
    }
  } catch (error) {
    console.error("verifySortByLikes failed: ", error);
    throw error;
  }
}

async function verifyYouTubePlayerPlayPause(driver) {
  try {
    // Wait for the iframe containing the YouTube player
    const iframe = await driver.wait(
      until.elementLocated(By.css("iframe")),
      10000
    );
    console.log("YouTube iframe located");

    // Switch context to the iframe
    await driver.switchTo().frame(iframe);

    // Locate the play button in the YouTube player
    const playButton = await driver.wait(
      until.elementLocated(By.css("button.ytp-play-button")), // YouTube play button selector
      5000
    );

    // Allow playback to proceed
    await driver.sleep(3000);

    // Verify playback by checking if the player shows a "Pause" state
    const isPlaying = await playButton.getAttribute("data-title-no-tooltip");
    if (isPlaying.includes("Pause")) {
      console.log("Test passed: Video is playing in YouTube player");
    } else {
      throw new Error("Test failed: Video did not start playing");
    }

    // Click Pause Button
    await playButton.click();
    console.log("Clicked Pause button in YouTube player");

    // Verify paused state
    const isPaused = await playButton.getAttribute("data-title-no-tooltip");
    if (isPaused.includes("Play")) {
      console.log("Test passed: Video is paused in YouTube player");
    } else {
      throw new Error("Test failed: Video did not pause");
    }

    // Switch back to the main application context
    await driver.switchTo().defaultContent();
  } catch (error) {
    console.error("YouTube player Play/Pause test failed:", error);
    throw error;
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();
  let keywords =
    "Workflow+Code+Assistant+AI+Software+Development+Debugging+Testing+Documentation+Learning+Tools+Automation";

  try {
    await navigateToApplication(driver);

    // Requirement 1
    await verifyDynamicCollectionExists(
      "http://localhost:8000/get_videos",
      keywords
    );
    await verifyDynamicCollectionUpdateOnSearch(driver);

    // Requirement 2
    let videoCards = await verifyVideoCardsCount(driver);

    // Requirement 3 (Part 1)

    // Requirement 3 (Part 2)
    let videoPlayer = await verifyVideoPlayerVisibility(driver, videoCards);

    // Requirement 4
    await verifyYouTubePlayerPlayPause(driver);
    let { updatedPlayedTime } = await verifyVideoPlayback(driver);
    await verifyPlaybackControls(driver, videoPlayer, updatedPlayedTime);

    // Requirement 5 (Part 1) & Requirement 6
    await verifyKeywordDisplay(driver);

    // Requirement 5 (Part 2)
    await verifyKeywordSelection(driver, videoCards);

    // Requirement 7
    //await verifyKeywordAddition(driver);

    // Requirement 8
    await verifySortByAge(driver);
    await verifySortByDuration(driver);
    await verifySortByLikes(driver);
  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await driver.quit();
  }
}

main();
