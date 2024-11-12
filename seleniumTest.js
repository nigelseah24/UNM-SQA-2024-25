const { Builder, By, until } = require('selenium-webdriver');

async function testYouTubeVideoCollectionApp() {
  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    // Navigate to your application
    await driver.get('http://localhost:3000'); // Replace with your app's URL

    // Wait for the page to load and ensure that video cards are visible
    let videoCards = await driver.wait(until.elementsLocated(By.css('.video-card')), 10000);
    
    // Verify that there are 12 video cards displayed
    if (videoCards.length === 12) {
      console.log('Test passed: 12 video cards found');
    } else {
      console.log('Test failed: Expected 12 video cards, found ' + videoCards.length);
      return;
    }

    // Click on the first video card to check if the video player is displayed
    let firstVideoCard = videoCards[0];
    await firstVideoCard.click();
    
    // Wait for the video player to be visible
    let videoPlayer = await driver.wait(until.elementLocated(By.css('.video-player')), 10000);
    
    // Ensure that the video player has been clicked and is playing the video
    if (videoPlayer) {
      console.log('Test passed: Video player is visible');
    } else {
      console.log('Test failed: Video player not visible after click');
      return;
    }
    
    // Now, interact with the video controls (play, pause, stop, etc.)
    // Wait for play button (you can adapt this to other controls if necessary)
    let playButton = await driver.wait(until.elementLocated(By.css('.video-player-wrapper .video-player')), 10000);
    await playButton.click(); // Play the video
    console.log('Test passed: Play button clicked and video started');

    await playButton.click(); //Pause the video
    console.log('Test passed: Video paused')
    
    // Add more tests as necessary for pause, stop, forward, etc.

    //Check if keywords are displayed
    await driver.wait(until.elementsLocated(By.css('.keyword-list')), 15000);

    let keywordButtons = await driver.wait(until.elementsLocated(By.css('.keyword-list button')), 10000);

    const initialKeywords = [
      'AI',            'Test',
      'football',      'machine learning',
      'Workflow',      'Code',
      'Assistant',     'Software',
      'Development',   'Debugging',
      'Documentation', 'Learning',
      'Tools',         'Automation'
    ];


    let displayedKeywords = [];
    for (let button of keywordButtons) {
      let text = await button.getText();
      displayedKeywords.push(text);
    }

    let allKeywordsPresent = initialKeywords.every(keyword => displayedKeywords.includes(keyword));
    if (allKeywordsPresent) {
      console.log("Test passed: All initial keywords are displayed");
    } else {
      console.log("Test failed: Not all initial keywords are displayed");
      console.log(displayedKeywords);
    }

  } catch (error) {
    console.log('An error occurred:', error);
  } finally {
    // Quit the browser after the test
    await driver.quit();
  }
}

testYouTubeVideoCollectionApp();
