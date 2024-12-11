const { By, until } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

// Keep the verifyKeywordListExists function as-is
async function verifyKeywordListExists(driver) {
  try {
    const keywordButtons = await driver.wait(
      until.elementsLocated(By.css(".keyword-list button")),
      10000 // Wait up to 10 seconds
    );

    if (keywordButtons.length > 0) {
      return;
    } else {
      throw new Error(
        "Test case 5.1 failed: Keyword list is empty or not rendered"
      );
    }
  } catch (error) {
    console.error("verifyKeywordListExists failed:", error);
    throw error;
  }
}

describe("Test case 5.1: Verify Keyword List Exists", function () {
  let driver;

  // Set Mocha timeout to 20 seconds to avoid premature timeout errors
  this.timeout(20000);

  // Setup WebDriver before tests
  before(async () => {
    driver = await getDriver(); // Reuse shared WebDriver
  });

  // Test case: Verify Keyword List Exists
  it("should verify keyword list exists and is populated", async () => {
    try {
      await navigateToApplication(driver);
      await verifyKeywordListExists(driver); // Call the function to verify the keyword list
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
