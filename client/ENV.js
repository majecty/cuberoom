const devEnv = {
  URL: "http://localhost:3000",
  URL_STATIC: "http://localhost:3000/static",
  ENVIRONMENT: "development",
  tracesSampleRate: 1.0,
};

const productionEnv = {
  URL: "http://test.cuberoom.net",
  URL_STATIC: "http://test.cuberoom.net",
  ENVIRONMENT: "production",
  tracesSampleRate: 0.1,
};

let ENV = devEnv;
if (process.env.BUILD_ENV === "production") {
  ENV = productionEnv;
} else {
  ENV = devEnv;
}

export default ENV;
