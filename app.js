const connectDb = require("./src/configs/connect");
const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config({ path: "./src/configs/config.env" });

// to get request of json data
app.use(express.json());


async function start() {
  await connectDb(process.env.MONGODB_URI);
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
}
start();
