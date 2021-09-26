const devEnv = {
  URL: "http://localhost:3000",
  URL_STATIC: "http://localhost:3000/static",
  ENVIRONMENT: "development",
};

const productionEnv = {
  URL: "http://test.cuberoom.net",
  URL_STATIC: "http://test.cuberoom.net",
  ENVIRONMENT: "production",
};

let ENV;
if (process.env.BUILD_ENV === "production") {
  ENV = productionEnv;
} else {
  ENV = devEnv;
}

export default ENV;
