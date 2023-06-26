const agenda = require("./agenda");
const customError = require("../errors");
const ObjectId = require("mongoose").Types.ObjectId;

const schedulePollingJob = async (data) => {
  try {
    const { checkId, interval } = data;
    const job = agenda.create("polling-job", {
      checkId: checkId
    });
    await job.repeatEvery(`${interval} minutes`).save();
  } catch (error) {
    throw new customError.InternalServerError(
      "Something went wrong! please try again later."
    );
  }
};

const cancelPollingJob = async (data) => {
  try {
    const { checkId } = data;
    await agenda.cancel({
      name: "polling-job",
      data: {
        checkId: new ObjectId(checkId)
      }
    });
  } catch (error) {
    throw new customError.InternalServerError(
      "Something went wrong! please try again later."
    );
  }
};

module.exports = { schedulePollingJob, cancelPollingJob };
