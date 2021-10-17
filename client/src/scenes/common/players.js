import { log } from "../../log";
import { chatDestroy } from "../../entity/player/chat";

export function playersCreate(sceneName) {
  return { sceneName, entries: {} };
}

export function playersEntries(players) {
  return Object.entries(players.entries);
}

/**
 * player는 socket 이벤트에 따라서 값이 바뀜.
 * @param dataFromServer id프로퍼티를 가짐
 */
export function playersOnRemovePlayer(players, dataFromServer) {
  const { id } = dataFromServer;
  if (players.entries[id]) {
    log("removePlayers", players.sceneName, id, dataFromServer);
    // FIXME: scene.player와 scene.players가 같은 player를 공유한다.
    // 여기서 player.phaser.destroy를 하면 player도 영향을 받음.
    players.entries[id].phaser.destroy(true);
    players.entries[id].nameLabel.destroy(true);
    chatDestroy(players.entries[id].chat);

    const newPlayers = { ...players };
    delete newPlayers.entries[id];
    return newPlayers;
  }
  return players;
}

export function playersReset(players) {
  for (const [_, player] of Object.entries(players.entries)) {
    // need to introduce a new method
    player.phaser.destroy(true);
    player.nameLabel.destroy(true);
    chatDestroy(player.chat);
  }
  return {
    ...players,
    entries: {},
  };
}

export function playersAddPlayer(players, id, player) {
  const newPlayers = {
    ...players,
  };
  newPlayers.entries[id] = player;
  return newPlayers;
}
