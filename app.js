const connectDb = require("./src/database/connect");
const express = require("express");
const dotenv = require("dotenv");
const authentication = require("./src/middleware/authenticator");
const errorHandlerMiddleware = require("./src/middleware/error-handler");
const agenda = require("./src/jobs/agenda");
// routes
const usersRoute = require("./src/routes/users-route");
const checksRoute = require("./src/routes/checks-route");
const reportsRoute = require("./src/routes/reports-route");

// initialize express
const app = express();
dotenv.config({ path: "./src/configs/config.env" });

// to get request of json data
app.use(express.json());
app.use("/api/v1/users", usersRoute);
app.use(authentication);
app.use("/api/v1/checks", checksRoute);
app.use("/api/v1/reports", reportsRoute);
app.use(errorHandlerMiddleware);

// for graceful shutdown
async function graceful() {
  await agenda.stop();
  process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

async function start() {
  await connectDb(process.env.MONGODB_URI);
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
}
start();
