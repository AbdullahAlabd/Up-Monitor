const agenda = require("./agenda");
const customError = require("../errors");
const ObjectId = require("mongoose").Types.ObjectId;

const schedulePollingJob = async (data) => {
  try {
    const { userId, checkId, interval } = data;
    const job = agenda.create("polling-job", {
      userId: userId,
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
    const { userId, checkId } = data;
    await agenda.cancel({
      name: "polling-job",
      data: {
        userId: new ObjectId(userId),
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
