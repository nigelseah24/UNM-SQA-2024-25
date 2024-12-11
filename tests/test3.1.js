const { By, until } = require("selenium-webdriver");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

async function verifyVideoThumbnailsAndTitles(driver) {
  const videoCards = await driver.wait(
    until.elementsLocated(By.css(".video-card")),
    10000 // Wait up to 10 seconds
  );

  for (let i = 0; i < videoCards.length; i++) {
    const card = videoCards[i];

    // Check for thumbnail image
    const thumbnail = await card.findElement(By.css("img"));
    const thumbnailSrc = await thumbnail.getAttribute("src");

    if (!thumbnailSrc) {
      throw new Error(
        `Video card ${i + 1} does not have a valid thumbnail image.`
      );
    }

    // Check for title
    const title = await card.findElement(By.css("h4"));
    const titleText = await title.getText();

    if (!titleText) {
      throw new Error(`Video card ${i + 1} does not have a valid title.`);
    }
  }

  // console.log("Test case 3.1 passed: All videos have thumbnails and titles.");
}

describe("Test case 3.1", () => {
  let driver;

  before(async () => {
    driver = await getDriver(); // Reuse shared driver
  });

  it("should verify that all videos have thumbnails and titles", async () => {
    await navigateToApplication(driver);
    await verifyVideoThumbnailsAndTitles(driver);
  });
});
