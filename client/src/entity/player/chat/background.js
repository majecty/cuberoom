import ENV from "../../../../ENV";

export function loadChatBackgroundImage(scene) {
  const fileNames = [
    "center",
    "down",
    "up",
    "left",
    "right",
    "tail",
    "up-left",
    "up-right",
    "down-left",
    "down-right",
  ];
  for (const fileName of fileNames) {
    const url = `${ENV.URL_STATIC}/img/text-balloon/${fileName}.png`;
    scene.load.image(`chat-bubble-${fileName}`, url);
  }
}

function createSlice({ scene, left, right, up, down, image }) {
  const slice = scene.add.image((left + right) / 2, (up + down) / 2, image);
  slice.setDisplaySize(Math.abs(right - left), Math.abs(up - down));
  return slice;
}

export function createBackground(scene, widthInput, height) {
  const tailHeight = -10;
  let width;
  if (widthInput < 16 * 4) {
    width = 16 * 4;
  } else {
    width = widthInput;
  }
  const downWidth = (width - 16 * 3) / 2;

  const downL = createSlice({
    scene,
    left: -16 / 2 - downWidth,
    right: -16 / 2,
    down: tailHeight,
    up: -16 + tailHeight,
    image: "chat-bubble-down",
  });
  const downTail = createSlice({
    scene,
    left: -16 / 2,
    right: 16 / 2,
    down: 0,
    up: -16,
    image: "chat-bubble-tail",
  });
  const downTailFill = createSlice({
    scene,
    left: -16 / 2,
    right: 16 / 2,
    down: -16,
    up: -16 + tailHeight,
    image: "chat-bubble-center",
  });
  const downR = createSlice({
    scene,
    left: 16 / 2,
    right: 16 / 2 + downWidth,
    down: tailHeight,
    up: -16 + tailHeight,
    image: "chat-bubble-down",
  });
  const downLeftCorner = createSlice({
    scene,
    left: -downWidth - 16 / 2 - 16,
    right: -downWidth - 16 / 2,
    down: tailHeight,
    up: -16 + tailHeight,
    image: "chat-bubble-down-left",
  });
  const downRightCorner = createSlice({
    scene,
    left: downWidth + 16 / 2,
    right: downWidth + 16 / 2 + 16,
    down: tailHeight,
    up: -16 + tailHeight,
    image: "chat-bubble-down-right",
  });
  const left = createSlice({
    scene,
    left: -width / 2,
    right: -width / 2 + 16,
    down: -16 + tailHeight,
    up: -(height - 16) + tailHeight,
    image: "chat-bubble-left",
  });
  const right = createSlice({
    scene,
    left: width / 2,
    right: width / 2 - 16,
    down: -16 + tailHeight,
    up: -(height - 16) + tailHeight,
    image: "chat-bubble-right",
  });
  const upLeft = createSlice({
    scene,
    left: -width / 2,
    right: -width / 2 + 16,
    down: -(height - 16) + tailHeight,
    up: -height + tailHeight,
    image: "chat-bubble-up-left",
  });
  const upRight = createSlice({
    scene,
    left: width / 2 - 16,
    right: width / 2,
    down: -(height - 16) + tailHeight,
    up: -height + tailHeight,
    image: "chat-bubble-up-right",
  });
  const up = createSlice({
    scene,
    left: -width / 2 + 16,
    right: width / 2 - 16,
    down: -(height - 16) + tailHeight,
    up: -height + tailHeight,
    image: "chat-bubble-up",
  });
  const center = createSlice({
    scene,
    left: -width / 2 + 16,
    right: width / 2 - 16,
    down: -16 + tailHeight,
    up: -(height - 16) + tailHeight,
    image: "chat-bubble-center",
  });

  const container = scene.add.container(0, 20, [
    downL,
    downTail,
    downTailFill,
    downR,
    downLeftCorner,
    downRightCorner,
    center,
    left,
    right,
    upLeft,
    up,
    upRight,
  ]);

  return container;
}
