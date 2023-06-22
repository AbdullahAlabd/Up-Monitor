const connectDb = require("./src/database/connect");
const express = require("express");
const dotenv = require("dotenv");
const authentication = require("./src/middleware/authenticator");
const errorHandlerMiddleware = require("./src/middleware/error-handler");
// routes
const userRoute = require("./src/routes/user-route");

const app = express();
dotenv.config({ path: "./src/configs/config.env" });

// to get request of json data
app.use(express.json());
app.use("/api/v1/users", userRoute);
app.use(authentication);
app.use(errorHandlerMiddleware);

async function start() {
  await connectDb(process.env.MONGODB_URI);
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
}
start();
