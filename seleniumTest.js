const { Builder, By, until, Key } = require("selenium-webdriver");
const axios = require("axios"); // Not needed if using in-browser

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

// Requirement 1
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

async function verifyVideoThumbnailAndTitle(driver) {
  try {
      // Wait for the video cards to load
      let videoCards = await driver.wait(
          until.elementsLocated(By.css(".video-card")),
          10000 // Wait up to 10 seconds
      );

      // Iterate through each video card and verify thumbnail and title
      for (let i = 0; i < videoCards.length; i++) {
          let card = videoCards[i];

          // Check for thumbnail image
          let thumbnail = await card.findElement(By.css("img"));
          let thumbnailSrc = await thumbnail.getAttribute("src");

          if (!thumbnailSrc) {
              throw new Error(`Test failed: Video card ${i + 1} does not have a thumbnail image.`);
          }

          // Check for title
          let title = await card.findElement(By.css("h4"));
          let titleText = await title.getText();

          if (!titleText) {
              throw new Error(`Test failed: Video card ${i + 1} does not have a title.`);
          }


      }

      console.log("Test passed: All videos have thumbnails and titles.");
  } catch (error) {
      console.error("Test failed:", error);
      throw error;
  }
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

async function verifyKeywordListExists(driver) {
  let keywordButtons = await driver.wait(
    until.elementsLocated(By.css(".keyword-list button")),
    10000
  );

  let displayedKeywords = [];
  for (let button of keywordButtons) {
    let text = await button.getText();
    displayedKeywords.push(text);
  }

  if (displayedKeywords) {
    console.log("Test passed: There is a keyword list which is displayed");
  } else {
    console.log("Test failed: Not all initial keywords are displayed");
    console.log(displayedKeywords);
    throw new Error("Keyword display mismatch");
  }
}

async function verifyPreDefinedKeywordListExists(driver) {
  let keywordButtons = await driver.wait(
    until.elementsLocated(By.css(".keyword-list button")),
    10000
  );

  const preDefinedKeywords = [
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

  if (
    preDefinedKeywords.every((keyword) => displayedKeywords.includes(keyword))
  ) {
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

  await driver.sleep(2000);

  let deSelectedVideoList = await driver.findElement(By.css("p.video-id-list"));
  let deSelectedVideoListText = await deSelectedVideoList.getText();

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

  await driver.sleep(2000);

  let selectedVideoList = await driver.findElement(By.css("p.video-id-list"));
  let selectedVideoListText = await selectedVideoList.getText();

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

async function verifySortByUploadDate(driver) {
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

    // Select "Duration" in the sort dropdown
    const sortDropdown = await driver.findElement(By.id("sort"));
    await sortDropdown.click();
    const durationOption = await driver.findElement(
      By.css('option[value="duration"]')
    );
    await durationOption.click();

    // Fetch durations of videos
    const videoElements = await driver.findElements(By.css(".video-card"));
    const durations = [];

    for (let video of videoElements) {
      const durationText = await video
        .findElement(By.css(".video-card p:nth-of-type(4)"))
        .getText();

      // Clean the text by removing the "Duration:" label
      const cleanDurationText = durationText.replace("Duration:", "").trim();

      // Split the duration and calculate total seconds
      const durationParts = cleanDurationText
        .split(":")
        .map((part) => parseInt(part, 10));
      let totalSeconds = 0;

      if (durationParts.length === 3) {
        // HH:MM:SS format
        totalSeconds =
          durationParts[0] * 3600 +
          durationParts[1] * 60 +
          durationParts[2];
      } else if (durationParts.length === 2) {
        // MM:SS format
        totalSeconds =
          durationParts[0] * 60 +
          durationParts[1];
      } else {
        throw new Error(`Invalid duration format: ${durationText}`);
      }

      durations.push(totalSeconds);
    }

    console.log("Durations in seconds: ", durations);

    // Check if sorted in descending order
    let isSorted = true;
    for (let i = 1; i < durations.length; i++) {
      if (durations[i - 1] < durations[i]) {
        isSorted = false;
        console.error(
          `Sorting error: ${durations[i - 1]} (index ${i - 1}) is less than ${durations[i]} (index ${i})`
        );
        break;
      }
    }

    if (isSorted) {
      console.log("Test passed: Videos are sorted by duration.");
    } else {
      console.log("Test failed: Videos are not sorted by duration.");
    }
  } catch (error) {
    console.error("verifySortByDuration failed:", error);
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

    // Requirement 1 (Yan chang)
    await verifyDynamicCollectionExists(
      "http://localhost:8000/get_videos",
      keywords
    );

    // Requirement 2 (Yan chang)
    let videoCards = await verifyVideoCardsCount(driver);

    // Requirement 3 (Part 1) (Yan chang)

    await verifyVideoThumbnailAndTitle(driver);
    

    // Requirement 3 (Part 2) (Yan chang)
    let videoPlayer = await verifyVideoPlayerVisibility(driver, videoCards);

    // Requirement 4 (Armaan)
    await verifyYouTubePlayerPlayPause(driver);
    let { updatedPlayedTime } = await verifyVideoPlayback(driver);
    await verifyPlaybackControls(driver, videoPlayer, updatedPlayedTime);

    // Requirement 5 (Part 1) (Armaan)
    await verifyKeywordListExists(driver);

    // Requirement 5 (Part 2) (Armaan)
    await verifyKeywordSelection(driver, videoCards); // This function has 2 test cases

    // Requirement 6 (Armaan)
    await verifyPreDefinedKeywordListExists(driver);

    // Requirement 7 (Nigel)
    // await verifyKeywordAddition(driver);

    // Requirement 8 (Nigel)
    await verifySortByUploadDate(driver);
    await verifySortByDuration(driver);
    await verifySortByLikes(driver);
  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await driver.quit();
  }
}

main();
