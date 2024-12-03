const { Builder, By, until, Key } = require("selenium-webdriver");
const axios = require("axios"); // Not needed if using in-browser

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

// Requirement 1
async function verifyDynamicCollectionExists(url, query) {
  try {
    const response = await axios.get(url, { params: { query } });

    // Check if the response contains the expected data
    if (response.status === 200 && response.data.items) {
      const items = response.data.items;

      if (items.length === 20) {
        console.log("Test passed: Dynamic Collection of 20 videos exists.");
      } else {
        console.error(
          `Collection size mismatch: Expected 20 videos, but found ${items.length}.`
        );
        throw new Error("Collection does not contain 20 videos.");
      }
    } else {
      console.error("Invalid response format or missing items array.");
      throw new Error("Failed to fetch valid data.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Re-throw the error for further handling
  }
}

async function test1() {
  let driver = await new Builder().forBrowser("chrome").build();
  let keywords =
    "Workflow+Code+Assistant+AI+Software+Development+Debugging+Testing+Documentation+Learning+Tools+Automation";
  try {
    await navigateToApplication(driver);
    // Requirement 1 (Yan chang)
    await verifyDynamicCollectionExists(
      "http://localhost:8000/get_videos",
      keywords
    );
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }

  // Test logic here
}

test1();
