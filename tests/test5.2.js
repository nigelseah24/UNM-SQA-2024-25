const { Builder, By, until } = require("selenium-webdriver");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

// Test Case: Verify Keyword Selection and Deselection
async function verifyKeywordSelection(driver) {
  try {
    const initialVideoList = await driver.findElement(By.css("p.video-id-list"));
    const initialVideoListText = await initialVideoList.getText();

    const keywordButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'AI')]")
    );
    await keywordButton.click();
    console.log("Keyword 'AI' clicked.");

    await driver.sleep(2000);

    const deselectedVideoList = await driver.findElement(
      By.css("p.video-id-list")
    );
    const deselectedVideoListText = await deselectedVideoList.getText();

    if (initialVideoListText !== deselectedVideoListText) {
      console.log(
        "Test passed: Video collection updated upon keyword deselection"
      );
    } else {
      throw new Error(
        "Test failed: Video collection did not update upon keyword deselection"
      );
    }

    await keywordButton.click();
    console.log("Keyword 'AI' clicked again to reselect");

    await driver.sleep(2000);

    const selectedVideoList = await driver.findElement(By.css("p.video-id-list"));
    const selectedVideoListText = await selectedVideoList.getText();

    if (deselectedVideoListText !== selectedVideoListText) {
      console.log("Test passed: Video collection updated upon keyword selection");
    } else {
      throw new Error(
        "Test failed: Video collection did not update upon keyword selection"
      );
    }
  } catch (error) {
    console.error("verifyKeywordSelection failed:", error);
    throw error;
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await navigateToApplication(driver);
    await verifyKeywordSelection(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

main();
