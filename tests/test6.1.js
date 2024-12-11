const { By, until } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

// Test Case: Verify Predefined Keyword List Exists
async function verifyPreDefinedKeywordListExists(driver) {
  try {
    const keywordButtons = await driver.wait(
      until.elementsLocated(By.css(".keyword-list button")),
      10000
    );

    const predefinedKeywords = [
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

    const displayedKeywords = [];
    for (let button of keywordButtons) {
      const text = await button.getText();
      displayedKeywords.push(text);
    }

    if (
      !predefinedKeywords.every((keyword) =>
        displayedKeywords.includes(keyword)
      )
    ) {
      throw new Error(
        "Test case 6.1 failed: Not all predefined keywords are displayed"
      );
    }
  } catch (error) {
    console.error("verifyPreDefinedKeywordListExists failed:", error);
    throw error;
  }
}

describe("Test case 6.1: Verify Predefined Keyword List Exists", function () {
  let driver;

  // Set Mocha timeout to 20 seconds to avoid premature timeout errors
  this.timeout(20000);

  // Setup WebDriver before tests
  before(async () => {
    driver = await getDriver(); // Reuse shared WebDriver
  });

  // Test case: Verify Predefined Keyword List Exists
  it("should verify that all predefined keywords are displayed", async () => {
    try {
      await navigateToApplication(driver);
      await verifyPreDefinedKeywordListExists(driver); // Call the function to verify the keyword list
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
