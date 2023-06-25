const Joi = require("joi");

// url-check request body validation (for both add and update)
const checkBodyUpdate = Joi.object({
  // The name of the check.
  name: Joi.string().trim().optional().label("Name"),
  // The URL to be monitored.
  url: Joi.string().trim().optional().label("URL"),
  // The resource protocol name HTTP, HTTPS, or TCP.
  protocol: Joi.string()
    .lowercase()
    .valid("http", "https", "tcp")
    .optional()
    .label("Protocol"),
  // A specific path to be monitored.
  path: Joi.string().trim().optional().label("Path"),
  // The server port number (optional).
  port: Joi.number().integer().min(1).max(65535).optional().label("Port"),
  // A webhook URL to receive a notification on.
  webhook: Joi.string().trim().uri().optional().label("Webhook"),
  // The timeout of the polling request.
  timeout: Joi.number().integer().min(0).optional().label("Timeout"),
  // The time interval for polling requests.
  interval: Joi.number()
    .integer()
    .min(1)
    .max(525600)
    .default(10)
    .optional()
    .label("Interval"),
  // The threshold of failed requests that will create an alert.
  threshold: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional()
    .label("Threshold"),
  // An HTTP authentication header, with the Basic scheme, to be sent with the polling request.
  // authentication : { username: "XXXXXXXX", password: "XXXXXXXX"}
  authentication: Joi.object({
    username: Joi.string().trim().required().label("Authentication username"),
    password: Joi.string().trim().required().label("Authentication password")
  })
    .optional()
    .label("Authentication object"),
  // A list of key/value pairs custom HTTP headers to be sent with the polling request.
  httpHeaders: Joi.object().optional().label("HTTP Headers object"),
  // he response assertion to be used on the polling response.
  // assert.statusCode: An HTTP status code to be asserted.
  assert: Joi.object({
    statusCode: Joi.number()
      .integer()
      .min(100)
      .max(599)
      .required()
      .label("Assert status code")
  })
    .optional()
    .label("Assert object"),
  // A list of the check tags.
  tags: Joi.array()
    .items(Joi.string().trim().label("Tag element"))
    .optional()
    .label("Tags array"),
  // A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.
  ignoreSSL: Joi.boolean().optional().label("Ignore SSL flag"),

  // To be ignored: [userId, role, isVerified] auto overridden into req.body
  // by the authentication middleware
  userId: Joi.any().optional(),
  role: Joi.any().optional(),
  isVerified: Joi.any().optional()
});

module.exports = checkBodyUpdate;
