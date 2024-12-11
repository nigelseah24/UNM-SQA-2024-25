const { By, until } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");
const { parse } = require("date-fns");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

// Test Case 8.1: Sorting by Upload Date
async function verifySortByUploadDate(driver) {
  try {
    await driver.wait(until.elementLocated(By.css(".video-card")), 10000);

    // Selecting date uploaded
    const sortDropdown = await driver.findElement(By.id("sort"));
    await sortDropdown.click();
    const dateOption = await driver.findElement(
      By.css('option[value="publishedAt"]')
    );
    await dateOption.click();

    // Fetch published dates of videos
    const videoElements = await driver.findElements(By.css(".video-card"));
    const publishedDates = [];

    for (let video of videoElements) {
      const dateText = await video
        .findElement(By.css(".video-card p:nth-of-type(2)"))
        .getText();

      // Extract and parse the date using date-fns
      const match = dateText.match(/Published:\s*(\d{2}\/\d{2}\/\d{4})/);
      if (match && match[1]) {
        try {
          // Parse with explicit format DD/MM/YYYY
          const parsedDate = parse(match[1], "dd/MM/yyyy", new Date());
          publishedDates.push(parsedDate);
        } catch (error) {
          console.error("Failed to parse date:", match[1]);
        }
      } else {
        console.error("Unexpected date format:", dateText);
      }
    }

    // Checking if dates are sorted in descending order
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

    if (!isSorted) {
      throw new Error("Videos are not sorted by upload date");
    }
  } catch (error) {
    console.error("verifySortByUploadDate failed:", error);
    throw error; // Re-throw to let Mocha handle the failure
  }
}

describe("Test case 8.1: Sorting by Upload Date", function () {
  let driver;

  // Set Mocha timeout to 20 seconds to ensure the test has enough time to run
  this.timeout(20000);

  // Setup WebDriver before tests
  before(async () => {
    driver = await getDriver(); // Reuse shared WebDriver instance
  });

  // Test case: Verify Sorting by Upload Date
  it("should sort videos by upload date in descending order", async () => {
    try {
      await navigateToApplication(driver);
      await verifySortByUploadDate(driver); // Call the function to verify sorting
    } catch (error) {
      console.error(error);
      throw error; // Ensure Mocha handles the failure
    }
  });
});
