const axios = require("axios");
const { getDriver } = require("../driverManager");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000");
}

// Requirement 1
async function verifyDynamicCollectionExists(url, query) {
  try {
    const response = await axios.get(url, { params: { query } });

    // Check if the response contains the expected data
    if (response.status === 200 && response.data.items) {
      const items = response.data.items;

      if (items.length === 20) {
        return;
      } else {
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

describe("Test case 1.1", () => {
  let driver;

  before(async () => {
    driver = await getDriver(); // Initialize shared driver
  });

  it("should verify dynamic collection exists", async () => {
    await navigateToApplication(driver);
    await verifyDynamicCollectionExists(
      "http://localhost:8000/get_videos",
      "Assistant+Code+Workflow+AI+Software+Development+Debugging+Testing+Documentation+Learning+Tools+Automation"
    );
  });
});
