"use client";

import React, { useState, useEffect } from "react";
import { ProcessedTask } from "../actions/getTasks";
import { updateTask } from "../actions/updateTask";
import { deleteTask } from "../actions/deleteTask";
import { FaEdit, FaTrash } from "react-icons/fa";

type TaskWithStatus = ProcessedTask & { isDirty: boolean };

interface ActiveTasksProps {
  tasks: ProcessedTask[];
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({ tasks }) => {
  const [activeTasks, setActiveTasks] = useState<TaskWithStatus[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const inputStyle = "w-full border border-gray-300 rounded-xl text-sm p-2";

  useEffect(() => {
    setActiveTasks(tasks.map((task) => ({ ...task, isDirty: false })));
  }, [tasks]);

  const updateTaskField = <K extends keyof ProcessedTask>(
    index: number,
    field: K,
    value: ProcessedTask[K]
  ) => {
    const updatedTasks = [...activeTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value,
      isDirty: true,
    };
    setActiveTasks(updatedTasks);
  };

  const handleSave = async (index: number) => {
    const taskToSave = activeTasks[index];
    if (!taskToSave.isDirty) return;

    setIsSubmitting(taskToSave._id);
    const updateData = {
      description: taskToSave.description,
      deadline: taskToSave.deadline,
      remindBefore1Day: taskToSave.remindBefore1Day,
      remindBefore3Days: taskToSave.remindBefore3Days,
      remindBefore7Days: taskToSave.remindBefore7Days,
    };
    const result = await updateTask(taskToSave._id, updateData);
    console.log("Save Result:", result.message);
    setIsSubmitting(null);
  };

  const handleDelete = async (index: number) => {
    const taskToDelete = activeTasks[index];
    if (window.confirm(`Delete "${taskToDelete.description}"?`)) {
      setIsSubmitting(taskToDelete._id);
      const result = await deleteTask(taskToDelete._id);
      console.log("Delete Result:", result.message);
      setIsSubmitting(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-light mb-4">Active Tasks</h2>
      <div className="flex flex-col items-center w-full">
        {activeTasks.map((task, index) => (
          <div
            key={task._id}
            className="w-full flex items-center flex-row p-4 border-b"
          >
            <div className="flex flex-row justify-evenly items-center w-[75%]">
              <div className="mb-2 w-1/3">
                <input
                  type="text"
                  className={inputStyle}
                  value={task.description}
                  onChange={(e) =>
                    updateTaskField(index, "description", e.target.value)
                  }
                />
              </div>
              <div className="mb-2">
                <input
                  type="date"
                  className={inputStyle}
                  value={task.deadline.slice(0, 10)}
                  onChange={(e) =>
                    updateTaskField(index, "deadline", e.target.value)
                  }
                />
              </div>
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={task.remindBefore1Day}
                    onChange={(e) =>
                      updateTaskField(
                        index,
                        "remindBefore1Day",
                        e.target.checked
                      )
                    }
                  />{" "}
                  1 Day
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={task.remindBefore3Days}
                    onChange={(e) =>
                      updateTaskField(
                        index,
                        "remindBefore3Days",
                        e.target.checked
                      )
                    }
                  />{" "}
                  3 Days
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={task.remindBefore7Days}
                    onChange={(e) =>
                      updateTaskField(
                        index,
                        "remindBefore7Days",
                        e.target.checked
                      )
                    }
                  />{" "}
                  7 Days
                </label>
              </div>
            </div>
            <div className="w-[20%] flex items-center justify-center gap-2">
              <button
                onClick={() => handleSave(index)}
                disabled={!task.isDirty || isSubmitting === task._id}
                className={`flex items-center text-sm justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-colors ${
                  task.isDirty
                    ? "bg-blue-500 cursor-pointer hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                } disabled:opacity-50`}
              >
                <FaEdit />
                {isSubmitting === task._id ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => handleDelete(index)}
                disabled={isSubmitting === task._id}
                className="flex items-center cursor-pointer text-sm justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveTasks;
