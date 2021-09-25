/* eslint no-param-reassign: ["error", { "props": false }] */
import { networkTickMillis } from "../constant";

export function rateLimiterCreate() {
  return {
    lastSentTimeMillis: null,
  };
}

/**
 * networkTickMillis 시간 동안 여러번 호출되면 딱 한 번만 job을 호출.
 * 마지막 job이 무시된 이후 networkTickMillis동안 따로 호출된 게 없으면
 * 마지막 요청을 networkTickMillis가 지난 시점에 보냄.
 */
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
        rateLimiter.lastSentTimeMillis = Date.now();
        job();
      }
    }, networkTickMillis);
  }
}
