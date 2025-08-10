"use client";

import React, { useState } from "react";
import { ProcessedTask } from "./actions/getTasks";
import TaskForm from "./(components)/TaskForm";
import ActiveTasks from "./(components)/ActiveTasks";
import CompletedTasks from "./(components)/CompletedTasks";

interface HomeClientProps {
  activeTasks: ProcessedTask[];
  completeTasks: ProcessedTask[];
  loggedIn: boolean;
}

const HomeClient: React.FC<HomeClientProps> = ({
  activeTasks,
  completeTasks,
  loggedIn,
}) => {
  const [showTaskForm, setShowTaskForm] = useState<boolean>(
    activeTasks.length == 0
  );

  return (
    <div className="w-full text-flex flex-col justify-center items-center">
      {showTaskForm && (
        <TaskForm setShowTaskForm={setShowTaskForm} loggedIn={loggedIn} />
      )}
      <ActiveTasks
        showTaskForm={showTaskForm}
        setShowTaskForm={setShowTaskForm}
        tasks={activeTasks}
      />
      <CompletedTasks tasks={completeTasks} />
    </div>
  );
};

export default HomeClient;
