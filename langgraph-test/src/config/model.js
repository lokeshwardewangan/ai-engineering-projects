import { ChatOpenAI } from "@langchain/openai";
import { tools } from "../tools/mathTools.js";

export const model = new ChatOpenAI({
    model: "gpt-4o",
    
})

export const modelWithTool = model.bindTools(tools);
