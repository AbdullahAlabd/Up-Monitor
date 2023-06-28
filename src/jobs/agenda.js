const Agenda = require("agenda");
const dotenv = require("dotenv");
const logger = require("../utils/logger");
const jobs = require(".");
const moment = require("moment");

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
agenda.define("polling-job", async (job) => {
  await jobs.pollingJob(job);
});

// notifications queue
agenda.define("notification-job", async (job) => {
  await jobs.notificationJob(job);
});

// implement retry mechanism for failed jobs
agenda.on("fail", (err, job) => {
  if (job.attrs.name === "notification-job") {
    // implement retry logic [for non-recurring job]
    const FAILURE_THRESHOLD = 5;
    const failureCount = job.attrs.failCount;
    const retryDelay = failureCount * 10000; // 10, 20, 30, 40, 50, ... seconds
    // works for non-recurring job only
    if (failureCount > FAILURE_THRESHOLD) {
      logger.error(
        `Job "${job.attrs.name}" failed more than ${FAILURE_THRESHOLD} times with error: ${err}`
      );
      return;
    }
    job.attrs.nextRunAt = moment()
      .add(retryDelay, "milliseconds") // works for non-recurring job only
      .toDate(); // retry 10 seconds later
    job.save();
  }
});

agenda
  .on("ready", async () => {
    logger.info("Agenda started!");
  })
  .on("error", () => {
    logger.info("Agenda connection error!");
  });

agenda.start();

module.exports = agenda;
