import { networkTickMillis, playerSpeed } from "../../constant";

function square(x) {
  return x * x;
}

function calculateDistance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return Math.sqrt(square(x1 - x2) + square(y1 - y2));
}

function lerp({ from, to, t }) {
  return from + (to - from) * t;
}

function moveTo({ current, goal, speed, dtMillis }) {
  const frameDistance = (speed * dtMillis) / 1000;
  const goalDitances = calculateDistance(current, goal);

  if (frameDistance > goalDitances) {
    return {
      newX: goal.x,
      newY: goal.y,
      stop: true,
    };
  }

  return {
    newX: lerp({
      from: current.x,
      to: goal.x,
      t: frameDistance / goalDitances,
    }),
    newY: lerp({
      from: current.y,
      to: goal.y,
      t: frameDistance / goalDitances,
    }),
    stop: false,
  };
}

export function playerNetworkCreate() {
  return {
    // x: number, y: number
    lastReceivedPosition: null,
    lastReceivedTimeMillis: null,
    // x: number, y: number
    lastReceivedTarget: null,
  };
}

export function playerNetworkUpdate(_playerNetwork, newPosition, newTarget) {
  return {
    lastReceivedPosition: newPosition,
    lastReceivedTimeMillis: Date.now(),
    lastReceivedTarget: newTarget,
  };
}

// TODO: target을 사용해서 더 정밀화 하자.
export function playerNetworkGetThisFramePosition({
  playerNetwork,
  currentPosition,
  dtMillis,
}) {
  const { lastReceivedPosition } = playerNetwork;
  if (lastReceivedPosition == null) {
    return {
      newX: currentPosition.x,
      newY: currentPosition.y,
      stop: true,
    };
  }

  const distance = calculateDistance(currentPosition, lastReceivedPosition);
  const normalDistancePerNetworkTick = (networkTickMillis * playerSpeed) / 1000;
  if (distance > 5 * normalDistancePerNetworkTick) {
    return {
      newX: lastReceivedPosition.x,
      newY: lastReceivedPosition.y,
      stop: true,
    };
  }
  if (distance > 2 * normalDistancePerNetworkTick) {
    const { newX, newY, stop } = moveTo({
      current: currentPosition,
      goal: lastReceivedPosition,
      speed: playerSpeed * 2,
      dtMillis,
    });
    return { newX, newY, stop };
  }
  const dust = 3;
  if (distance < dust) {
    return { newX: currentPosition.x, newY: currentPosition.y, stop: true };
  }
  const { newX, newY, stop } = moveTo({
    current: currentPosition,
    goal: lastReceivedPosition,
    speed: playerSpeed,
    dtMillis,
  });
  return { newX, newY, stop };
}
