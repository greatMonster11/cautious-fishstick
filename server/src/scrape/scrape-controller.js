const scrape = (scrapeQueue, req, res) => {
  const urls = req.body.urls;

  if (!Array.isArray(urls)) {
    return res.status(400).send("URLs must be an array.");
  }

  urls.forEach(async (url) => {
    scrapeQueue.add({ url });
  });

  res.status(202).send({ message: "Scraping tasks added to queue." });
};

const getMedia = async (prisma, req, res) => {
  const { page = 1, limit = 10, type, search } = req.query;
  const skip = (page - 1) * limit;

  const where = {};
  if (type) {
    where.type = type;
  }
  if (search) {
    where.url = { contains: search };
  }

  try {
    const media = await prisma.media.findMany({
      where,
      skip,
      take: parseInt(limit),
    });
    res.json(media);
  } catch (error) {
    console.error("Error fetching media from DB", error);
    res.status(500).json({ error: "Error fetching data" });
  }
};

module.exports = { scrape, getMedia };
