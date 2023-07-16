const emailClient = require("../utils/email-client");

const notificationJob = async (job) => {
  const { channel, userDto, parsedTemplate } = job.attrs.data;
  await notifiers[channelHandler[channel]](userDto, parsedTemplate);
};

const channelHandler = { email: "notifyByEmail", sms: "notifyBySms" };

const notifiers = {
  notifyByEmail: async (user, parsedTemplate) => {
    await emailClient.sendEmail(
      user.email,
      parsedTemplate.title,
      parsedTemplate.message
    );
  },
  notifyBySms: async (user, message) => {
    throw new Error("SMS not implemented");
  }
};

module.exports = notificationJob;
