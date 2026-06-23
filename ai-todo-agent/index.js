import { db } from "./src/index.js";
import { todosTable } from "./src/db/schema.js";
import { eq, ilike } from "drizzle-orm";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function getAllTodos() {
  const todos = await db.select().from(todosTable);
  return todos;
}


async function createTodo(todo) {
  const [result] = await db
    .insert(todosTable)
    .values({
      todo,
    })
    .returning({
      id: todosTable.id,
    });
  return result.id;
}

async function searchTodo(search) {
  const todos = await db
    .select()
    .from(todosTable)
    .where(ilike(todosTable.todo, `%${search}%`));
  return todos;
}

async function deleteTodoById(id) {
  await db.delete(todosTable).where(eq(todosTable.id, id));
}

const tools = {
  getAllTodos: getAllTodos,
  createTodo: createTodo,
  searchTodo: searchTodo,
  deleteTodoById: deleteTodoById,
};

const SYSTEM_PROMPT = `

You are an AI To-Do List Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action. Once you get the observation, Return the AI response based on START prompt and observation

You can manage tasks by adding, viewing, updating, and deleting them, 
You must strictly follow the JSON output format.

Todo DB Schema: 
id: Int and Primary Key
todo: String
created_at: DateTime
updated_at: DateTime

Available Tools:
- getAllTodos(): Return all the Todos from Database
- createTodo(todo:string): Create a new Todo in the DB and takes as a string and return the ID of created todo
- deleteTodoById(id:string): Delete the todo by ID given in the DB
- searchTodo(search:string): Searches for all todos matching their query string using ilike operator


Example:
START 
{"type": "user", "user": "Add a task for shopping gloceries"},
{"type": "plan", "plan": "I will try to get more context on what user needs to shop"},
{"type": "output", "output": "Can you tell me what all items you want to shop for?"},
{"type": "user", "user": "I want to shop for milk, kurkure, layes and choco."},
{"type": "plan", "user": "I will use createTodo to create a new Todo in DB"},
{"type": "action", "function": "createTodo", "input": "Shopping for milk, kurkure, lays and choco."},
{"type": "observation", "observation": "2"},
{"type": "output", "output": "Your todo has been added successfully"},

`;

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

while (true) {
  const query = readlineSync.question(">> ");
  const userMessage = {
    type: "user",
    user: query,
  };
  messages.push({ role: "user", content: JSON.stringify(userMessage) });

  while (true) {
    // 1️⃣ using openai sdk
    const chat = await client.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      response_format: { type: "json_object" },
    });
    const result = chat.choices[0].message.content;

    // 2️⃣ using gemini sdk
    // const chat = await gemini.models.generateContent({
    //   model: "gemini-2.0-flash",
    //   contents: messages.map((m) => ({
    //     role: m.role === "assistant" ? "model" : "user",
    //     parts: [{ text: m.content }],
    //   })),
    //   config: {
    //     systemInstruction: SYSTEM_PROMPT,
    //     responseMimeType: "application/json",
    //   },
    // });
    // const result = chat.text;

    messages.push({ role: "assistant", content: result });


    //-> Debug Every Steps
    // console.log("\n\n ---------- START AI ---------- ");
    // console.log(result);
    // console.log("---------- END AI ---------- \n\n");

    const action = JSON.parse(result);

    if (action.type === "output") {
      console.log(`🤖: ${action.output}`);
      break;
    } else if (action.type === "action") {
      const fn = tools[action.function];
      if (!fn) throw new Error("Invalid tool call");
      const observation = await fn(action.input, action.input.todo);
      const observationMessage = {
        type: "observation",
        observation: observation,
      };
      messages.push({
        role: "developer",
        content: JSON.stringify(observationMessage),
      });
    }
  }
}
