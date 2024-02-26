import { beeBuilder } from "../bees/beeBuilder";
import type { WorldState } from "../bees/types";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createOpenAIToolsAgent, AgentExecutor } from "langchain/agents";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import z from "zod";
import { getCenterpoint } from "@src/bees/utils";

const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;

export const requestAgent = async (message: string, state: WorldState) => {
  const centerpoint = getCenterpoint(state);

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
  ];

  const llm = new ChatOpenAI({
    modelName: "gpt-4",
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
    verbose: true,
    maxIterations: 1,
  });

  return agentExecutor.invoke({
    state: JSON.stringify(state, null, 2),
  });
};
