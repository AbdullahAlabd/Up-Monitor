const Agenda = require("agenda");
const dotenv = require("dotenv");
const logger = require("../utils/logger");
const jobService = require("./job-service");

dotenv.config({ path: "./src/configs/config.env" });

// instantiate Agenda and connect to database.
const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: "jobs",
    options: { useUnifiedTopology: true }
  },
  processEvery: "10 seconds",
  defaultLockLifetime: 10000,
  maxConcurrency: 20
});

// define all agenda jobs
agenda.define(
  "polling-job",
   async (job) => {
    await jobService.pollingJob(job);
  }
);

agenda
  .on("ready", async () => {
    logger.info("Agenda started!");
  })
  .on("error", () => {
    logger.info("Agenda connection error!");
  });

agenda.start();

module.exports = agenda;
