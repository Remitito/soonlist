import { auth } from "@/auth";
import { getTasks } from "./actions/getTasks";
import TaskForm from "./(components)/TaskForm";
import TaskTable from "./(components)/TaskTable";

export default async function Home() {
  const session = await auth();
  const tasks = session?.user?.id
    ? (await getTasks(session.user.id)) || []
    : [];

  return (
    <div className="w-full">
      <button></button>
      <span>{session && session.user?.email}</span>
      <TaskForm />
      <TaskTable tasks={tasks} />
    </div>
  );
}
