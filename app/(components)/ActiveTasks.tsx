"use client";

import React, { useState, useEffect } from "react";
import { ProcessedTask } from "../actions/getTasks";
import { updateTask } from "../actions/updateTask";
import { deleteTask } from "../actions/deleteTask";
import { FaEdit, FaTrash, FaThumbsUp } from "react-icons/fa";
import StatusPopup from "./StatusPopup";
import DecisionPopup from "./DecisionPopup";

type TaskWithStatus = ProcessedTask & {
  isDirty: boolean;
  originalValues: ProcessedTask;
};

interface ActiveTasksProps {
  tasks: ProcessedTask[];
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({ tasks }) => {
  const [activeTasks, setActiveTasks] = useState<TaskWithStatus[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<{
    id: string | null;
    action: "save" | "delete" | "complete" | null;
  }>({ id: null, action: null });
  const [statusPopup, setStatusPopup] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deletionTargetId, setDeletionTargetId] = useState<string | null>(null);

  const todayString = new Date().toISOString().split("T")[0];
  const inputStyle =
    "w-full border border-gray-300 rounded-xl text-sm p-2 bg-white";

  useEffect(() => {
    setActiveTasks(
      tasks.map((task) => ({
        ...task,
        isDirty: false,
        originalValues: { ...task },
      }))
    );
  }, [tasks]);

  const checkIsDirty = (
    current: ProcessedTask,
    original: ProcessedTask
  ): boolean => {
    return (
      current.description !== original.description ||
      current.deadline !== original.deadline ||
      current.remindBefore1Day !== original.remindBefore1Day ||
      current.remindBefore3Days !== original.remindBefore3Days ||
      current.remindBefore7Days !== original.remindBefore7Days
    );
  };

  const updateTaskField = <K extends keyof ProcessedTask>(
    index: number,
    field: K,
    value: ProcessedTask[K]
  ) => {
    const updatedTasks = [...activeTasks];
    const updatedTask = {
      ...updatedTasks[index],
      [field]: value,
    };

    const isDirty = checkIsDirty(
      updatedTask,
      updatedTasks[index].originalValues
    );

    updatedTasks[index] = {
      ...updatedTask,
      isDirty,
    };
    setActiveTasks(updatedTasks);
  };

  const handleSave = async (index: number) => {
    const taskToSave = activeTasks[index];
    if (!taskToSave.isDirty) return;

    if (!taskToSave.description.trim()) {
      setStatusPopup({
        message: "Description cannot be empty.",
        type: "error",
      });
      return;
    }

    setIsSubmitting({ id: taskToSave._id, action: "save" });
    const result = await updateTask(taskToSave._id, {
      description: taskToSave.description,
      deadline: taskToSave.deadline,
      remindBefore1Day: taskToSave.remindBefore1Day,
      remindBefore3Days: taskToSave.remindBefore3Days,
      remindBefore7Days: taskToSave.remindBefore7Days,
      completed: taskToSave.completed,
    });

    if (result.message.startsWith("Success")) {
      const updatedTasks = [...activeTasks];
      updatedTasks[index] = {
        ...updatedTasks[index],
        isDirty: false,
        originalValues: { ...updatedTasks[index] },
      };
      setActiveTasks(updatedTasks);
    }

    setStatusPopup({
      message: result.message,
      type: result.message.startsWith("Success") ? "success" : "error",
    });
    setIsSubmitting({ id: null, action: null });
  };

  const handleComplete = async (index: number) => {
    const taskToComplete = activeTasks[index];
    setIsSubmitting({ id: taskToComplete._id, action: "complete" });
    const result = await updateTask(taskToComplete._id, {
      ...taskToComplete,
      completed: true,
    });

    setStatusPopup({
      message: result.message,
      type: result.message.startsWith("Success") ? "success" : "error",
    });
    setIsSubmitting({ id: null, action: null });
  };

  const handleDelete = (index: number) => {
    setDeletionTargetId(activeTasks[index]._id);
  };

  const confirmDelete = async () => {
    if (!deletionTargetId) return;
    setIsSubmitting({ id: deletionTargetId, action: "delete" });
    const result = await deleteTask(deletionTargetId);
    setStatusPopup({
      message: result.message,
      type: result.message.startsWith("Success") ? "success" : "error",
    });
    setIsSubmitting({ id: null, action: null });
    setDeletionTargetId(null);
  };

  return (
    <div className="p-4 md:p-8">
      {statusPopup && (
        <StatusPopup
          message={statusPopup.message}
          type={statusPopup.type}
          onClose={() => setStatusPopup(null)}
        />
      )}
      <DecisionPopup
        isOpen={deletionTargetId !== null}
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeletionTargetId(null)}
      />

      <h2 className="text-3xl font-light mb-4">Active Tasks</h2>
      <div className="flex flex-col items-center w-full space-y-4">
        {activeTasks.map((task, index) => (
          <div
            key={task._id}
            className="w-full flex flex-col lg:flex-row lg:items-center gap-4 p-4 "
          >
            {/* Inputs */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor={`desc-${task._id}`}
                  className="text-xs font-medium text-gray-500 mb-1"
                >
                  Description
                </label>
                <input
                  id={`desc-${task._id}`}
                  type="text"
                  className={inputStyle}
                  value={task.description}
                  onChange={(e) =>
                    updateTaskField(index, "description", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor={`date-${task._id}`}
                  className="text-xs font-medium text-gray-500 mb-1"
                >
                  Deadline
                </label>
                <input
                  id={`date-${task._id}`}
                  type="date"
                  className={inputStyle}
                  min={todayString}
                  value={task.deadline.slice(0, 10)}
                  onChange={(e) =>
                    updateTaskField(index, "deadline", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col md:col-span-2 lg:col-span-1">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Reminders
                </label>
                <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 items-center min-h-[40px]">
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
            </div>

            {/* Buttons */}
            <div className="w-full lg:w-auto flex flex-row sm:flex-row lg:flex-col xl:flex-row gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-4">
              <button
                onClick={() => handleSave(index)}
                disabled={!task.isDirty || isSubmitting.id === task._id}
                className={`flex-1 w-32 lg:flex-none flex bg-blue-500 items-center text-sm justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-colors ${
                  task.isDirty && isSubmitting.id !== task._id
                    ? "cursor-pointer hover:bg-blue-600"
                    : "opacity-60 cursor-not-allowed"
                } disabled:opacity-50`}
              >
                <FaEdit />
                {isSubmitting.id === task._id && isSubmitting.action === "save"
                  ? "Saving..."
                  : "Save"}
              </button>
              <button
                onClick={() => handleComplete(index)}
                disabled={task.isDirty || isSubmitting.id === task._id}
                className={`flex-1 lg:flex-none w-32 flex items-center text-sm justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-colors ${
                  !task.isDirty && isSubmitting.id !== task._id
                    ? "cursor-pointer bg-yellow-500 hover:bg-yellow-600"
                    : "opacity-60 cursor-not-allowed bg-yellow-400"
                } disabled:opacity-50`}
              >
                <FaThumbsUp />
                {isSubmitting.id === task._id &&
                isSubmitting.action === "complete"
                  ? "Completing..."
                  : "Complete"}
              </button>
              <button
                onClick={() => handleDelete(index)}
                disabled={task.isDirty || isSubmitting.id === task._id}
                className={`flex-1 lg:flex-none w-32 flex items-center text-sm justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-colors ${
                  !task.isDirty && isSubmitting.id !== task._id
                    ? "cursor-pointer bg-red-500 hover:bg-red-600"
                    : "opacity-60 cursor-not-allowed bg-red-400"
                } disabled:opacity-50`}
              >
                <FaTrash />
                {isSubmitting.id === task._id &&
                isSubmitting.action === "delete"
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {activeTasks.length === 0 && (
        <div className="text-gray-500 text-center mt-8">
          No active tasks available.
        </div>
      )}
    </div>
  );
};

export default ActiveTasks;
