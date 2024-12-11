const { By, until } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

// Test Case 7.1: Keyword Creation
async function verifyKeywordAddition(driver) {
  try {
    // Locating input field for adding a new keyword
    let addKeywordInput = await driver.wait(
      until.elementLocated(By.css(".add-keyword-form input")),
      10000
    );

    // Locating button to add keyword
    let addKeywordButton = await driver.wait(
      until.elementLocated(By.css(".add-keyword-form button")),
      10000
    );

    // New keyword to add
    const newKeyword = "ChatGPT";

    // Adding new keyword
    await addKeywordInput.sendKeys(newKeyword);
    await addKeywordButton.click();

    await driver.sleep(2000); // Sleep to allow UI to update

    // Check if new keyword appears in the keyword list
    let keywordButtons = await driver.wait(
      until.elementsLocated(By.css(".keyword-list button")),
      10000
    );

    let keywordTexts = [];
    for (let button of keywordButtons) {
      keywordTexts.push(await button.getText());
    }

    if (!keywordTexts.includes(newKeyword)) {
      throw new Error(`Keyword "${newKeyword}" was not added successfully`);
    }
  } catch (error) {
    console.error("Error during keyword addition:", error.message);
    throw error; // Re-throw the error to make Mocha handle it
  }
}

describe("Test case 7.1: Keyword Creation", function () {
  let driver;

  // Set Mocha timeout to 20 seconds to allow time for operations to complete
  this.timeout(20000);

  // Setup WebDriver before tests
  before(async () => {
    driver = await getDriver(); // Reuse shared WebDriver instance
  });

  // Test case: Verify Keyword Addition
  it("should add a new keyword and verify its presence in the keyword list", async () => {
    try {
      await navigateToApplication(driver);
      await verifyKeywordAddition(driver); // Call the function to verify the keyword addition
    } catch (error) {
      console.error(error);
      throw error; // Ensure the test fails if there is an error
    }
  });
});
