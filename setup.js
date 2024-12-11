const { getDriver, quitDriver } = require("./driverManager");

// Global hooks
before(async () => {
  console.log("Setting up WebDriver...");
  await getDriver(); // Initializes the shared WebDriver instance
});

after(async () => {
  console.log("Cleaning up WebDriver...");
  await quitDriver(); // Quits the WebDriver instance after all tests
});
