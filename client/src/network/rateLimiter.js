export function rateLimiterCreate() {
  return {
    lastSentTimeMillis: null,
  };
}

export function rateLimiterTrigger(rateLimiter, job) {
  if (rateLimiter.lastSentTimeMillis == null) {
    rateLimiter.lastSentTimeMillis = Date.now();
    job();
    return;
  }

  const nextSendableTime = rateLimiter.lastSentTimeMillis + 100;
  if (Date.now() > nextSendableTime) {
    rateLimiter.lastSentTimeMillis = Date.now();
    job();
  }
}
