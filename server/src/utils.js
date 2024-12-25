const fetch = require("node-fetch");
const robotsParser = require("robots-parser");

async function canCrawl(urlToCrawl, userAgent = "MyWebScraper/0.1") {
  try {
    const baseUrl = new URL(urlToCrawl).origin;
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();

    const response = await fetch(robotsUrl);
    if (response.status === 200) {
      const robotsContent = await response.text();
      const robots = robotsParser(robotsUrl, robotsContent);

      if (robots.isAllowed(urlToCrawl, userAgent)) {
        console.log(`Allowed to crawl: ${urlToCrawl}`);
        return true;
      } else {
        console.warn(`Disallowed by robots.txt: ${urlToCrawl}`);
        return false;
      }
    } else if (response.status === 404) {
      console.log(`No robots.txt found at ${robotsUrl}. Assuming allowed.`);
      return true; // If no robots.txt, assume crawling is allowed
    } else {
      console.error(`Error fetching robots.txt: Status ${response.status}`);
      return false; // Treat other errors as disallowed for safety
    }
  } catch (error) {
    console.error("Error checking robots.txt", error);
    return false;
  }
}

module.exports = { canCrawl };
