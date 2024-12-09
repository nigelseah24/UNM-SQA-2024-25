const { Builder, By, until } = require("selenium-webdriver");

async function verifyKeywordListExists(driver) {
  try {
    const keywordButtons = await driver.wait(
      until.elementsLocated(By.css(".keyword-list button")),
      10000
    );

    if (keywordButtons.length > 0) {
      console.log("Test passed: Keyword list is displayed");
    } else {
      throw new Error("Test failed: No keyword list found");
    }
  } catch (error) {
    console.error("Keyword list existence test failed:", error);
    throw error;
  }
}

async function test5p1() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:3000");
    await verifyKeywordListExists(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

test5p1();
