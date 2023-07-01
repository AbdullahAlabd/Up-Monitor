const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkSchema = new Schema({
  // The id of the user who created the check.
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // The name of the check.
  name: {
    type: String,
    required: true,
    trim: true
  },
  // The URL to be monitored.
  url: {
    type: String,
    required: true,
    trim: true
  },
  // The resource protocol name HTTP, HTTPS, or TCP.
  protocol: {
    type: String,
    enum: ["http", "https", "tcp"],
    required: true
  },
  // A specific path to be monitored.
  path: {
    type: String,
    trim: true,
    default: null // delegate default to the request client
  },
  // The server port number.
  port: {
    type: Number,
    min: 1,
    max: 65535, // 65535 is the maximum port number
    default: null // delegate default to the request client
  },
  // A webhook URL to receive a notification on.
  webhook: {
    type: String,
    trim: true,
    default: null
  },
  // The timeout of the polling request.
  timeout: {
    type: Number,
    min: 0,
    default: null // delegate default to the request client
  },
  // The time interval for polling requests
  interval: {
    type: Number,
    required: true,
    min: 1, // minute
    max: 525600 // year
  },
  // The threshold of failed requests that will create an alert
  threshold: {
    type: Number,
    required: true,
    min: 1
  },
  // An HTTP authentication header, with the Basic scheme, to be sent with the polling request.
  // authentication : {username : "xxx", password : "xxx"}
  authentication: {
    type: Object,
    default: null // delegate default to the request client
  },
  // A list of key/value pairs custom HTTP headers to be sent with the polling request.
  httpHeaders: {
    type: Object,
    default: null // delegate default to the request client
  },
  // The response assertion to be used on the polling response.
  // assert.statusCode An HTTP status code to be asserted. Example assert : {statusCode : 200}
  assert: {
    type: Object,
    default: null // delegate default to the request client
  },
  // A list of the check tags.
  tags: {
    type: Array,
    default: []
  },
  // A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.
  ignoreSSL: {
    type: Boolean,
    default: null // delegate default to the request client
  },
  stats: {
    type: Object,
    default: {
      lastStatus: Boolean, // true for pass
      consecutiveFailures: 0,
      passedChecks: 0,
      totalChecks: 0,
      upTime: 0,
      totalTime: 0, // check lifetime
      avgResponseTime: 0
    }
  },
  createdAt: {
    type: Date,
    default: () => {
      // time of document creation
      return Date.now();
    }
  }
});

checkSchema.index({ userId: 1, createdAt: -1});
module.exports = mongoose.model("Check", checkSchema);
