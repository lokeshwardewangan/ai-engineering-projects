import * as z from "zod";

export const emptySchema = z.object({});

export const insertTodoSchema = z.object({
  todo: z.string().describe("A todo text to create new todo"),
});

export const deleteTodoSchema = z.object({
  id: z.number().describe("numbe id for delete todo"),
});

export const searchTodoSchema = z.object({
  search: z.string().describe("A text to search todos"),
});

export const updateTodoSchema = z.object({
    id: z.number().describe("number id of todo"), 
    newTodo: z.string().describe("A new todo which needs to update")
})