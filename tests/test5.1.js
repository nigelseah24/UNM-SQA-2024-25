const { Builder, By, until } = require("selenium-webdriver");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

// Test Case: Verify Keyword List Exists
async function verifyKeywordListExists(driver) {
  try {
    const keywordButtons = await driver.wait(
      until.elementsLocated(By.css(".keyword-list button")),
      10000
    );

    if (keywordButtons.length > 0) {
      console.log("Test passed: Keyword list exists and is populated");
    } else {
      throw new Error("Test failed: Keyword list is empty or not rendered");
    }
  } catch (error) {
    console.error("verifyKeywordListExists failed:", error);
    throw error;
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await navigateToApplication(driver);
    await verifyKeywordListExists(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

main();
