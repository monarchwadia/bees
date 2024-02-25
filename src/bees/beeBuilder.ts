import { getNextObjectId } from "./getNextObjectId";
import { trailPointBuilder } from "./trailPointBuilder";
import type { Bee, Flower, TrailPoint, WorldState } from "./types";
import { getRandomArbitrary } from "./utils";

let nextId = 1;

const FLIGHT_RANDOMNESS = 7;
const DETECTION_RANGE = 50; // how far away the bee can see
const COLLECTION_RANGE = 10; // how close the bee needs to be to collect pollen, or to deposit it in the hive
const TRAIL_POINT_POWER = 2; // how much the trail point influences the bee's movement

const ANGULAR_SPEED = 0.01; // Adjust for how fast the bee circles around the centerpoint

const wanderingAi = (b: Bee, state: WorldState) => {
  // regular wander
  b.x += getRandomArbitrary(-FLIGHT_RANDOMNESS, FLIGHT_RANDOMNESS);
  b.y += getRandomArbitrary(-FLIGHT_RANDOMNESS, FLIGHT_RANDOMNESS);

  // if the bee is in range of a flower, switch to gathering pollen
  const flowers: Flower[] = state.objects.filter(
    (o) =>
      o.type === "flower" &&
      Math.abs(o.x - b.x) < DETECTION_RANGE &&
      Math.abs(o.y - b.y) < DETECTION_RANGE
  ) as Flower[];

  let thisBeeJustCollectedPollen = false;
  flowers.forEach((f) => {
    // if the bee just collected pollen from some flower, don't collect again from another flower.
    if (thisBeeJustCollectedPollen) return;

    if (
      Math.abs(f.x - b.x) < COLLECTION_RANGE &&
      Math.abs(f.y - b.y) < COLLECTION_RANGE
    ) {
      b.state = "gathering-pollen";
      f.pollen--;
      b.pollen = 1;
      thisBeeJustCollectedPollen = true;
    }
  });

  // if there are trail points, bias towards them
  const nearbyTrailPoints = state.objects.filter(
    (o) =>
      (o.type === "trail-point" || o.type === "flower") &&
      Math.abs(o.x - b.x) < DETECTION_RANGE &&
      Math.abs(o.y - b.y) < DETECTION_RANGE
  ) as TrailPoint[];

  if (nearbyTrailPoints.length) {
    // 1. get the vector created between the bee and the trail point farthest from the hive
    const farthestTrailPoint = nearbyTrailPoints.reduce(
      (acc, tp) => {
        const distanceFromHive = Math.sqrt(
          Math.pow(tp.x - state.config.width / 2, 2) +
            Math.pow(tp.y - state.config.height / 2, 2)
        );

        if (distanceFromHive > acc.distance) {
          return {
            x: tp.x,
            y: tp.y,
            distance: distanceFromHive,
          };
        } else {
          return acc;
        }
      },
      { x: 0, y: 0, distance: 0 }
    );

    // 2. move towards the farthest trail point
    const farthestTrailPointVector = {
      x: farthestTrailPoint.x - b.x,
      y: farthestTrailPoint.y - b.y,
    };

    const angle = Math.atan2(
      farthestTrailPointVector.y,
      farthestTrailPointVector.x
    );

    b.x += Math.cos(angle) * TRAIL_POINT_POWER;
    b.y += Math.sin(angle) * TRAIL_POINT_POWER;
  }

  // if there are no trailpoints, circle
  else {
    // I want to make the bees circle around the centerpoint. They'll do this by
    // calculating the angle between the centerpoint and the bee, and then adding
    // a small amount to that angle each frame. This will make the bees circle
    // around the centerpoint.
    // Assuming b is your bee object with properties x and y
    const centerpoint = getCenterpoint(state);

    // Calculate the initial angle between the bee and the centerpoint
    let angle = Math.atan2(b.y - centerpoint.y, b.x - centerpoint.x);

    // Update the angle by adding a small amount to simulate rotation
    const angleIncrement = getRandomArbitrary(0.004, 0.008); // Adjust this value to control the rotation speed
    angle += angleIncrement * b.direction; // b.direction is either -1 or 1

    // Calculate the radius between the bee and the centerpoint
    const radius = Math.sqrt(
      Math.pow(b.x - centerpoint.x, 2) + Math.pow(b.y - centerpoint.y, 2)
    );

    // Calculate the new position of the bee
    b.x = centerpoint.x + radius * Math.cos(angle);
    b.y = centerpoint.y + radius * Math.sin(angle);
  }

  // max and min bounds
  b.x = Math.max(0, Math.min(state.config.width, b.x));
  b.y = Math.max(0, Math.min(state.config.height, b.y));
};

const gatheringPollenAI = (b: Bee, state: WorldState) => {
  const centerpoint = getCenterpoint(state);

  // if the bee is close to the centerpoint, switch back to wandering
  if (
    Math.abs(b.x - centerpoint.x) < COLLECTION_RANGE &&
    Math.abs(b.y - centerpoint.y) < COLLECTION_RANGE
  ) {
    b.state = "wandering";
    if (b.pollen > 0) {
      state.hive.pollen++;
      b.pollen--;
    }
    return;
  }

  // random chance of dropping a trail point
  if (Math.random() < 0.2) {
    state.objects.push(trailPointBuilder({ x: b.x, y: b.y }, state));
  }

  // move towards the centerpoint, with randomness
  const angle = Math.atan2(centerpoint.y - b.y, centerpoint.x - b.x);
  b.x += Math.cos(angle) * 2;
  b.x += getRandomArbitrary(-FLIGHT_RANDOMNESS / 2, FLIGHT_RANDOMNESS / 2);

  b.y += Math.sin(angle) * 2;
  b.y += getRandomArbitrary(-FLIGHT_RANDOMNESS / 2, FLIGHT_RANDOMNESS / 2);
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
    pollen: 0,
    direction: Math.random() > 0.5 ? -1 : 1,
    id: getNextObjectId(),
    ...getCenterpoint(state),
    ai,
    ...b,
  };
};

const getCenterpoint = (state: WorldState) => {
  return {
    x: state.config.width / 2,
    y: state.config.height / 2,
  };
};
