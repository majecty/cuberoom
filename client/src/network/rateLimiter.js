/* eslint no-param-reassign: ["error", { "props": false }] */
import { networkTickMillis } from "../constant";

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

  const nextSendableTime = rateLimiter.lastSentTimeMillis + networkTickMillis;
  if (Date.now() > nextSendableTime) {
    rateLimiter.lastSentTimeMillis = Date.now();
    job();
  } else {
    const prevCheckTime = rateLimiter.lastSentTimeMillis;
    // 이 요청이 마지막이었으면 챙겨서 보내주자
    setTimeout(() => {
      if (rateLimiter.lastSentTimeMillis === prevCheckTime) {
        job();
      }
    }, networkTickMillis);
  }
}
