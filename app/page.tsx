import { auth } from "@/auth";
import { getTasks, ProcessedTask } from "./actions/getTasks";
import HomeClient from "./HomeClient";

export default async function Home() {
  const session = await auth();
  let activeTasks: ProcessedTask[] = [];
  let completeTasks: ProcessedTask[] = [];

  if (session?.user?.id) {
    const result = await getTasks(session.user.id);
    if (result) {
      activeTasks = result.activeTasks;
      completeTasks = result.completeTasks;
    }
  }

  return (
    <HomeClient
      activeTasks={activeTasks}
      completeTasks={completeTasks}
      loggedIn={session ? true : false}
    />
  );
}
