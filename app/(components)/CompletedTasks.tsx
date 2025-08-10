import { ProcessedTask } from "../actions/getTasks";
import { SiTicktick } from "react-icons/si";

interface CompletedTasksProps {
  tasks: ProcessedTask[];
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ tasks }) => {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-light mb-4">Past deadlines</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((task, i) => (
          <div
            key={"task" + i}
            className="flex flex-row items-start p-3 rounded-lg min-w-0"
          >
            <SiTicktick className="flex-shrink-0 text-green-500 text-2xl mr-3 mt-1" />
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-sm break-words  mb-2">{task.description}</p>
              <p className="italic text-xs text-gray-200">
                Deadline was on: {task.deadline.slice(0, 10)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="text-gray-500 text-center mt-8">
          No past deadlines available.
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
