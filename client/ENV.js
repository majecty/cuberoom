function getDevSocketioURL() {
  if (location.host.indexOf("cuberoom") !== -1) {
    // run server in localhost but using DNS
    // it will help debuggin in Mobile
    // return "https://cuberoom.i.juhyung.dev/";
    return "https://3000-cuberoom.i.juhyung.dev/";
  } else {
    // run server in localhost
    return "http://localhost:3000";
    // return "https://3000-cuberoom.i.juhyung.dev/";
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
  GET_ENVIRONMENT: () => "development",
  tracesSampleRate: 1.0,
  version: `${process.env.VERSION}`,
};

function getProdURL() {
  if (location.host.indexOf("test") !== -1) {
    // test server
    return "https://test.cuberoom.net/";
  } else if (location.host.indexOf() !== -1) {
    return "https://prev.cuberoom.net/";
  } else {
    // return "https://cuberoom.net";
    return "https://3000-cuberoom.i.juhyung.dev/"
  }
}

function getEnv() {
  if (location.host.indexOf("test") !== -1) {
    return "staging";
  } else if (location.host.indexOf() !== -1) {
    return "prev";
  } else {
    return "production";
  }
}

const productionEnv = {
  GET_SOCKETIO_URL: getProdURL,
  GET_SERVER_URL: getProdURL,
  URL_STATIC: "/static",
  GET_ENVIRONMENT: getEnv,
  tracesSampleRate: 0.1,
  version: `${process.env.VERSION}`,
};

let ENV = devEnv;
if (process.env.BUILD_ENV === "production") {
  ENV = productionEnv;
} else {
  ENV = devEnv;
}

if (window != null) {
  window.ENV = ENV;
}

export default ENV;
