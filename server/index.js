const express = require("express");
const bodyParser = require("body-parser");
const winston = require("winston");
const expressWinston = require("express-winston");
const Queue = require("bull");
const { PrismaClient } = require("@prisma/client");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const { login } = require("./src/auth/auth-controller");
const { scrape, getMedia } = require("./src/scrape/scrape-controller");
const { authenticateToken } = require("./src/middelwares/auth");
const { allowOrigin } = require("./src/middelwares/cors");

const app = express();
const port = process.env.PORT || 8080;

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const prisma = new PrismaClient();
const scrapeQueue = new Queue("scrape-queue", {
  redis: {
    port: 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
});

// init board
createBullBoard({
  queues: [new BullAdapter(scrapeQueue)],
  serverAdapter: serverAdapter,
});

app.use(allowOrigin);

// Logging Middleware
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
  }),
);

// Error Handling Middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use(bodyParser.json());

app.post("/login", async (req, res) => {
  login(prisma, req, res);
});

app.post("/scrape", authenticateToken, async (req, res) => {
  scrape(scrapeQueue, req, res);
});

app.get("/scrape/media", async (req, res) => {
  getMedia(prisma, req, res);
});

// bull dashboard
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(port, () => console.log(`Server listening on port ${port}`));
