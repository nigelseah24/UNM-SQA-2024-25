// const { Builder, By, until } = require("selenium-webdriver");

// async function navigateToApplication(driver) {
//   await driver.get("http://localhost:3000"); // Replace with your app's URL
// }

// // Test Case 8.1: Sorting by Upload Date
// async function verifySortByUploadDate(driver) {
//   try {
//     await driver.wait(until.elementLocated(By.css(".video-card")), 10000);

//     //Selecting date uploaded
//     const sortDropdown = await driver.findElement(By.id("sort"));
//     await sortDropdown.click();
//     const dateOption = await driver.findElement(
//       By.css('option[value="publishedAt"]')
//     );
//     await dateOption.click();

//     //Fetch published dates of videos
//     const videoElements = await driver.findElements(By.css(".video-card"));
//     const publishedDates = [];

//     for (let video of videoElements) {
//       const dateText = await video
//         .findElement(By.css(".video-card p:nth-of-type(2)"))
//         .getText();
//       const parsedDate = new Date(dateText.split(":")[1].trim());
//       publishedDates.push(parsedDate);
//     }

//     //Checking if dates sorted in descending order
//     let isSorted = true;
//     for (let i = 1; i < publishedDates.length; i++) {
//       if (publishedDates[i - 1] < publishedDates[i]) {
//         isSorted = false;
//         console.error(
//           `Sorting error: ${publishedDates[i - 1]} is before ${
//             publishedDates[i]
//           }`
//         );
//         break;
//       }
//     }

//     if (isSorted) {
//       console.log("Test case 8.1 passed: Videos are sorted by upload date");
//     } else {
//       console.log("Test case 8.1 failed: Videos are not sorted by upload date");
//     }
//   } catch (error) {
//     console.log("verifySortByUploadDate failed:", error);
//     throw error;
//   }
// }

// async function main() {
//   let driver = await new Builder().forBrowser("chrome").build();
//   try {
//     await navigateToApplication(driver);
//     await verifySortByUploadDate(driver);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await driver.quit();
//   }
// }

// main();