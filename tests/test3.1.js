const { Builder, By, until, Key } = require("selenium-webdriver");
const axios = require("axios"); // Not needed if using in-browser

async function navigateToApplication(driver) {
    await driver.get("http://localhost:3000"); // Replace with your app's URL
}

async function verifyVideoThumbnailAndTitle(driver) {
    try {
        // Wait for the video cards to load
        let videoCards = await driver.wait(
            until.elementsLocated(By.css(".video-card")),
            10000 // Wait up to 10 seconds
        );
  
        // Iterate through each video card and verify thumbnail and title
        for (let i = 0; i < videoCards.length; i++) {
            let card = videoCards[i];
  
            // Check for thumbnail image
            let thumbnail = await card.findElement(By.css("img"));
            let thumbnailSrc = await thumbnail.getAttribute("src");
  
            if (!thumbnailSrc) {
                throw new Error(`Test failed: Video card ${i + 1} does not have a thumbnail image.`);
            }
  
            // Check for title
            let title = await card.findElement(By.css("h4"));
            let titleText = await title.getText();
  
            if (!titleText) {
                throw new Error(`Test failed: Video card ${i + 1} does not have a title.`);
            }
  
  
        }
  
        console.log("Test passed: All videos have thumbnails and titles.");
    } catch (error) {
        console.error("Test failed:", error);
        throw error;
    }
}

async function main() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
    await navigateToApplication(driver);

      // Requirement 3 (Yan chang)
    await verifyVideoThumbnailAndTitle(driver);
    } catch (error) {
    console.error(error);
    } finally {
    await driver.quit();
    }

    // Test logic here
}

main();