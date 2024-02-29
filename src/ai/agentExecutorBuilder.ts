import { beeBuilder } from "../bees/beeBuilder";
import type { WorldState } from "../bees/types";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createOpenAIToolsAgent, AgentExecutor } from "langchain/agents";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import z from "zod";
import { getCenterpoint } from "@src/bees/utils";
import { flowerBuilder } from "@src/bees/flowerBuilder";
import {} from "@langchain/core/memory";
import { BufferMemory } from "langchain/memory";

const OPENAI_KEY = import.meta.env.VITE_OPENAI_CREDS;

// singleton for now
// const memory = new BufferMemory();

export const requestAgent = async (message: string, state: WorldState) => {
  // add all the tools here
  const tools = [
    new DynamicStructuredTool({
      name: "createBee",
      description:
        "Creates a single bee at the provided x/y coordinates. The params take the form of { x: number, y: number }, where X will be the x coordinate and Y will be the y coordinate of the new bee.",
      schema: z
        .object({
          x: z.number().nonnegative(),
          y: z.number().nonnegative(),
        })
        .strict(),
      func: async (params) => {
        const newBee = beeBuilder({ x: params.x, y: params.y }, state);
        state.objects.push(newBee);
        return "A new bee was created at " + JSON.stringify(params);
      },
    }),
    new DynamicStructuredTool({
      name: "createFlower",
      description:
        "Creates a single flower at the provided x/y coordinates. The params take the form of { x: number, y: number }, where X will be the x coordinate and Y will be the y coordinate of the new flower.",
      schema: z
        .object({
          x: z.number().nonnegative(),
          y: z.number().nonnegative(),
        })
        .strict(),
      func: async (params) => {
        const newFlower = flowerBuilder({ x: params.x, y: params.y }, state);
        state.objects.push(newFlower);
        return "A new flower was created at " + JSON.stringify(params);
      },
    }),
    // change parameters as per the requirement
    /*
export type WorldState = {
  config: {
    bee: {
      flightRandomness: number;
      objectDetectionRange: number;
      objectInteractionRange: number;
      trailPointAttraction: number;
      rotationSpeedMin: number;
      rotationSpeedMax: number;
      trailPointDropChance: number;
      hungerFeedingThreshold: number;
      trailpointCreationMinStrength: number;
      trailpointCreationMaxStrength: number;
    };
    hive: {
      pollenStockpileMinimum: number;
    };
    flower: {
      creationChance: number;
    };
  };
  controls: {
    isRunning: boolean;
    speed: number;
    brush: "bee" | "flower" | "trail-point" | "erase";
  };
  hive: {
    pollen: number;
  };
  objects: WorldObject[];
};

    */
    new DynamicStructuredTool({
      name: "updateConfigOrControls",
      description:
        "Updates the state object. Only affects the 'config' or the 'controls' keys. state.config has bee, hive, flower as keys. state.controls has isRunning, speed, brush as keys. configuration of the simulation. All keys are optional.",
      schema: z.object({
        config: z
          .object({
            bee: z
              .object({
                flightRandomness: z.number().optional(),
                objectDetectionRange: z.number().optional(),
                objectInteractionRange: z.number().optional(),
                trailPointAttraction: z.number().optional(),
                rotationSpeedMin: z.number().optional(),
                rotationSpeedMax: z.number().optional(),
                trailPointDropChance: z.number().optional(),
                hungerFeedingThreshold: z.number().optional(),
                trailpointCreationMinStrength: z.number().optional(),
                trailpointCreationMaxStrength: z.number().optional(),
              })
              .optional(),
            hive: z
              .object({
                pollenStockpileMinimum: z.number().optional(),
              })
              .optional(),
            flower: z
              .object({
                creationChance: z.number().optional(),
              })
              .optional(),
          })
          .optional(),
        controls: z
          .object({
            isRunning: z.boolean().optional(),
            speed: z.number().optional(),
            brush: z.enum(["bee", "flower", "trail-point", "erase"]).optional(),
          })
          .optional(),
      }),
      func: async (params) => {
        // returns { controls: { isRunning: false }} or { config: { bee: { flightRandomness: 0.5 }}}
        // recursively update the state object

        console.log("params", params);

        if (params.controls) {
          Object.entries(params.controls).forEach(([k, v]) => {
            // @ts-expect-error - this is fine
            if (v !== undefined) state.controls[k] = v;
          });
        }

        if (params.config) {
          Object.entries(params.config).forEach(([k1, v1]) => {
            Object.entries(v1).forEach(([k2, v2]) => {
              // @ts-expect-error - this is fine
              if (v2 !== undefined) state.config[k1][k2] = v2;
            });
          });
        }

        return (
          "/* Here is the updated config */ " +
          JSON.stringify(
            { config: state.config, controls: state.controls },
            null,
            2
          )
        );
      },
    }),
  ];

  const llm = new ChatOpenAI({
    modelName: "gpt-4-0125-preview",
    temperature: 0,
    openAIApiKey: OPENAI_KEY,
  });

  // const prompt = ChatPromptTemplate.fromMessages([
  //   ["system", "The bees are buzzing around the garden."],
  // ]);

  // const prompt = new ChatPromptTemplate({
  //   inputVariables: ["agent_scratchpad"],
  // });

  const agent = await createOpenAIToolsAgent({
    llm,
    tools,
    prompt: ChatPromptTemplate.fromMessages([
      [
        "system",
        `
# High level overview

You are an AI that controls a simulation of bees in a garden. The bees collect pollen from flowers and bring it back to the hive.

# Agent Scratchpad

{agent_scratchpad}

# Detailed overview of simulation

The simulation consists of 4 element types

* Bees - represented by yellow squares on the screen. 
* Flowers - represented by pink circles on the screen.
* Hive - represented by a brown circle on the screen.
* Trail points - represented by tiny pink dots on the screen.


## Bees

The bees have a few different behaviors. They can collect pollen from flowers, drop trail points, return to the hive to deposit pollen, and try to satisfy their own hunger. If a bee's hunger reaches 100, it dies and is removed from the simulation.

## Flowers

The flowers have a set amount of pollen that the bees can collect. Once a flower is empty, it is removed from the simulation. Flowers are randomly generated in the garden and do not decay.

## Hive

The hive has a stockpile of pollen that the bees can deposit their pollen into. Once the hive has enough pollen, it can create a new bee. The hive can be set to have a stockpile level of pollen, and will not create a new bee until it has more pollen than the stockpile level. The hive contains a certain amount of pollen at the start of the simulation. The hive is never removed from the simulation, and is always in the center of the garden.

## Trail Points

Trail points are dropped by bees that are returning with pollen to the hive, and indicate the presence of a flower. When a bee finds a flower and collects pollen, it starts moving back to the hive. As it returns, it drops trail points at a semi-random frequency. These trail points are then used as a trail that leads back to a flower. Bees that find a trail point will always follow it to the flower. Trail points have a strength value that decreases each time a bee follows it. Once the strength reaches 0, the trail point is removed from the simulation.

# Simulation Controls

The simulation is controlled by a set of commands that the AI can execute. These commands are provided to the AI as a set of tools that it can use to interact with the simulation. Please see the list of tools available for more information.

# Current state

Here is the current state of the simulation:

{state}

`,
      ],
      ["human", message],
    ]),
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    // memory,
    verbose: true,
    maxIterations: 1,
  });

  const result = await agentExecutor.invoke({
    state: JSON.stringify(state, null, 2),
  });

  return {
    result,
    // memory,
  };
};
