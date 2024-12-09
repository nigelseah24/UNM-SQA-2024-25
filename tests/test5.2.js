const { Builder, By, until } = require("selenium-webdriver");

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

    const deSelectedVideoList = await driver.findElement(
      By.css("p.video-id-list")
    );
    const deSelectedVideoListText = await deSelectedVideoList.getText();

    if (initialVideoListText !== deSelectedVideoListText) {
      console.log(
        "Test passed: Video collection updated upon keyword deselection"
      );
    } else {
      throw new Error(
        "Test failed: Video collection did not update upon keyword deselection"
      );
    }

    await keywordButton.click();
    console.log("Keyword 'AI' clicked to reselect.");

    await driver.sleep(2000);

    const selectedVideoList = await driver.findElement(
      By.css("p.video-id-list")
    );
    const selectedVideoListText = await selectedVideoList.getText();

    if (deSelectedVideoListText !== selectedVideoListText) {
      console.log(
        "Test passed: Video collection updated upon keyword selection"
      );
    } else {
      throw new Error(
        "Test failed: Video collection did not update upon keyword selection"
      );
    }
  } catch (error) {
    console.error("Keyword selection test failed:", error);
    throw error;
  }
}

async function test5p2() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:3000");
    await verifyKeywordSelection(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

test5p2();
