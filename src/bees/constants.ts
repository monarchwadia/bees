export const GLOBAL_DEFAULT_SPEED = 100;
export const GLOBAL_MAP_WIDTH = 800;
export const GLOBAL_MAP_HEIGHT = 800;

export const NEW_BEE_COST = 10;

export const BEE_FLIGHT_RANDOMNESS = 7;
export const BEE_OBJ_DETECTION_RANGE = 50; // how far away the bee can see
export const BEE_OBJ_INTERACTION_RANGE = 10; // how close the bee needs to be to collect pollen, or to deposit it in the hive
export const BEE_TRAIL_POINT_POWER = 2; // how much the trail point influences the bee's movement
export const BEE_ROTATION_SPEED_MIN = 0.004;
export const BEE_ROTATION_SPEED_MAX = 0.008;
export const BEE_TRAIL_POINT_DROP_CHANCE = 0.2;
export const BEE_HUNGER_INCREASE_RATE = 0.03;
export const BEE_HUNGER_DEATH_THRESHOLD = 100;
export const BEE_HUNGER_FEEDING_THRESHOLD = 80;

export const FLOWER_CREATION_CHANCE = 0.001;
export const FLOWER_STARTING_POLLEN = 5;

export const POLLEN_FOOD_VALUE = 50;
export const POLLEN_STOCKPILE_MINIMUM = 25; // the hive will not create new bees if it has less than this amount of pollen
