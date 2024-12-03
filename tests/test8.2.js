const { Builder, By, until } = require("selenium-webdriver");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

// Test Case 8.2: Sorting by Duration
async function verifySortByDuration(driver) {
  try {
    await driver.wait(until.elementLocated(By.css(".video-card")), 10000);

    //Selecting duration
    const sortDropdown = await driver.findElement(By.id("sort"));
    await sortDropdown.click();
    const durationOption = await driver.findElement(
      By.css('option[value="duration"]')
    );
    await durationOption.click();

    //Fetch durations of videos
    const videoElements = await driver.findElements(By.css(".video-card"));
    const durations = [];

    for (let video of videoElements) {
      const durationText = await video
        .findElement(By.css(".video-card p:nth-of-type(4)"))
        .getText();
      const durationParts = durationText.split(":")[1].trim().split(":");
      const totalSeconds =
        durationParts.length === 3
          ? parseInt(
              durationParts[0] * 3600 +
                parseInt(durationParts[1]) * 60 +
                parseInt(durationParts[2])
            )
          : parseInt(durationParts[0] * 60 + parseInt(durationParts[1])); //Handling MM:SS format
    }

    //Check if sorted properly
    let isSorted = true;
    for (let i = 1; i < durations.length; i++) {
      if (durations[i - 1] < durations[i]) {
        isSorted = false;
        console.error(
          `Sorting error: ${durations[i - 1]} is less than ${durations[i]}`
        );
        break;
      }
    }

    if (isSorted) {
      console.log("Test case 8.2 passed: Videos are sorted by duration");
    } else {
      console.log("Test case 8.2 failed: Videos are not sorted by duration");
    }
  } catch (error) {
    console.error("verifysortByDuration failed:", error);
    throw error;
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await navigateToApplication(driver);
    await verifySortByDuration(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

main();
