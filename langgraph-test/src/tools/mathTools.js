import * as z from "zod";
import { tool } from "@langchain/core/tools";

const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "add to numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const subtract = tool(({ a, b }) => a - b, {
  name: "subtract",
  description: "subtract two numbers",
  schema: z.object({
    a: z.number().describe("First Number"),
    b: z.number().describe("Second number"),
  }),
});

const divide = tool(({ a, b }) => a / b, {
  name: "divide",
  description: "Divide two numbers",
  schema: z.object({
    a: z.number().describe("First Number"),
    b: z.number().describe("Second Number"),
  }),
});

const multiply = tool(({ a, b }) => a * b, {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

export const toolsByName = {
  [add.name]: add,
  [subtract.name]: subtract,
  [multiply.name]: multiply,
  [divide.name]: divide,
};

export const tools = Object.values(toolsByName);
