import App from "./App.svelte";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import ENV from "../ENV";

const app = new App({
  target: document.body,
  // hydrate: true,
});

Sentry.init({
  dsn: "https://21f1b2ad5efb452684d66b18467ae893@o1013913.ingest.sentry.io/5979255",
  release: ENV.version,
  integrations: [new Integrations.BrowserTracing()],
  environment: ENV.ENVIRONMENT,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: ENV.tracesSampleRate,
});

export default app;
