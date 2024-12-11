const { By } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

// Test Case: Verify Keyword Selection and Deselection
async function verifyKeywordSelection(driver) {
  try {
    const initialVideoList = await driver.findElement(
      By.css("p.video-id-list")
    );
    const initialVideoListText = await initialVideoList.getText();

    const keywordButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'AI')]")
    );
    await keywordButton.click();

    await driver.sleep(2000);

    const deselectedVideoList = await driver.findElement(
      By.css("p.video-id-list")
    );
    const deselectedVideoListText = await deselectedVideoList.getText();

    if (initialVideoListText == deselectedVideoListText) {
      throw new Error(
        "Test case 5.2 failed: Video collection did not update upon keyword deselection"
      );
    }

    await driver.sleep(2000);

    // Click again to select the keyword
    await keywordButton.click();
    await driver.sleep(2000);
    await keywordButton.click();
    await driver.sleep(2000);
    await keywordButton.click();

    await driver.sleep(2000);

    const selectedVideoList = await driver.findElement(
      By.css("p.video-id-list")
    );
    const selectedVideoListText = await selectedVideoList.getText();

    if (deselectedVideoListText == selectedVideoListText) {
      throw new Error(
        "Test case 5.3 failed: Video collection did not update upon keyword selection"
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

describe("Test case 5.2 & 5.3: Verify Keyword Selection and Deselection", function () {
  let driver;

  // Set Mocha timeout to 20 seconds to avoid premature timeout errors
  this.timeout(20000);

  // Setup WebDriver before tests
  before(async () => {
    driver = await getDriver(); // Reuse shared WebDriver
  });

  // Test case: Verify Keyword Selection and Deselection
  it("should verify keyword selection and deselection updates video collection", async () => {
    try {
      await navigateToApplication(driver);
      await verifyKeywordSelection(driver); // Call the function to verify keyword selection
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
