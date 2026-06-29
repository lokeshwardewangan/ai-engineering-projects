import concurrently from "concurrently";

const { result } = concurrently([
  {
    command: "bun run dev",
    cwd: "packages/frontend",
    name: "frontend",
    prefixColor: "green"
},
{
    command: "bun run dev",
    cwd: "packages/backend",
    name: "backend",
    prefixColor: "cyan"
  },
]);

result.catch(console.error);