const { Builder, By, until } = require("selenium-webdriver");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
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
      predefinedKeywords.every((keyword) => displayedKeywords.includes(keyword))
    ) {
      console.log("Test passed: All predefined keywords are displayed");
    } else {
      throw new Error(
        "Test failed: Not all predefined keywords are displayed"
      );
    }
  } catch (error) {
    console.error("verifyPreDefinedKeywordListExists failed:", error);
    throw error;
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await navigateToApplication(driver);
    await verifyPreDefinedKeywordListExists(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

main();
