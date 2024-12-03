const { Builder, By, until } = require("selenium-webdriver");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

// Test Case 7.1: Keyword Creation
async function verifyKeywordAddition(driver) {
  //Locating input field for adding a new keyword
  let addKeywordInput = await driver.wait(
    until.elementLocated(By.css(".add-keyword-form input")),
    10000
  );

  //Locating button to add keyword
  let addKeywordButton = await driver.wait(
    until.elementLocated(By.css(".add-keyword-form button")),
    10000
  );

  //New keyword to add
  const newKeyword = "ChatGPT";

  //Adding new keyword
  await addKeywordInput.sendKeys(newKeyword);
  await addKeywordButton.click();

  await driver.sleep(2000);

  //Check if new keyword appears in keyword list
  let keywordButtons = await driver.wait(
    until.elementsLocated(By.css(".keyword-list button")),
    10000
  );

  let keywordTexts = [];
  for (let button of keywordButtons) {
    keywordTexts.push(await button.getText());
  }

  if (keywordTexts.includes(newKeyword)) {
    console.log(`Test case 7.1 passed: "${newKeyword}" added to keywords`);
  } else {
    console.log(`Test case 7.1 failed: "${newKeyword}" not found in keywords`);
    throw new Error(`Keyword "${newKeyword}" was not added successfully`);
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await navigateToApplication(driver);
    await verifyKeywordAddition(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

main();
