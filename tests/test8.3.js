const { Builder, By, until } = require("selenium-webdriver");

async function navigateToApplication(driver) {
  await driver.get("http://localhost:3000"); // Replace with your app's URL
}

// Test Case 8.3: Sorting by Number of Likes
async function verifySortByLikes(driver) {
  try {
    await driver.wait(until.elementLocated(By.css(".video-card")), 10000);

    //Selecting Likes from dropdown
    const sortDropdown = await driver.findElement(By.id("sort"));
    await sortDropdown.click();
    const likesOption = await driver.findElement(
      By.css('option[value="likeCount"]')
    );
    await likesOption.click();

    //Fetch likes of videos
    const videoElements = await driver.findElements(By.css(".video-card"));
    const likes = [];

    for (let video of videoElements) {
      const likesText = await video
        .findElement(By.css(".video-card p:nth-of-type(5)"))
        .getText();

      const likesCount = parseInt(
        likesText.split(":")[1].trim().replace(/,/g, "")
      ); //Get numeric part and remove commas
      //console.log(likesCount);
      likes.push(likesCount);
    }

    //Check if likes are sorted properly
    let isSorted = true;
    for (let i = 1; i < likes.length; i++) {
      if (likes[i - 1] < likes[i]) {
        isSorted = false;
        console.error(
          `Sorting error: ${likes[i - 1]} is less than ${likes[i]}`
        );
        break;
      }
    }

    if (isSorted) {
      console.log("Test case 8.3 passed: Videos are sorted by likes");
    } else {
      console.log("Test case 8.3 failed: Videos are not sorted by likes");
    }
  } catch (error) {
    console.error("verifySortByLikes failed: ", error);
    throw error;
  }
}

async function main() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await navigateToApplication(driver);
    await verifySortByLikes(driver);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}

main();
