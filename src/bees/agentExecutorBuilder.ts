import { beeBuilder } from "./beeBuilder";
import type { WorldState } from "./types";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createOpenAIToolsAgent, AgentExecutor } from "langchain/agents";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import z from "zod";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const agentExecutorBuilder = async (state: WorldState) => {
  // add all the tools here
  const tools = [
    new DynamicStructuredTool({
      name: "addOneBee",
      description: "Creates a single bee in the center of the map.",
      schema: z.object({}),
      func: async () => {
        state.bees.push(beeBuilder({}, state));
        return "Bee created";
      },
    }),
  ];

  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    openAIApiKey: OPENAI_API_KEY,
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
    prompt: ChatPromptTemplate.fromTemplate(
      "The bees are buzzing around the garden. {agent_scratchpad}"
    ),
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
    maxIterations: 1,
  });

  return agentExecutor;
};
