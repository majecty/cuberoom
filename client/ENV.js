function getDevSocketioURL() {
  if (location.host.indexOf("cuberoom") !== -1) {
    // run server in localhost but using DNS
    // it will help debuggin in Mobile
    return "https://cuberoom.i.juhyung.dev/";
  } else {
    // run server in localhost
    return "http://localhost:3000";
  }
}

function getDevRESTURL() {
  if (location.host.indexOf("cuberoom") !== -1) {
    // run server in localhost but using DNS
    // it will help debuggin in Mobile
    return "https://rest-cuberoom.i.juhyung.dev/";
  } else {
    // run server in localhost
    return "http://localhost:3000";
  }
}

const devEnv = {
  GET_SOCKETIO_URL: getDevSocketioURL,
  GET_SERVER_URL: getDevRESTURL,
  URL_STATIC: "/static",
  ENVIRONMENT: "development",
  tracesSampleRate: 1.0,
  version: `${process.env.VERSION}-dev`,
};

function getProdURL() {
  if (location.host.indexOf("test") !== -1) {
    // test server
    return "http://test.cuberoom.net/";
  } else {
    return "http://cuberoom.net";
  }
}

const productionEnv = {
  GET_SOCKETIO_URL: getProdURL,
  GET_SERVER_URL: getProdURL,
  URL_STATIC: "/static",
  ENVIRONMENT: "production",
  tracesSampleRate: 0.1,
  version: `${process.env.VERSION}-prod`,
};

let ENV = devEnv;
if (process.env.BUILD_ENV === "production") {
  ENV = productionEnv;
} else {
  ENV = devEnv;
}

export default ENV;
