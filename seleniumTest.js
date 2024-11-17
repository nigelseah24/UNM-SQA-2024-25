const { Builder, By, until, Key} = require("selenium-webdriver");

async function testYouTubeVideoCollectionApp() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navigate to your application
    await driver.get("http://localhost:3000"); // Replace with your app's URL

  
    //Requirement 1
    // Wait for the page to load and ensure that video cards are visible
    let videoCards = await driver.wait(
      until.elementsLocated(By.css(".video-card")),
      10000
    );



    //Requirement 2
    // Verify that there are 12 video cards displayed
    if (videoCards.length === 12) {
      console.log("Test passed: 12 video cards found");
    } else {
      console.log(
        "Test failed: Expected 12 video cards, found " + videoCards.length
      );
      return;
    }




    //Requirement 3
    // Click on the first video card to check if the video player is displayed
    let firstVideoCard = videoCards[0];
    await firstVideoCard.click();

    // Wait for the video player to be visible
    let videoPlayer = await driver.wait(
      until.elementLocated(By.css(".video-player")),
      10000
    );

    // Ensure that the video player has been clicked and is playing the video
    if (videoPlayer) {
      console.log("Test passed: Video player is visible");
    } else {
      console.log("Test failed: Video player not visible after click");
      return;
    }



    //Requirement 4

    //Get initial played seconds
    let playedTimeElement = await driver.wait(until.elementLocated(By.css(".played-seconds")), 10000);

    //Get initial played seconds
    let initialPlayedTime = await playedTimeElement.getText();
    initialPlayedTime = parseFloat(initialPlayedTime.replace("Played seconds: ", ""));
    console.log("Initial played seconds: ", initialPlayedTime);

    //Wait for 2 seconds to allow playback progress
    await driver.sleep(2000);

    //Get the updated played seconds
    let updatedPlayedTime = await playedTimeElement.getText();
    updatedPlayedTime = parseFloat(updatedPlayedTime.replace("Played seconds: ", ""));
    console.log("Updated played seconds: ", updatedPlayedTime);

    //Validate that playback progressed
    if (updatedPlayedTime > initialPlayedTime) {
      console.log("Test passed: Video is playing");
    } else {
      console.log("Test failed: Video is not playing");
    }

    //Verifying if forward and backward functionality work

    await videoPlayer.click(); // Ensure focus on the player

    // Simulate pressing the right arrow key to move forward
    await driver
    .actions()
    .sendKeys(Key.ARROW_RIGHT)
    .perform();

    // Wait briefly to allow the player to update the played time
    await driver.sleep(1000);

  // Get played time after moving forward
  let forwardPlayedTimeElement = await driver.wait(
  until.elementLocated(By.css(".played-seconds")),
  10000
  );
  let forwardPlayedTimeText = await forwardPlayedTimeElement.getText();
  let forwardPlayedTime = parseFloat(forwardPlayedTimeText.replace("Played seconds: ", ""));
  console.log("Forward played seconds: ", forwardPlayedTime);

  // Validate forward navigation
  if (forwardPlayedTime > updatedPlayedTime) {
  console.log("Test passed: Right arrow key moves video forward");
  } else {
  console.log("Test failed: Right arrow key did not move video forward");
  }

  // Simulate pressing the left arrow key to move backward
  await driver
  .actions()
  .sendKeys(Key.ARROW_LEFT)
  .perform();

  // Wait briefly to allow the player to update the played time
  await driver.sleep(1000);

  // Get played time after moving backward
  let backwardPlayedTimeElement = await driver.wait(
  until.elementLocated(By.css(".played-seconds")),
  10000
  );
  let backwardPlayedTimeText = await backwardPlayedTimeElement.getText();
  let backwardPlayedTime = parseFloat(backwardPlayedTimeText.replace("Played seconds: ", ""));
  console.log("Backward played seconds: ", backwardPlayedTime);

  // Validate backward navigation
  if (backwardPlayedTime < forwardPlayedTime && backwardPlayedTime >= 0) {
  console.log("Test passed: Left arrow key moves video backward");
  } else {
  console.log("Test failed: Left arrow key did not move video backward");
  }


    //Requirement 5
    //Check if keywords are displayed
    await driver.wait(until.elementsLocated(By.css(".keyword-list")), 15000);

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

    let allKeywordsPresent = initialKeywords.every((keyword) =>
      displayedKeywords.includes(keyword)
    );
    if (allKeywordsPresent) {
      console.log("Test passed: All initial keywords are displayed");
    } else {
      console.log("Test failed: Not all initial keywords are displayed");
      console.log(displayedKeywords);
    }

    //Testing if video list is updated after selecting keyword

    console.log("\nVerifying keyword updates...");

    let initialVideoCount = videoCards.length;

    let keywordButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'AI')]")
    );
    await keywordButton.click();
    console.log("Keyword 'AI' clicked.");

    await driver.sleep(2000);

    // Refresh videoCards after the DOM update
    videoCards = await driver.findElements(By.css(".video-card")); // Re-fetch video cards
    let updatedVideoCount = videoCards.length;    
    console.log("Updated video count after selecting 'AI':", updatedVideoCount);

    if (updatedVideoCount !== initialVideoCount) {
      console.log("Test passed: Video collection updated upon keyword selection");
    } else {
      console.log("Test failed: Video collection did not update upon keyword selection");
    }

    //Testing if video list is updated after deselecting keyword

    let revertedVideoCards = await driver.findElements(By.css(".video-card"));
    let revertedVideoCount = revertedVideoCards.length;
    console.log("Reverted video count after deselecting 'AI':", revertedVideoCount);

    if (revertedVideoCount === initialVideoCount) {
      console.log("Test passed: Video collection reverted upon keyword deselection");
    } else {
      console.log("Test failed: Video collection did not revert upon keyword deselection");
    }



  } catch (error) {
    console.log("An error occurred:", error);
  } finally {
    // Quit the browser after the test
    await driver.quit();
  }
}

testYouTubeVideoCollectionApp();
