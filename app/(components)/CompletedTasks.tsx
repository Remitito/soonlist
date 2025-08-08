import { ProcessedTask } from "../actions/getTasks";
import { SiTicktick } from "react-icons/si";

interface CompletedTasksProps {
  tasks: ProcessedTask[];
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ tasks }) => {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-light mb-4">Recent Tasks</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((task, i) => (
          <div key={"task" + i} className="flex flex-row">
            <SiTicktick className="h-full text-green-500 text-3xl mb-2 mr-4" />
            <div className="flex flex-col">
              <p className="min-w-0 break-words text-sm w-2/3 md:w-auto">
                {task.description}
              </p>
              <p className="italic text-sm text-gray-500">
                Deadline was on: {task.deadline.slice(0, 10)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="text-gray-500 text-center mt-8">
          No completed tasks available.
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
