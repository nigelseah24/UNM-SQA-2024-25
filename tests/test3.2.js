const { By, until } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

async function verifyVideoCardsCount(driver) {
  const videoCards = await driver.wait(
    until.elementsLocated(By.css(".video-card")),
    10000 // Wait up to 10 seconds
  );
  return videoCards;
}

async function verifyVideoPlayerVisibility(driver, videoCards) {
  const firstVideoCard = videoCards[0];
  await firstVideoCard.click();

  const videoPlayer = await driver.wait(
    until.elementLocated(By.css(".video-player")),
    10000 // Wait up to 10 seconds
  );

  if (!videoPlayer) {
    throw new Error("Video player is not visible");
  }

  return videoPlayer;
}

describe("Test case 3.2", () => {
  let driver;

  before(async () => {
    driver = await getDriver(); // Reuse shared driver
  });

  it("should verify video player visibility after clicking a video card", async () => {
    await navigateToApplication(driver);
    const videoCards = await verifyVideoCardsCount(driver);
    await verifyVideoPlayerVisibility(driver, videoCards);
  });
});
