import { auth } from "@/auth";
import { getTasks, ProcessedTask } from "./actions/getTasks";
import TaskForm from "./(components)/TaskForm";
import ActiveTasks from "./(components)/ActiveTasks";
import CompletedTasks from "./(components)/CompletedTasks";
import Navbar from "./(components)/Navbar";

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
    <div className="w-full flex flex-col justify-center items-center">
      <Navbar loggedIn={session ? true : false} />
      <div className="w-full text-flex flex-col justify-center items-center">
        <TaskForm loggedIn={session ? true : false} />
        <ActiveTasks tasks={activeTasks} />
        <CompletedTasks tasks={completeTasks} />
      </div>
    </div>
  );
}
