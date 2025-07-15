import React from "react";
import { ProcessedTask } from "../actions/getTasks";

interface TaskTableProps {
  tasks: ProcessedTask[];
}

const TaskRow: React.FC<{ task: ProcessedTask }> = ({ task }) => {
  return <div className="">{task.description}</div>;
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  return (
    <div>
      {tasks
        ? tasks.map((task, i) => {
            return <TaskRow key={i} task={task} />;
          })
        : null}
    </div>
  );
};

export default TaskTable;
