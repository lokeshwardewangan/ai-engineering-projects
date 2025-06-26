import { tool } from "langchain";
import {
  createTodo,
  findAllTodos,
  findByIdAndDeleteTodo,
  findByIdAndUpdateTodo,
  findTodoBySearch,
} from "../services/todoServices.js";
import {
  deleteTodoSchema,
  emptySchema,
  insertTodoSchema,
  searchTodoSchema,
  updateTodoSchema,
} from "../schema/todoSchema.js";

export const getAllTodos = tool(
  async () => {
    const data = await findAllTodos();
    return JSON.stringify(data);
  },
  {
    name: "get_all_todos",
    description:
      "use this tool when user want to see list or view all of their exiting task or todos",
    schema: emptySchema,
  },
);

export const insertTodo = tool(
  async (input) => {
    const data = await createTodo(input.todo);
    return JSON.stringify(data);
  },
  {
    name: "insert_todo",
    description:
      "use this tool when user request to create or add new task item on list",
    schema: insertTodoSchema,
  },
);

export const deleteTodo = tool(
  async (input) => {
    const data = await findByIdAndDeleteTodo(input.id);
    return JSON.stringify(data);
  },
  {
    name: "delete_todo",
    description:
      "use this tool when user request to delete existing task or todo item from list",
    schema: deleteTodoSchema,
  },
);

export const searchTodo = tool(
  async (input) => {
    const data = await findTodoBySearch(input.search);
    return JSON.stringify(data);
  },
  {
    name: "search_todo",
    description:
      "use this tool when user want to search todo or task by provided search text from their existing todo item list",
    schema: searchTodoSchema,
  },
);

export const updateTodo = tool(
  async (input) => {
    const data = await findByIdAndUpdateTodo(input.id, input.newTodo);
    return JSON.stringify(data);
  },
  {
    name: "update_todo",
    description:
      "use this tool when user request to update their existing task or todo on their item list",
    schema: updateTodoSchema,
  },
);
