const { Builder, By, until } = require("selenium-webdriver");

async function verifyPreDefinedKeywordListExists(driver) {
  try {
    const keywordButtons = await driver.wait(
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

    const displayedKeywords = [];
    for (const button of keywordButtons) {
      const text = await button.getText();
      displayedKeywords.push(text);
    }

    if (
      initialKeywords.every((keyword) => displayedKeywords.includes(keyword))
    ) {
      console.log("Test passed: All predefined keywords are displayed");
    } else {
      console.log("Test failed: Not all predefined keywords are displayed");
      console.log("Displayed Keywords:", displayedKeywords);
      console.log("Expected Keywords:", initialKeywords);
      throw new Error("Keyword list mismatch");
    }
  } catch (error) {
    console.error("Predefined keyword list test failed:", error);
    throw error;
  }
}

async function test6() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:3000");
    await verifyPreDefinedKeywordListExists(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

test6();
