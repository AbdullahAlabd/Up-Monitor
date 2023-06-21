const mongoose = require("mongoose");

async function connect(url) {
  try {
    await mongoose.connect(url).then((data) => {
      console.log(`Database server is connected on host ${data.connection.host}`);
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = connect;
