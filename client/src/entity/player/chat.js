import { depth } from "../../constant";
import { createBackground } from "./chat/background";

export function chatUpdatePosition(chat, playerX, playerY) {
  // FIXME: do not update nameLabel, chat this way
  const { container } = chat;
  container.x = playerX;
  container.y = playerY - 80;
  return chat;
}

function chatUpdateTextInner(scene, chat, text) {
  const { phaserText, background, container } = chat;

  phaserText.setText(text);
  if (background != null) {
    background.destroy();
  }

  let newBackground = null;
  if (text != null && text !== "") {
    newBackground = createBackground(
      scene,
      phaserText.width + 32,
      phaserText.height + 32
    );
    // the first order will be rendered first
    container.addAt(newBackground, 0);
  }
  return {
    container,
    phaserText,
    background: newBackground,
  };
}

export function createPlayerChat(scene, text, x, y) {
  const phaserText = scene.add.text(0, 0, "", {
    fontFamily: "NeoDunggeunmo",
    fontSize: "16px",
    fill: "#ffffff",
    align: "center",
  });
  // set the bottom margin as constant
  phaserText.y = -5;
  phaserText.setOrigin(0.5, 1);

  const container = scene.add.container(0, 0, [phaserText]);
  container.setDepth(depth.nameLabel);

  let chat = {
    container,
    phaserText,
    background: null,
  };
  chat = chatUpdatePosition(chat, x, y);

  return chatUpdateTextInner(scene, chat, text);
}

/**
 * 채팅 텍스트를 표시
 * @param {string} text
 */
export function chatUpdateText(scene, chat, text) {
  let formattedText;
  if (text == null || text === "") {
    formattedText = "";
  } else {
    let lines = text.match(/.{1,12}/g);
    if (lines == null) {
      lines = [];
    }
    formattedText = lines.join("\n");
  }
  return chatUpdateTextInner(scene, chat, formattedText);
}

export function chatDestroy(chat) {
  chat.container.destroy(true);
}
