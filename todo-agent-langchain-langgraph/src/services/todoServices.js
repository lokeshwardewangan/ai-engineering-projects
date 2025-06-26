import { ilike } from "drizzle-orm";
import {todosTable} from "../db/schema.js"
import {db} from "../db/index.js";

export async function findAllTodos() {
  const todos = await db.select().from(todosTable);
  if(todos.length === 0) return "Your todo task is empty."
  return todos;
}

export async function createTodo(todo) {
  const [createdTodos] = await db
    .insert(todosTable)
    .values({ todo: todo })
    .returning();
  return createdTodos.id;
}

export async function findByIdAndDeleteTodo(id) {
  await db.delete(todosTable).where(eq(todosTable.id, id));
}

export async function findTodoBySearch(search) {
  const todo = await db
    .select()
    .from(todosTable)
    .where(ilike(todosTable.todo, `%${search}%`));

  return todo;
}

export async function findByIdAndUpdateTodo(id, newTodo) {
  const todos = await db
    .update(todosTable)
    .set({
      todo: newTodo,
    })
    .where(eq(todosTable.id, id))

  return todos;
}


await findAllTodos();