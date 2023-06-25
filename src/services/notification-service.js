const emailClient = require("../utils/email-client");

const notify = async (user, payload, template, forceChannels = []) => {
  for (const key in channels) {
    if (channels.hasOwnProperty(key)) {
      if (
        forceChannels.includes(key) ||
        user.notificationChannels.includes(key)
      ) {
        const parsedTemplate = template(user, payload);
        await notifiers[channels[key]](user, parsedTemplate);
      }
    }
  }
};

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

// list of all available channels with short codes, and the handler name.
const channels = { email: "notifyByEmail", sms: "notifyBySms" };
// list of all available templates to be used for each channel.
const messageTemplates = {
  urlUpEmail: (user, payload) => {
    return {
      title: "Your url back up!",
      message: `<H1>Mabrook, up again!<span class='emoji'>🎉</span></H1>
      </br>
      Hi ${user.name} </br> </br>
      <h3>It seems like your check ${payload.checkName} has been failing beyond the threshold!<h3>
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
  urlDownEmail: (user, payload) => {
    return {
      title: "Your url is down!",
      message: `<H1>M3lsh, Something is wrong!<span class='emoji'>⚠️</span></H1>
      </br>
      Hi ${user.name} </br> </br>
      <h3>It seems like your check ${payload.checkName} has been failing beyond the threshold!<h3>
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
