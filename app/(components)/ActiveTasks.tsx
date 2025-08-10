"use client";

import React, { useState, useEffect } from "react";
import { ProcessedTask } from "../actions/getTasks";
import { updateTask } from "../actions/updateTask";
import { deleteTask } from "../actions/deleteTask";
import { FaEdit, FaTrash, FaThumbsUp, FaPlus } from "react-icons/fa";
import StatusPopup from "./StatusPopup";
import DecisionPopup from "./DecisionPopup";
import { getDaysUntilDeadline } from "../utils/DateStuff";
import { TaskDisplay } from "./TaskDisplay";

export type TaskWithStatus = ProcessedTask & {
  isDirty: boolean;
  originalValues: ProcessedTask;
  editing: boolean;
};

interface ActiveTasksProps {
  tasks: ProcessedTask[];
  setShowTaskForm: (val: boolean) => void;
  showTaskForm: boolean;
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({
  tasks,
  setShowTaskForm,
  showTaskForm,
}) => {
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split("T")[0];
  const inputStyle =
    "w-full border border-gray-300 rounded-xl text-sm p-2 bg-white";

  useEffect(() => {
    setActiveTasks(
      tasks.map((task) => ({
        ...task,
        isDirty: false,
        editing: false,
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
      current.remindBefore1Days !== original.remindBefore1Days ||
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

    if (field === "deadline" && typeof value === "string") {
      const daysUntilDeadline = getDaysUntilDeadline(value);

      if (daysUntilDeadline <= 1) {
        updatedTask.remindBefore1Days = false;
      }
      if (daysUntilDeadline < 3) {
        updatedTask.remindBefore3Days = false;
      }
      if (daysUntilDeadline < 7) {
        updatedTask.remindBefore7Days = false;
      }
    }

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

  const handleEditSave = async (index: number) => {
    const task = activeTasks[index];

    if (!task.editing) {
      const updatedTasks = [...activeTasks];
      updatedTasks[index] = {
        ...updatedTasks[index],
        editing: true,
      };
      setActiveTasks(updatedTasks);
      return;
    }

    if (!task.isDirty) {
      const updatedTasks = [...activeTasks];
      updatedTasks[index] = {
        ...updatedTasks[index],
        editing: false,
      };
      setActiveTasks(updatedTasks);
      return;
    }

    if (!task.description.trim()) {
      setStatusPopup({
        message: "Description cannot be empty.",
        type: "error",
      });
      return;
    }

    setIsSubmitting({ id: task._id, action: "save" });
    const result = await updateTask(task._id, {
      description: task.description,
      deadline: task.deadline,
      remindBefore1Days: task.remindBefore1Days,
      remindBefore3Days: task.remindBefore3Days,
      remindBefore7Days: task.remindBefore7Days,
      completed: task.completed,
    });

    if (result.message.startsWith("Success")) {
      const updatedTasks = [...activeTasks];
      updatedTasks[index] = {
        ...updatedTasks[index],
        isDirty: false,
        editing: false,
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
      <div className="mb-4 md:mb-8 w-full flex flex-row items-center">
        <h2 className="text-2xl md:text-3xl w-5/6 md:w-auto font-light">
          Upcoming Deadlines
        </h2>
        {!showTaskForm && (
          <button
            className={`cursor-pointer sm:hover:bg-green-600 mr-20 md:mr-0 flex-1 ml-8 md:flex-none h-10 md:h-auto flex items-center text-sm justify-center gap-2 px-4 py-2 rounded-full text-white bg-green-500 font-semibold transition-colors`}
            onClick={() => setShowTaskForm(true)}
          >
            <FaPlus />
            New
          </button>
        )}
      </div>
      <div className="flex flex-col items-center w-full space-y-2">
        {activeTasks.map((task, index) => (
          <div
            key={task._id}
            className="w-full flex flex-col lg:flex-row lg:items-center p-4 "
          >
            <TaskDisplay
              task={task}
              index={index}
              updateTaskField={updateTaskField}
              tomorrowString={tomorrowString}
              inputStyle={inputStyle}
            />
            <div className="w-full lg:w-auto flex flex-row sm:flex-row lg:flex-col xl:flex-row gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-4">
              <button
                onClick={() => handleEditSave(index)}
                disabled={isSubmitting.id === task._id}
                className={`flex-1 w-32 lg:flex-none flex bg-blue-500 items-center text-sm justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-colors ${
                  isSubmitting.id !== task._id
                    ? "cursor-pointer hover:bg-blue-600"
                    : "opacity-60 cursor-not-allowed"
                } disabled:opacity-50`}
              >
                <FaEdit />
                {isSubmitting.id === task._id && isSubmitting.action === "save"
                  ? "Saving..."
                  : task.editing
                  ? "Save"
                  : "Edit"}
              </button>
              <button
                onClick={() => handleComplete(index)}
                disabled={task.editing || isSubmitting.id === task._id}
                className={`flex-1 lg:flex-none w-32 flex items-center text-sm justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-colors ${
                  !task.editing && isSubmitting.id !== task._id
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
                disabled={task.editing || isSubmitting.id === task._id}
                className={`flex-1 lg:flex-none w-32 flex items-center text-sm justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-colors ${
                  !task.editing && isSubmitting.id !== task._id
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
          No upcoming deadlines available.
        </div>
      )}
    </div>
  );
};

export default ActiveTasks;
