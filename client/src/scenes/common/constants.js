/* eslint-disable import/prefer-default-export */
import { zoom } from "../../constant";

export const spawnPoints = {
  entrance: {
    start: {
      x: (32 / zoom) * 5,
      y: (32 / zoom) * 30,
    },
    buildingFront: {
      x: (32 / zoom) * 27,
      y: (32 / zoom) * 29,
    },
  },
  floorB2: {
    fromB1: {
      x: (32 / zoom) * 6,
      y: (32 / zoom) * 13,
    },
    fromB1_2: {
      x: (32 / zoom) * 37,
      y: (32 / zoom) * 16,
    },
    fromB1_3: {
      x: (32 / zoom) * 3,
      y: (32 / zoom) * 35,
    },
    elevator: {
      x: (32 / zoom) * 7,
      y: (32 / zoom) * 22,
    },
  },
  floorB1: {
    fromB2: {
      x: (32 / zoom) * 6,
      y: (32 / zoom) * 32,
    },
    fromB2_2: {
      x: (32 / zoom) * 3,
      y: (32 / zoom) * 55,
    },
    from1F: {
      x: (32 / zoom) * 6,
      y: (32 / zoom) * 32,
    },
    elevator: {
      x: (32 / zoom) * 9,
      y: (32 / zoom) * 42,
    },
  },
  floor1F: {
    fromB1: {
      x: (32 / zoom) * 3,
      y: (32 / zoom) * 13,
    },
    from2F: {
      x: (32 / zoom) * 6,
      y: (32 / zoom) * 14,
    },
    fromEntrance: {
      x: (32 / zoom) * 5,
      y: (32 / zoom) * 29,
    },
    elevator: {
      x: (32 / zoom) * 9,
      y: (32 / zoom) * 21,
    },
  },
  floor2F: {
    from1F: {
      x: (32 / zoom) * 3,
      y: (32 / zoom) * 11,
    },
    from5F: {
      x: (32 / zoom) * 6,
      y: (32 / zoom) * 13,
    },
    elevator: {
      x: (32 / zoom) * 9,
      y: (32 / zoom) * 21,
    },
  },
  floor5F: {
    from2F: {
      x: (32 / zoom) * 3,
      y: (32 / zoom) * 14,
    },
    from6F: {
      x: (32 / zoom) * 6,
      y: (32 / zoom) * 13,
    },
    from6F_2: {
      x: (32 / zoom) * 46,
      y: (32 / zoom) * 22,
    },
    elevator: {
      x: (32 / zoom) * 9,
      y: (32 / zoom) * 22,
    },
  },
  floor6F: {
    from5F: {
      x: (32 / zoom) * 3,
      y: (32 / zoom) * 21,
    },
    from5F_2: {
      x: (32 / zoom) * 46,
      y: (32 / zoom) * 26,
    },
    from7F: {
      x: (32 / zoom) * 6,
      y: (32 / zoom) * 21,
    },
    elevator: {
      x: (32 / zoom) * 9,
      y: (32 / zoom) * 30,
    },
  },
  floor7F: {
    from6F: {
      x: (32 / zoom) * 3,
      y: (32 / zoom) * 13,
    },
    from8F: {
      x: (32 / zoom) * 6,
      y: (32 / zoom) * 13,
    },
    elevator: {
      x: (32 / zoom) * 9,
      y: (32 / zoom) * 22,
    },
  },
  floor8F: {
    from7F: {
      x: (32 / zoom) * 3,
      y: (32 / zoom) * 20,
    },
  },
};
