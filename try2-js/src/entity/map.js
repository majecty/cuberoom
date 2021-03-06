/* eslint-disable import/prefer-default-export */

import { assert } from "../assert";

function extractObjects(phaserObjectLayer) {
  const results = {};
  for (const tiledObject of phaserObjectLayer.objects) {
    assert(results[tiledObject.name] == null, "tile object duplication");
    results[tiledObject.name] = {
      phaser: tiledObject,
      x: tiledObject.x,
      y: tiledObject.y,
    };
  }
  return results;
}

export function mapCreate(scene) {
  const phaser = scene.make.tilemap({
    key: "map",
    tileWidth: 16,
    tileHeight: 16,
  });
  const tileset = phaser.addTilesetImage("collision", "collision-tileset");

  const collisionLayer = phaser.createLayer("collision", tileset, 0, 0);
  collisionLayer.visible = false;
  collisionLayer.alpha = 0;

  const interactiveTileset = phaser.addTilesetImage("interactive-tile");
  const interactionLayer = phaser.createLayer(
    "interaction",
    interactiveTileset,
    0,
    0
  );
  interactionLayer.visible = false;

  phaser.setCollisionByProperty(
    {
      collides: true,
    },
    true,
    true,
    collisionLayer
  );

  const objectLayer = phaser.objects[0];

  return {
    phaser,
    tileset,
    collisionLayer,
    interactiveTileset,
    interactionLayer,
    backgroundTileset: null,
    objectLayer,
    objects: extractObjects(objectLayer),
  };
}

/**
 * 플레이어 생성 이후에 호출해야 플레이어 위에 그려진다.
 */
export function mapCreateOverCharacterLayer(map) {
  const backgroundTileset = map.phaser.addTilesetImage("background");
  map.phaser.createLayer("overCharacter", backgroundTileset, 0, 0);
  return {
    ...map,
    backgroundTileset,
  };
}

function getAnyLayer(map) {
  return map.interactionLayer;
}

export function mapTileToWorldXY(map, tile) {
  const layer = getAnyLayer(map);
  const xy = layer.tileToWorldXY(tile.x, tile.y);
  assert(xy.x != null, "x not null");
  assert(xy.y != null, "y not null");
  return xy;
}
