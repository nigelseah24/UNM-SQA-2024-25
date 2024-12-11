const { By, until } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

async function verifyVideoCardsCount(driver) {
  const videoCards = await driver.wait(
    until.elementsLocated(By.css(".video-card")),
    10000
  );

  if (videoCards.length !== 12) {
    throw new Error("Incorrect number of video cards displayed");
  }
}

describe("Test case 2.1", () => {
  let driver;

  before(async () => {
    driver = await getDriver(); // Reuse shared driver
  });

  it("should verify video cards count", async () => {
    await navigateToApplication(driver);
    await verifyVideoCardsCount(driver);
  });
});
