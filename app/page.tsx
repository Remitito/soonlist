import { auth } from "@/auth";
import { getTasks } from "./actions/getTasks";
import TaskForm from "./(components)/TaskForm";
import TaskTable from "./(components)/TaskTable";
import Navbar from "./(components)/Navbar";

export default async function Home() {
  const session = await auth();
  const tasks = session?.user?.id
    ? (await getTasks(session.user.id)) || []
    : [];

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Navbar loggedIn={session ? true : false} />
      <div className="w-4/5 text-flex flex-col justify-center items-center">
        <TaskForm />
        <TaskTable tasks={tasks} />
      </div>
    </div>
  );
}
