const axios = require("axios").default;

const getConfig = (payload) => {
  const config = {};
  // `url` is the server URL that will be used for the request
  if (payload?.path) {
    config.url = payload.path; // example: /api/v1/users
  }
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.example: 'http://localhost:5000'
  config.baseURL = `${payload.protocol}://${payload.url}${
    payload?.port ? `:${payload.port}` : ""
  }`;
  // `headers` are custom headers to be sent
  if (payload?.httpHeaders) {
    config.headers = payload.httpHeaders;
  }
  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  config.timeout = (payload?.timeout ?? 5) * 1000; // in milliseconds
  // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an `Authorization` header, overwriting any existing
  // `Authorization` custom headers you have set using `headers`.
  // Please note that only HTTP Basic auth is configurable through this parameter.
  // For Bearer tokens and such, use `Authorization` custom headers instead.
  if (payload?.authentication?.password && payload?.authentication?.username) {
    config.auth = {
      username: payload.authentication.username,
      password: payload.authentication.password
    };
  }
  // `validateStatus` defines whether to resolve or reject the promise for a given HTTP
  // response status code. If `validateStatus` returns `true` (or is set to `null` or
  // `undefined`), the promise will be resolved; otherwise, the promise will be rejected.
  if (payload?.assert?.statusCode) {
    config.validateStatus = function (status) {
      return status === payload.assert.statusCode;
    };
  }
  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // `keepAlive` that are not enabled by default.
  if (payload?.ignoreSSL) {
    config.httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
  }
  // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
  config.maxContentLength = 10_000_000; // ~10MB
  // `responseType` indicates the type of data that the server will respond with
  // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  // browser only: 'blob' | default : json
  config.responseType = "text"; // get response data as string
  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  config.transformResponse = [(data) => data]; // don't parse response data leave it string
  return config;
};

const getInstanceWithPayload = (payload) => {
  const config = getConfig(payload);
  return getInstanceWithConfig(config);
};

const getInstance = () => {
  return getInstanceWithConfig({});
};

const getInstanceWithConfig = (config) => {
  // The main function to create an instance of axios
  const instance = axios.create(config);
  //Add response time to the response object
  instance.interceptors.request.use(
    (reqConfig) => {
      reqConfig.metadata = { startTime: new Date().getTime() };
      return reqConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    (response) => {
      response.responseTime =
        new Date().getTime() - response.config.metadata.startTime;
      return response;
    },
    (error) => {
      error.responseTime =
        new Date().getTime() - error.config.metadata.startTime;
      return Promise.reject(error);
    }
  );
  return instance;
};

module.exports = {
  getConfig,
  getInstance,
  getInstanceWithConfig,
  getInstanceWithPayload
};
