import { getNextObjectId } from "./getNextObjectId";
import type { Bee, WorldState } from "./types";
import { getRandomArbitrary } from "./utils";

let nextId = 1;

const wanderingAi = (b: Bee, state: WorldState) => {
  // regular wander
  const WANDER = 7;
  b.x += getRandomArbitrary(-WANDER, WANDER);
  b.y += getRandomArbitrary(-WANDER, WANDER);

  // if there are trail points, bias towards them
  const trailPoints = state.objects.filter(
    (o) =>
      o.type === "trail-point" &&
      Math.abs(o.x - b.x) < 200 &&
      Math.abs(o.y - b.y) < 200
  );
  if (trailPoints.length > 0) {
    const HIVE_WEIGHT = 0; // add the hive to the vector a number of times, to bias towards it
    const VECTOR_POWER = 5; // how much to move towards the vector

    // get the vector that is formed by the average of the trail points
    const vector = trailPoints.reduce(
      (acc, tp) => {
        return {
          x: acc.x + tp.x,
          y: acc.y + tp.y,
        };
      },
      { x: 0, y: 0 }
    );
    vector.x /= trailPoints.length + HIVE_WEIGHT;
    vector.y /= trailPoints.length + HIVE_WEIGHT;

    const angle = Math.atan2(vector.y - b.y, vector.x - b.x);
    b.x += Math.cos(angle) * VECTOR_POWER;
    b.y += Math.sin(angle) * VECTOR_POWER;
  }
};

const gatheringPollenAI = (b: Bee, state: WorldState) => {
  const centerpoint = getCenterpoint(state);

  // if the bee is close to the centerpoint, switch back to wandering
  if (Math.abs(b.x - centerpoint.x) < 5 && Math.abs(b.y - centerpoint.y) < 5) {
    b.state = "wandering";
    return;
  }

  b.y += Math.random() * 10 - 5;
};

const ai = (b: Bee, state: WorldState) => {
  switch (b.state) {
    case "wandering":
      wanderingAi(b, state);
      break;
    case "gathering-pollen":
      gatheringPollenAI(b, state);
      break;
  }
};

export const beeBuilder = (b: Partial<Bee>, state: WorldState): Bee => {
  return {
    type: "bee",
    state: "wandering",
    id: getNextObjectId(),
    ...getCenterpoint(state),
    ai: wanderingAi,
    ...b,
  };
};

const getCenterpoint = (state: WorldState) => {
  return {
    x: state.config.width / 2,
    y: state.config.height / 2,
  };
};
