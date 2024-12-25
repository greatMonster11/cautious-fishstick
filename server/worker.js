const Queue = require("bull");
const cheerio = require("cheerio");
const { PrismaClient } = require("@prisma/client");
const { canCrawl } = require("./src/utils");

const prisma = new PrismaClient();
const scrapeQueue = new Queue("scrape-queue", {
  redis: {
    port: 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
});
const myUserAgent = "MyCoolScraper/1.2";

async function scrapeURL(url) {
  try {
    const ableToCrawl = await canCrawl(url, myUserAgent);
    if (!ableToCrawl) {
      return { url, error: "Disallowed by robots.txt" };
    }
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Error checking ${url}: Status ${response.status} ${response.statusText} `,
      );
      return {
        url,
        error: `HTTP error: ${response.status} ${response.statusText}`,
      };
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const media = [];

    const images = $("img")
      .map((i, el) => $(el).attr("src"))
      .get()
      .filter((src) => src !== undefined);
    const videos = $("video source")
      .map((i, el) => $(el).attr("src"))
      .get()
      .filter((src) => src !== undefined);

    return { url, images, videos };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return { url, error: error.message }; // Return error info
  }
}

scrapeQueue.process(async (job) => {
  const { url } = job.data;
  console.info("url processing: ", url);
  const result = await scrapeURL(url);
  if (result.error) {
    console.error(`Error scraping ${result.url}: ${result.error}`);
    return;
  }

  try {
    await prisma.media.createMany({
      data: [
        ...result.images.map((image) => ({
          url: image,
          type: "image",
          sourceUrl: result.url,
        })),
        ...result.videos.map((video) => ({
          url: video,
          type: "video",
          sourceUrl: result.url,
        })),
      ],
    });
  } catch (error) {
    console.error("Error inserting data to DB", error);
  }
  return result;
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

console.log("Worker started."); // Indicate that the worker is running
