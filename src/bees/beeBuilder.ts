import {
  BEE_HUNGER_INCREASE_RATE,
  BEE_HUNGER_DEATH_THRESHOLD,
  POLLEN_FOOD_VALUE,
  GLOBAL_MAP_WIDTH,
  GLOBAL_MAP_HEIGHT,
} from "./constants";
import { getNextObjectId } from "./getNextObjectId";
import { trailPointBuilder } from "./trailPointBuilder";
import type { Bee, Flower, TrailPoint, WorldState } from "./types";
import { getRandomArbitrary } from "./utils";

const moveTowardHive = (b: Bee, state: WorldState) => {
  const centerpoint = getCenterpoint(state);

  // move towards the centerpoint, with randomness
  const angle = Math.atan2(centerpoint.y - b.y, centerpoint.x - b.x);
  b.x += Math.cos(angle) * 2;
  b.x += getRandomArbitrary(
    -state.config.bee.flightRandomness / 2,
    state.config.bee.flightRandomness / 2
  );

  b.y += Math.sin(angle) * 2;
  b.y += getRandomArbitrary(
    -state.config.bee.flightRandomness / 2,
    state.config.bee.flightRandomness / 2
  );
};

const wanderingAi = (b: Bee, state: WorldState) => {
  // regular wander
  b.x += getRandomArbitrary(
    -state.config.bee.flightRandomness,
    state.config.bee.flightRandomness
  );
  b.y += getRandomArbitrary(
    -state.config.bee.flightRandomness,
    state.config.bee.flightRandomness
  );

  // if the bee is in range of a flower, switch to gathering pollen
  const flowers: Flower[] = state.objects.filter(
    (o) =>
      o.type === "flower" &&
      Math.abs(o.x - b.x) < state.config.bee.objectDetectionRange &&
      Math.abs(o.y - b.y) < state.config.bee.objectDetectionRange
  ) as Flower[];

  let thisBeeJustCollectedPollen = false;
  flowers.forEach((f) => {
    // if the bee just collected pollen from some flower, don't collect again from another flower.
    if (thisBeeJustCollectedPollen) return;

    if (
      Math.abs(f.x - b.x) < state.config.bee.objectInteractionRange &&
      Math.abs(f.y - b.y) < state.config.bee.objectInteractionRange
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
      Math.abs(o.x - b.x) < state.config.bee.objectDetectionRange &&
      Math.abs(o.y - b.y) < state.config.bee.objectDetectionRange
  ) as TrailPoint[];

  if (nearbyTrailPoints.length) {
    // 1. get the vector created between the bee and the trail point farthest from the hive
    const farthestTrailPoint = nearbyTrailPoints.reduce(
      (acc, tp) => {
        const distanceFromHive = Math.sqrt(
          Math.pow(tp.x - GLOBAL_MAP_WIDTH / 2, 2) +
            Math.pow(tp.y - GLOBAL_MAP_HEIGHT / 2, 2)
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

    b.x += Math.cos(angle) * state.config.bee.trailPointAttraction;
    b.y += Math.sin(angle) * state.config.bee.trailPointAttraction;
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
    const angleIncrement = getRandomArbitrary(
      state.config.bee.rotationSpeedMin,
      state.config.bee.rotationSpeedMax
    );
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
  b.x = Math.max(0, Math.min(GLOBAL_MAP_WIDTH, b.x));
  b.y = Math.max(0, Math.min(GLOBAL_MAP_HEIGHT, b.y));
};

const gatheringPollenAI = (b: Bee, state: WorldState) => {
  const centerpoint = getCenterpoint(state);

  // if the bee is close to the centerpoint, switch back to wandering
  if (
    Math.abs(b.x - centerpoint.x) < state.config.bee.objectInteractionRange &&
    Math.abs(b.y - centerpoint.y) < state.config.bee.objectInteractionRange
  ) {
    b.state = "wandering";
    if (b.pollen > 0) {
      state.hive.pollen++;
      b.pollen--;
    }
    return;
  }

  // random chance of dropping a trail point
  if (Math.random() < state.config.bee.trailPointDropChance) {
    state.objects.push(trailPointBuilder({ x: b.x, y: b.y }, state));
  }

  moveTowardHive(b, state);
};

const hungryAi = (b: Bee, state: WorldState) => {
  // it dies if it's too hungry
  if (b.hunger > BEE_HUNGER_DEATH_THRESHOLD) {
    state.objects = state.objects.filter((o) => o.id !== b.id);
    return;
  }

  // if the bee is hungry, it eats any pollen it's carrying
  if (b.pollen > 0) {
    b.pollen--;
    b.hunger -= POLLEN_FOOD_VALUE;
    b.state = "wandering";
    return;
  }
  // if there is no pollen being carried, the bee moves towards the hive to eat
  moveTowardHive(b, state);

  // if it has reached the hive, it eats
  const centerpoint = getCenterpoint(state);
  if (
    Math.abs(b.x - centerpoint.x) < state.config.bee.objectInteractionRange &&
    Math.abs(b.y - centerpoint.y) < state.config.bee.objectInteractionRange
  ) {
    if (state.hive.pollen > 0) {
      state.hive.pollen--;
      b.hunger -= POLLEN_FOOD_VALUE;
      b.state = "wandering";
    }
  }
};

const ai = (b: Bee, state: WorldState) => {
  // chance to increase hunger
  if (Math.random() < BEE_HUNGER_INCREASE_RATE) {
    b.hunger += 1;
  }

  if (b.hunger > state.config.bee.hungerFeedingThreshold) {
    hungryAi(b, state);
    return;
  }

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
    hunger: 0,
    direction: Math.random() > 0.5 ? -1 : 1,
    id: getNextObjectId(),
    ...getCenterpoint(state),
    ai,
    ...b,
  };
};

const getCenterpoint = (state: WorldState) => {
  return {
    x: GLOBAL_MAP_WIDTH / 2,
    y: GLOBAL_MAP_HEIGHT / 2,
  };
};
