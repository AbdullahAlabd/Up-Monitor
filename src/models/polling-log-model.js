const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  fullUrl: { type: String },
  headers: { type: Object }
});

const responseSchema = new Schema({
  status: { type: Number },
  statusText: { type: String },
  data: { type: Object }
});

const errorSchema = new Schema({
  message: { type: String }
});

const dataSchema = new Schema({
  request: requestSchema,
  response: responseSchema,
  error: errorSchema,
  responseTimeMilliseconds: { type: Number }
});

const pollingLogSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: () => {
        // time of document creation
        return Date.now();
      },
      //expires: is the TTL(time to live) for the document in seconds
      expires: 24 * 60 * 60 // 24 Hours
    },
    // metadata: data that is used to label a unique series of documents.
    // The metadata should rarely, if ever, change
    metadata: {
      checkId: {
        type: Schema.Types.ObjectId,
        ref: "Check",
        required: true
      }
    },
    data: dataSchema
  },
  {
    timeseries: {
      timeField: "createdAt",
      metaField: "metadata",
      // granularity: value that is closest to the ingestion rate for a
      // unique data source as specified by the value for the metaField field.
      granularity: "minutes"
    }
  }
);
pollingLogSchema.index({ "metadata.checkId": 1, "createdAt": -1 }); // schema level
module.exports = mongoose.model("PollingLogs", pollingLogSchema);
