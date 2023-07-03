const emailClient = require("../utils/email-client");
const logger = require("../utils/logger");
const eventEmitter = require("../utils/event-emitter");
const scheduler = require("../jobs/scheduler");

eventEmitter.on("notify", (userDto, payload, templateName, forceChannels) => {
  notify(userDto, payload, templateName, forceChannels);
});

const notify = async (userDto, payload, templateName, forceChannels = []) => {
  // userDto : {
  //   name: String
  //   email: String
  //   notificationChannels: []
  // }
  channels.forEach((channel) => {
    if (
      forceChannels.includes(channel) ||
      userDto.notificationChannels.includes(channel)
    ) {
      const parsedTemplate = messageTemplates[templateName](userDto, payload);
      scheduler.scheduleNotificationJob({
        channel,
        userDto,
        parsedTemplate
      });
    }
  });
};

// list of all available channels with short codes, and the handler name.
const channels = ["email", "sms"];
// list of all available templates to be used for each channel.
const messageTemplates = {
  urlUpEmail: (user, payload) => {
    return {
      title: "Your url back up!",
      message: `<H1>Mabrook, up again!<span class='emoji'>🎉</span></H1>
      </br>
      Hi ${user.name} </br> </br>
      <h3>It seems like your check (${payload.checkName}) is now up again<h3>
      </br>
      This is just a notification.
      </br>
      </br>
      </br>
      ${process.env.APP_NAME}`
    };
  },
  urlDownEmail: (user, payload) => {
    return {
      title: "Your url is down!",
      message: `<H1>M3lsh, Something is wrong!<span class='emoji'>⚠️</span></H1>
      </br>
      Hi ${user.name} </br> </br>
      <h3>It seems like your check (${payload.checkName}) has been failing beyond the threshold!<h3>
      </br>
      This is just a notification.
      </br>
      We'll send you a notification once it's back up.
      </br>
      </br>
      </br>
      ${process.env.APP_NAME}`
    };
  },

  verifyMail: (user, payload) => {
    return {
      title: "Verify your email address!",
      message: `<H1>Hi ${user.name} <span class='emoji'>👋</span></H1>
      </br>
      <H3>Thanks for joining ${process.env.APP_NAME}</H3>
      </br>
      </br>
      Click this link to confirm your email address and complete your registration process
      </br>
      <a href='${process.env.HOST}/api/v1/users/verify?token=${payload.token}'>Verify email</a>
      </br>
      <p>The link will expire after 24 hours.</p>
      </br>
      </br>
      </br>
      ${process.env.APP_NAME}`
    };
  }
};

module.exports = { messageTemplates, notify };
