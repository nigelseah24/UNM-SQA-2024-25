const { By, until } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

// Test Case 8.3: Sorting by Number of Likes
async function verifySortByLikes(driver) {
  try {
    await driver.wait(until.elementLocated(By.css(".video-card")), 10000);

    // Selecting Likes from dropdown
    const sortDropdown = await driver.findElement(By.id("sort"));
    await sortDropdown.click();
    const likesOption = await driver.findElement(
      By.css('option[value="likeCount"]')
    );
    await likesOption.click();

    // Fetch likes of videos
    const videoElements = await driver.findElements(By.css(".video-card"));
    const likes = [];

    for (let video of videoElements) {
      const likesText = await video
        .findElement(By.css(".video-card p:nth-of-type(5)"))
        .getText();

      const likesCount = parseInt(
        likesText.split(":")[1].trim().replace(/,/g, "")
      ); // Get numeric part and remove commas
      likes.push(likesCount);
    }

    // Check if likes are sorted properly
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

    if (!isSorted) {
      throw new Error("Videos are not sorted by likes");
    }
  } catch (error) {
    console.error("verifySortByLikes failed:", error);
    throw error; // Re-throw to let Mocha handle the failure
  }
}

describe("Test case 8.3: Sorting by Number of Likes", function () {
  let driver;

  // Set Mocha timeout to 20 seconds to ensure the test has enough time to run
  this.timeout(20000);

  // Setup WebDriver before tests
  before(async () => {
    driver = await getDriver(); // Reuse shared WebDriver instance
  });

  // Test case: Verify Sorting by Likes
  it("should sort videos by likes in descending order", async () => {
    try {
      await navigateToApplication(driver);
      await verifySortByLikes(driver); // Call the function to verify sorting
    } catch (error) {
      console.error(error);
      throw error; // Ensure Mocha handles the failure
    }
  });
});
